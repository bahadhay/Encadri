import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, catchError, tap, delay } from 'rxjs/operators';
import { User } from '../models/user.model';

/**
 * Base44 Service
 * Core API client for Base44.com backend integration
 * Provides authentication and generic CRUD operations for all entities
 */
@Injectable({
  providedIn: 'root'
})
export class Base44Service {
  // TODO: Replace with your actual Base44 API URL from Base44 dashboard
  private readonly baseUrl = 'https://api.base44.com'; // Update this!

  // Development mode - set to true for mock authentication
  private readonly DEV_MODE = true;

  // Current user state management
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  // ========== Authentication Methods ==========

  /**
   * Get current authenticated user
   * @returns Observable<User>
   */
  me(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/auth/me`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Login user
   * @param email - User email
   * @param password - User password
   * @returns Observable<{ token: string, user: User }>
   */
  login(email: string, password: string): Observable<{ token: string; user: User }> {
    // Development mode - mock authentication
    if (this.DEV_MODE) {
      return this.mockLogin(email, password);
    }

    return this.http.post<{ token: string; user: User }>(
      `${this.baseUrl}/auth/login`,
      { email, password }
    ).pipe(
      tap(response => {
        // Store token
        localStorage.setItem('auth_token', response.token);
        // Update user state
        this.currentUserSubject.next(response.user);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Mock login for development/testing
   */
  private mockLogin(email: string, password: string): Observable<{ token: string; user: User }> {
    // Mock users for testing
    const mockUsers: { [key: string]: User } = {
      'student@test.com': {
        id: '1',
        email: 'student@test.com',
        full_name: 'John Student',
        user_role: 'student',
        avatar_url: 'https://ui-avatars.com/api/?name=John+Student&background=4f46e5&color=fff',
        created_date: new Date().toISOString()
      },
      'supervisor@test.com': {
        id: '2',
        email: 'supervisor@test.com',
        full_name: 'Dr. Sarah Supervisor',
        user_role: 'supervisor',
        avatar_url: 'https://ui-avatars.com/api/?name=Sarah+Supervisor&background=4f46e5&color=fff',
        created_date: new Date().toISOString()
      }
    };

    // Simulate API delay
    return of(null).pipe(
      delay(800),
      map(() => {
        const user = mockUsers[email];
        if (!user || password !== 'password123') {
          throw new Error('Invalid email or password');
        }

        const token = 'mock-token-' + Math.random().toString(36).substring(7);
        return { token, user };
      }),
      tap(response => {
        // Store token
        localStorage.setItem('auth_token', response.token);
        // Update user state
        this.currentUserSubject.next(response.user);
      })
    );
  }

  /**
   * Logout current user
   */
  logout(): void {
    this.http.post(`${this.baseUrl}/auth/logout`, {}).subscribe({
      next: () => {
        this.clearAuthState();
      },
      error: () => {
        // Clear state even if API call fails
        this.clearAuthState();
      }
    });
  }

  /**
   * Clear authentication state
   */
  private clearAuthState(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('auth_token');
    window.location.href = '/auth/login';
  }

  /**
   * Load current user on service initialization
   */
  private loadCurrentUser(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.me().subscribe({
        error: () => {
          // Token invalid, clear it
          localStorage.removeItem('auth_token');
        }
      });
    }
  }

  /**
   * Check if user is authenticated
   * @returns boolean
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  /**
   * Get current user value (synchronous)
   * @returns User | null
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // ========== Generic Entity CRUD Operations ==========

  /**
   * List all entities with optional sorting
   * @param entityName - Name of the entity (e.g., 'Project', 'Submission')
   * @param sortField - Optional sort field (prefix with '-' for descending)
   * @returns Observable<T[]>
   */
  list<T>(entityName: string, sortField?: string): Observable<T[]> {
    let url = `${this.baseUrl}/entities/${entityName}`;
    if (sortField) {
      url += `?sort=${sortField}`;
    }
    return this.http.get<T[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Filter entities by criteria
   * @param entityName - Name of the entity
   * @param filters - Filter object (e.g., { status: 'active', user_email: 'test@example.com' })
   * @returns Observable<T[]>
   */
  filter<T>(entityName: string, filters: Record<string, any>): Observable<T[]> {
    return this.http.post<T[]>(
      `${this.baseUrl}/entities/${entityName}/filter`,
      filters
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get single entity by ID
   * @param entityName - Name of the entity
   * @param id - Entity ID
   * @returns Observable<T>
   */
  get<T>(entityName: string, id: string | number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/entities/${entityName}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Create new entity
   * @param entityName - Name of the entity
   * @param data - Entity data
   * @returns Observable<T>
   */
  create<T>(entityName: string, data: Partial<T>): Observable<T> {
    return this.http.post<T>(
      `${this.baseUrl}/entities/${entityName}`,
      data
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update existing entity
   * @param entityName - Name of the entity
   * @param id - Entity ID
   * @param data - Updated entity data
   * @returns Observable<T>
   */
  update<T>(entityName: string, id: string | number, data: Partial<T>): Observable<T> {
    return this.http.put<T>(
      `${this.baseUrl}/entities/${entityName}/${id}`,
      data
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete entity
   * @param entityName - Name of the entity
   * @param id - Entity ID
   * @returns Observable<void>
   */
  delete(entityName: string, id: string | number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/entities/${entityName}/${id}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ========== Error Handling ==========

  /**
   * Handle HTTP errors
   * @param error - HTTP error response
   * @returns Observable error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

      // Handle specific error codes
      if (error.status === 401) {
        // Unauthorized - token expired or invalid
        localStorage.removeItem('auth_token');
        window.location.href = '/auth/login';
        errorMessage = 'Session expired. Please login again.';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
    }

    console.error('Base44Service Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Base44Service } from './base44.service';
import { User } from '../models/user.model';

/**
 * Authentication Service
 * Manages user authentication state and operations
 * Wraps Base44Service authentication methods
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private base44Service: Base44Service,
    private router: Router
  ) {}

  // Expose current user observable from Base44Service
  get currentUser$() {
    return this.base44Service.currentUser$;
  }

  /**
   * Login user with email and password
   * @param email - User email
   * @param password - User password
   * @returns Observable<{ token: string, user: User }>
   */
  login(email: string, password: string): Observable<{ token: string; user: User }> {
    return this.base44Service.login(email, password).pipe(
      tap(() => {
        // Navigate to dashboard after successful login
        this.router.navigate(['/dashboard']);
      })
    );
  }

  /**
   * Logout current user
   */
  logout(): void {
    this.base44Service.logout();
  }

  /**
   * Get current authenticated user
   * @returns Observable<User>
   */
  me(): Observable<User> {
    return this.base44Service.me();
  }

  /**
   * Check if user is authenticated
   * @returns boolean
   */
  isAuthenticated(): boolean {
    return this.base44Service.isAuthenticated();
  }

  /**
   * Get current user value (synchronous)
   * @returns User | null
   */
  getCurrentUser(): User | null {
    return this.base44Service.getCurrentUser();
  }

  /**
   * Check if current user has specific role
   * @param role - Role to check ('student' | 'supervisor')
   * @returns boolean
   */
  hasRole(role: 'student' | 'supervisor'): boolean {
    const user = this.getCurrentUser();
    return user?.user_role === role;
  }

  /**
   * Check if current user is a student
   * @returns boolean
   */
  isStudent(): boolean {
    return this.hasRole('student');
  }

  /**
   * Check if current user is a supervisor
   * @returns boolean
   */
  isSupervisor(): boolean {
    return this.hasRole('supervisor');
  }

  /**
   * Get auth token from localStorage
   * @returns string | null
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}

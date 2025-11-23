# Base44 API Reference for Angular Migration

## Overview
Base44.com provides backend services through their API client. This guide shows how to adapt the React-based Base44 client to Angular.

---

## React Usage (Original)

### Import
```javascript
import { base44 } from "@/api/base44Client";
```

### Authentication
```javascript
// Get current user
const user = await base44.auth.me();

// Logout
base44.auth.logout();
```

### Entity Operations
```javascript
// List all projects (sorted by updated_date descending)
const projects = await base44.entities.Project.list('-updated_date');

// Filter notifications
const notifications = await base44.entities.Notification.filter({
  user_email: user.email,
  is_read: false
});

// Get single entity
const project = await base44.entities.Project.get(projectId);

// Create entity
const newProject = await base44.entities.Project.create({
  title: "New Project",
  description: "Description"
});

// Update entity
await base44.entities.Project.update(projectId, {
  status: "active"
});

// Delete entity
await base44.entities.Project.delete(projectId);
```

### React Query Integration
```javascript
const { data: projects = [] } = useQuery({
  queryKey: ['projects'],
  queryFn: () => base44.entities.Project.list('-updated_date'),
  enabled: !!user,
});
```

---

## Angular Adaptation

### 1. Create Base44 Service

**File**: `src/app/core/services/base44.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Base44Service {
  private baseUrl = 'YOUR_BASE44_API_URL'; // Get from Base44 dashboard
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  // ========== Authentication ==========

  me(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/me`).pipe(
      map(user => {
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  logout(): void {
    // Call Base44 logout endpoint
    this.http.post(`${this.baseUrl}/auth/logout`, {}).subscribe(() => {
      this.currentUserSubject.next(null);
      // Clear local storage or cookies
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    });
  }

  private loadCurrentUser(): void {
    // Load user on app init
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.me().subscribe();
    }
  }

  // ========== Generic Entity Operations ==========

  // List entities with optional sorting
  list<T>(entityName: string, sortField?: string): Observable<T[]> {
    let url = `${this.baseUrl}/entities/${entityName}`;
    if (sortField) {
      url += `?sort=${sortField}`;
    }
    return this.http.get<T[]>(url);
  }

  // Filter entities
  filter<T>(entityName: string, filters: any): Observable<T[]> {
    return this.http.post<T[]>(
      `${this.baseUrl}/entities/${entityName}/filter`,
      filters
    );
  }

  // Get single entity
  get<T>(entityName: string, id: string | number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/entities/${entityName}/${id}`);
  }

  // Create entity
  create<T>(entityName: string, data: Partial<T>): Observable<T> {
    return this.http.post<T>(
      `${this.baseUrl}/entities/${entityName}`,
      data
    );
  }

  // Update entity
  update<T>(entityName: string, id: string | number, data: Partial<T>): Observable<T> {
    return this.http.put<T>(
      `${this.baseUrl}/entities/${entityName}/${id}`,
      data
    );
  }

  // Delete entity
  delete(entityName: string, id: string | number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/entities/${entityName}/${id}`
    );
  }
}
```

---

### 2. Create Entity-Specific Services

**File**: `src/app/core/services/project.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Base44Service } from './base44.service';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private entityName = 'Project';

  constructor(private base44: Base44Service) {}

  list(sortField = '-updated_date'): Observable<Project[]> {
    return this.base44.list<Project>(this.entityName, sortField);
  }

  filter(filters: any): Observable<Project[]> {
    return this.base44.filter<Project>(this.entityName, filters);
  }

  get(id: string | number): Observable<Project> {
    return this.base44.get<Project>(this.entityName, id);
  }

  create(project: Partial<Project>): Observable<Project> {
    return this.base44.create<Project>(this.entityName, project);
  }

  update(id: string | number, project: Partial<Project>): Observable<Project> {
    return this.base44.update<Project>(this.entityName, id, project);
  }

  delete(id: string | number): Observable<void> {
    return this.base44.delete(this.entityName, id);
  }

  // Custom methods
  getMyProjects(userEmail: string, userRole: string): Observable<Project[]> {
    const filters = userRole === 'student'
      ? { student_email: userEmail, status_ne: 'proposed' }
      : { supervisor_email: userEmail };
    return this.filter(filters);
  }

  getPendingInvitations(userEmail: string): Observable<Project[]> {
    return this.filter({
      student_email: userEmail,
      status: 'proposed'
    });
  }
}
```

**Similar services for**:
- `submission.service.ts`
- `milestone.service.ts`
- `notification.service.ts`
- `meeting.service.ts`
- `evaluation.service.ts`
- `message.service.ts`

---

### 3. Create Models

**File**: `src/app/core/models/project.model.ts`

```typescript
export interface Project {
  id: string | number;
  title: string;
  description: string;
  status: 'proposed' | 'active' | 'completed';
  student_email: string;
  supervisor_email: string;
  created_date: Date;
  updated_date: Date;
}
```

**File**: `src/app/core/models/user.model.ts`

```typescript
export interface User {
  email: string;
  full_name: string;
  user_role: 'student' | 'supervisor';
  avatar_url?: string;
}
```

**File**: `src/app/core/models/notification.model.ts`

```typescript
export interface Notification {
  id: string | number;
  user_email: string;
  is_read: boolean;
  message: string;
  created_date: Date;
  type?: string;
}
```

---

### 4. Component Usage

**File**: `src/app/features/dashboard/dashboard.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { ProjectService } from '@core/services/project.service';
import { SubmissionService } from '@core/services/submission.service';
import { Base44Service } from '@core/services/base44.service';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user$ = this.base44.currentUser$;
  projects$: Observable<any[]>;
  submissions$: Observable<any[]>;
  loading = true;

  constructor(
    private base44: Base44Service,
    private projectService: ProjectService,
    private submissionService: SubmissionService
  ) {}

  ngOnInit(): void {
    // Load data
    this.user$.subscribe(user => {
      if (user) {
        this.loadData(user);
      }
    });
  }

  private loadData(user: any): void {
    this.projects$ = this.projectService.list('-updated_date');
    this.submissions$ = this.submissionService.list('-created_date');

    combineLatest([this.projects$, this.submissions$]).subscribe(() => {
      this.loading = false;
    });
  }

  // Get filtered projects based on user role
  getMyProjects(projects: any[], user: any): any[] {
    if (!projects || !user) return [];

    return user.user_role === 'student'
      ? projects.filter(p => p.student_email === user.email && p.status !== 'proposed')
      : projects.filter(p => p.supervisor_email === user.email);
  }
}
```

**File**: `src/app/features/dashboard/dashboard.component.html`

```html
<div *ngIf="user$ | async as user" class="p-6">
  <div *ngIf="loading" class="flex items-center justify-center min-h-screen">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>

  <div *ngIf="!loading">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <app-stats-card
        *ngFor="let stat of stats$ | async"
        [title]="stat.title"
        [value]="stat.value"
        [icon]="stat.icon">
      </app-stats-card>
    </div>

    <!-- Projects -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <app-project-card
        *ngFor="let project of (projects$ | async)"
        [project]="project">
      </app-project-card>
    </div>
  </div>
</div>
```

---

### 5. State Management with Caching

**File**: `src/app/core/services/notification.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { switchMap, shareReplay, tap } from 'rxjs/operators';
import { Base44Service } from './base44.service';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private entityName = 'Notification';
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private base44: Base44Service) {
    this.startPolling();
  }

  list(sortField?: string): Observable<Notification[]> {
    return this.base44.list<Notification>(this.entityName, sortField);
  }

  getUnread(userEmail: string): Observable<Notification[]> {
    return this.base44.filter<Notification>(this.entityName, {
      user_email: userEmail,
      is_read: false
    }).pipe(
      tap(notifications => {
        this.unreadCountSubject.next(notifications.length);
      })
    );
  }

  markAsRead(id: string | number): Observable<Notification> {
    return this.base44.update<Notification>(this.entityName, id, {
      is_read: true
    }).pipe(
      tap(() => {
        // Decrease count
        this.unreadCountSubject.next(this.unreadCountSubject.value - 1);
      })
    );
  }

  // Poll for new notifications every 30 seconds
  private startPolling(): void {
    this.base44.currentUser$.pipe(
      switchMap(user => {
        if (!user) return [];
        return timer(0, 30000).pipe(
          switchMap(() => this.getUnread(user.email))
        );
      })
    ).subscribe();
  }
}
```

---

### 6. HTTP Interceptor for Auth

**File**: `src/app/core/interceptors/auth.interceptor.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get auth token from localStorage or service
    const token = localStorage.getItem('auth_token');

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
```

**Register in app.module.ts**:
```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
]
```

---

## API Endpoints Reference

Based on Base44.com patterns, the typical endpoints are:

### Authentication
- `GET /auth/me` - Get current user
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `POST /auth/register` - Register

### Entities (Generic CRUD)
- `GET /entities/{entityName}` - List all
- `GET /entities/{entityName}?sort={field}` - List sorted
- `POST /entities/{entityName}/filter` - Filter with conditions
- `GET /entities/{entityName}/{id}` - Get by ID
- `POST /entities/{entityName}` - Create
- `PUT /entities/{entityName}/{id}` - Update
- `DELETE /entities/{entityName}/{id}` - Delete

### Available Entities
- `Project`
- `Submission`
- `Milestone`
- `Notification`
- `Meeting`
- `Evaluation`
- `Message`

---

## Filter Query Syntax

```typescript
// Equal
{ field: value }

// Not equal
{ field_ne: value }

// Greater than
{ field_gt: value }

// Less than
{ field_lt: value }

// Contains (string)
{ field_contains: value }

// In array
{ field_in: [value1, value2] }

// Multiple conditions (AND)
{
  field1: value1,
  field2: value2
}
```

---

## Common Patterns

### Pattern 1: Load Data on Component Init
```typescript
ngOnInit(): void {
  this.projectService.list().subscribe(projects => {
    this.projects = projects;
  });
}
```

### Pattern 2: Async Pipe (Recommended)
```typescript
projects$ = this.projectService.list();
```
```html
<div *ngFor="let project of projects$ | async">
  {{ project.title }}
</div>
```

### Pattern 3: Combine Multiple Queries
```typescript
data$ = combineLatest([
  this.projectService.list(),
  this.submissionService.list(),
  this.milestoneService.list()
]).pipe(
  map(([projects, submissions, milestones]) => ({
    projects,
    submissions,
    milestones
  }))
);
```

### Pattern 4: Conditional Query
```typescript
this.base44.currentUser$.pipe(
  filter(user => !!user),
  switchMap(user => this.projectService.getMyProjects(user.email, user.user_role))
).subscribe(projects => {
  this.myProjects = projects;
});
```

---

## Notes

1. **Replace Promises with Observables**: Base44 uses Promises in React, but Angular uses Observables
2. **Use shareReplay()** for caching frequently accessed data
3. **Implement polling** for real-time features (notifications, badges)
4. **Handle errors** with catchError operator
5. **Unsubscribe**: Use async pipe or takeUntil to prevent memory leaks

---

Last Updated: 2025-11-23

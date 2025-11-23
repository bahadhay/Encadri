# Encadri Angular - Project Structure

## Overview
This Angular project follows a modular architecture with clear separation of concerns.

## Folder Structure

```
src/app/
├── core/                      # Core module (singleton services, guards, interceptors)
│   ├── services/             # Application-wide services
│   │   ├── base44.service.ts
│   │   ├── auth.service.ts
│   │   ├── project.service.ts
│   │   ├── submission.service.ts
│   │   ├── milestone.service.ts
│   │   ├── notification.service.ts
│   │   ├── meeting.service.ts
│   │   ├── evaluation.service.ts
│   │   └── message.service.ts
│   ├── guards/               # Route guards
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   ├── interceptors/         # HTTP interceptors
│   │   └── auth.interceptor.ts
│   └── models/               # TypeScript interfaces/types
│       ├── user.model.ts
│       ├── project.model.ts
│       ├── submission.model.ts
│       ├── milestone.model.ts
│       ├── notification.model.ts
│       ├── meeting.model.ts
│       ├── evaluation.model.ts
│       └── message.model.ts
│
├── shared/                    # Shared module (reusable components, pipes, directives)
│   └── components/           # Reusable UI components
│       ├── card/
│       ├── button/
│       ├── badge/
│       ├── avatar/
│       ├── input/
│       ├── modal/
│       └── ...
│
├── features/                  # Feature modules (lazy loaded)
│   ├── auth/                 # Authentication feature
│   │   ├── login/
│   │   └── onboarding/
│   ├── dashboard/            # Dashboard feature
│   │   ├── dashboard.component.ts
│   │   └── components/
│   │       ├── stats-card/
│   │       ├── project-card/
│   │       ├── upcoming-deadlines/
│   │       └── recent-activity/
│   ├── projects/             # Projects feature
│   │   ├── projects-list/
│   │   ├── project-details/
│   │   └── project-form/
│   ├── submissions/          # Submissions feature
│   │   ├── submissions-list/
│   │   └── submission-form/
│   ├── meetings/             # Meetings feature
│   │   ├── meetings-list/
│   │   └── meeting-form/
│   ├── notifications/        # Notifications feature
│   │   └── notifications-list/
│   ├── evaluations/          # Evaluations feature (supervisor)
│   │   ├── evaluations-list/
│   │   └── evaluation-form/
│   └── profile/              # Profile feature
│       └── profile-edit/
│
├── layout/                    # Layout components
│   ├── app-layout/
│   │   ├── app-layout.component.ts
│   │   ├── app-layout.component.html
│   │   └── app-layout.component.scss
│   ├── sidebar/
│   │   ├── sidebar.component.ts
│   │   ├── sidebar.component.html
│   │   └── sidebar.component.scss
│   └── header/
│       ├── header.component.ts
│       ├── header.component.html
│       └── header.component.scss
│
├── app.config.ts             # Application configuration
├── app.routes.ts             # Application routes
└── app.ts                    # Root component
```

## Module Organization

### Core Module
- **Purpose**: Contains singleton services, guards, and interceptors
- **Imported**: Once in `app.config.ts`
- **Services**: Base44 client, authentication, entity services
- **Guards**: Auth guard, role-based guards
- **Interceptors**: HTTP authentication interceptor

### Shared Module
- **Purpose**: Reusable components, pipes, and directives
- **Imported**: In feature modules that need shared components
- **Components**: UI components (Card, Button, Badge, etc.)

### Feature Modules
- **Purpose**: Self-contained features with their own components
- **Loading**: Lazy loaded for better performance
- **Structure**: Each feature has its components, services (if local), and routes

### Layout Module
- **Purpose**: Application layout structure
- **Components**: App layout wrapper, sidebar, header
- **Usage**: Wraps authenticated routes

## Naming Conventions

### Files
- Components: `component-name.component.ts`
- Services: `service-name.service.ts`
- Guards: `guard-name.guard.ts`
- Models: `model-name.model.ts`
- Interceptors: `interceptor-name.interceptor.ts`

### Classes
- Components: `ComponentNameComponent`
- Services: `ServiceNameService`
- Guards: `GuardNameGuard`
- Models: `ModelName` (interface)

### Folders
- Use kebab-case for all folder names
- Group related files in feature folders

## Routing Strategy

```typescript
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
      },
      {
        path: 'projects',
        loadChildren: () => import('./features/projects/projects.routes')
      },
      // ... other routes
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes')
  }
];
```

## State Management

- **User State**: BehaviorSubject in AuthService
- **Notifications**: BehaviorSubject with polling
- **Entity Data**: Observables from services
- **Caching**: shareReplay operator for frequently accessed data

## Best Practices

1. **Use Standalone Components**: Modern Angular approach
2. **Lazy Loading**: Load feature modules on demand
3. **OnPush Change Detection**: For performance
4. **Async Pipe**: Avoid manual subscriptions
5. **Type Safety**: Use TypeScript interfaces for all data
6. **Error Handling**: Centralized error handling in interceptor
7. **Loading States**: Show loading indicators for async operations

## Next Steps

1. Create data models in `core/models/`
2. Implement Base44 service in `core/services/`
3. Create auth guard in `core/guards/`
4. Build shared UI components
5. Implement feature modules one by one
6. Add routing configuration

---

Last Updated: 2025-11-23

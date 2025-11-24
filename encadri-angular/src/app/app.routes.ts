import { Routes } from '@angular/router';
import { authGuard, studentGuard, supervisorGuard } from './core/guards/auth.guard';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';

export const routes: Routes = [
  // Default redirect to dashboard
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Public auth routes
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      }
    ]
  },

  // Protected routes with layout
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent)
      },
      {
        path: 'submissions',
        loadComponent: () => import('./features/submissions/submissions.component').then(m => m.SubmissionsComponent)
      },
      {
        path: 'meetings',
        loadComponent: () => import('./features/meetings/meetings.component').then(m => m.MeetingsComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent)
      },
      {
        path: 'evaluations',
        canActivate: [supervisorGuard],
        loadComponent: () => import('./features/evaluations/evaluations.component').then(m => m.EvaluationsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },

  // 404 fallback
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

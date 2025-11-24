import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard
 * Protects routes that require authentication
 * Uses functional guard pattern (Angular 15+)
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login page with return URL
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });

  return false;
};

/**
 * Role Guard Factory
 * Creates a guard that checks for specific user role
 * @param allowedRoles - Array of allowed roles
 * @returns CanActivateFn
 */
export const roleGuard = (allowedRoles: ('student' | 'supervisor')[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    // Check if user has required role
    const user = authService.getCurrentUser();
    if (user && allowedRoles.includes(user.user_role)) {
      return true;
    }

    // User doesn't have required role, redirect to dashboard
    router.navigate(['/dashboard']);
    return false;
  };
};

/**
 * Student Guard
 * Allows access only to students
 */
export const studentGuard: CanActivateFn = roleGuard(['student']);

/**
 * Supervisor Guard
 * Allows access only to supervisors
 */
export const supervisorGuard: CanActivateFn = roleGuard(['supervisor']);

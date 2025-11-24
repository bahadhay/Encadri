import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Auth Interceptor
 * Automatically adds authentication token to all HTTP requests
 * Uses functional interceptor pattern (Angular 17+)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get auth token from localStorage
  const token = localStorage.getItem('auth_token');

  // If token exists, clone request and add Authorization header
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Pass the cloned request to the next handler
  return next(req);
};

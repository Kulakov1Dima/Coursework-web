import { HttpInterceptorFn, HttpContextToken, HttpContext } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export const basicAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  console.log('Intercepting request:', req.url);

  const skipAuth = req.context.get(SKIP_AUTH);
  if (skipAuth) {
    console.log('Skipping Authorization header for:', req.url);
    return next(req);
  }

  const login = localStorage.getItem('login');
  const password = localStorage.getItem('password');

  if (login && password) {
    console.log('Loaded credentials from localStorage for user:', login);
    const authHeader = 'Basic ' + btoa(`${login}:${password}`);
    console.log('Adding Authorization header for:', req.url, 'with value:', authHeader);

    const authReq = req.clone({
      headers: req.headers.set('Authorization', authHeader)
    });

    return next(authReq).pipe(
      catchError((error) => {
        if (error.status === 401) {
          console.log('Unauthorized request, clearing credentials and redirecting to /login');
          clearCredentials();
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  console.log('No credentials available, proceeding without Authorization header for:', req.url);
  return next(req);
};

export function setCredentials(login: string, password: string) {
  localStorage.setItem('login', login);
  localStorage.setItem('password', password);
  console.log('Credentials set:', login, 'Password:', password);
}

export function clearCredentials() {
  localStorage.removeItem('login');
  localStorage.removeItem('password');
  console.log('Credentials cleared');
}
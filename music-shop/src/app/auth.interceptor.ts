import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  HttpEvent
} from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn // Use HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = localStorage.getItem('access');

  if (accessToken) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(req, next, authService, router);
      } else {
        return throwError(() => error);
      }
    })
  );
};

function handle401Error(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
): Observable<HttpEvent<any>> {

  const refreshToken = localStorage.getItem('refresh');

  if (refreshToken) {
    return authService.refreshToken({ refresh: refreshToken }).pipe(
      switchMap((token: any) => {
        return next(
          req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token.access}`),
          })
        );
      }),
      catchError((refreshError) => {
        authService.logout();
        return throwError(() => refreshError);
      })
    );
  } else {
    authService.logout();
    return throwError(() => 'No refresh token available');
  }
}

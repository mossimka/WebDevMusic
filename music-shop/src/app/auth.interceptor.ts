import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { AuthService } from './services/auth.service'; // Changed to UserService
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {} // Changed to UserService

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const access = localStorage.getItem('access');

    if (access) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${access}`),
      });
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    const refresh = localStorage.getItem('refresh');

    if (refresh) {
      return this.authService.refreshToken({ refresh: refresh }).pipe(
        switchMap((token: any) => {
          return next.handle(
            req.clone({
              headers: req.headers.set('Authorization', `Bearer ${token.access}`),
            })
          );
        })
      );
    } else {
      this.authService.logout();
      return throwError('No refresh token');
    }
  }
}

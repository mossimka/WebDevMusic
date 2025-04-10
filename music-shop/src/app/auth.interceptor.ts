import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { UserService } from './services/user.service'; // Create an AuthService for token refresh
import { catchError, switchMap } from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private authService: UserService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const access = localStorage.getItem('access');

    if (access) {
      req = this.addToken(req, access);
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
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refresh = localStorage.getItem('refresh');

      if (refresh) {
        return this.authService.refreshToken({ refresh: refresh }).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            localStorage.setItem('access', token.access);
            this.refreshTokenSubject.next(token.access);
            return next.handle(this.addToken(req, token.access));
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.router.navigate(['/sign-in']);
            localStorage.clear();
            return throwError(error);
          })
        );
      } else {
        this.router.navigate(['/sign-in']);
        localStorage.clear();
        return throwError('No refresh token');
      }
    } else {
      return this.refreshTokenSubject.pipe(
        switchMap((token) => {
          if (token) {
            return next.handle(this.addToken(req, token));
          } else {
            return this.authService.refreshToken({refresh: localStorage.getItem('refresh')}).pipe(
              switchMap((token: any) => {
                localStorage.setItem('access', token.access);
                return next.handle(this.addToken(req, token.access));
              })
            )
          }
        })
      );
    }
  }

  private addToken(req: HttpRequest<any>, token: string) {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Token } from '../interfaces/token';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService { // Changed to UserService
  private loggedInSubject = new BehaviorSubject<boolean>(this.checkLoggedIn());
  public loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();
  private loginUrl = 'http://127.0.0.1:8000/api/login/';
  private refreshTokenUrl = 'http://127.0.0.1:8000/api/refresh/';
  private validateTokenURL = 'http://127.0.0.1:8000/api/validate_token/';

  constructor(private client: HttpClient, private router: Router) {
    this.validateTokenOnStart();
  }

  login(authModel: any): Observable<Token> {
    return this.client.post<Token>(this.loginUrl, authModel).pipe(
      tap((token) => this.storeTokens(token))
    );
  }

  refreshToken(body: any): Observable<any> {
    return this.client.post(this.refreshTokenUrl, body).pipe(
      tap((token: any) => localStorage.setItem('access', token.access)),
      catchError((error) => {
        this.logout();
        return throwError(error);
      })
    );
  }

  storeTokens(token: Token): void {
    localStorage.setItem('access', token.access);
    localStorage.setItem('refresh', token.refresh);
    this.loggedInSubject.next(true); // Update logged-in state
  }

  logout(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    this.loggedInSubject.next(false); // Update logged-in state
    this.router.navigate(['/sign-in']);
  }

  checkLoggedIn(): boolean {
    return !!localStorage.getItem('access');
  }

  validateToken(): Observable<boolean> {
    const access = localStorage.getItem('access');
    if (!access) {
      return new Observable<boolean>((subscriber) => subscriber.next(false));
    }
    return this.client.get(this.validateTokenURL).pipe(
      map(() => true),
      catchError(() => {
        this.logout();
        return new Observable<boolean>((subscriber) => subscriber.next(false));
      })
    );
  }

  validateTokenOnStart() {
    this.validateToken().subscribe();
  }
}

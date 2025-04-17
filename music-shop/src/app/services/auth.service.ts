import { inject, Injectable, Injector } from '@angular/core'; // Import Injector
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Keep HttpClient import
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Token } from '../interfaces/token';
import { catchError, tap, map } from 'rxjs/operators';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(this.checkLoggedIn());
  public loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();
  private loginUrl = 'http://127.0.0.1:8000/api/login/';
  private refreshTokenUrl = 'http://127.0.0.1:8000/api/refresh/';
  private validateTokenURL = 'http://127.0.0.1:8000/api/validate_token/';
  private meUrl = 'http://localhost:8000/api/me/';

  private injector = inject(Injector);

  constructor(private router: Router) {
    this.validateTokenOnStart();
  }

  private getHttpClient(): HttpClient {
    return this.injector.get(HttpClient);
  }

  login(authModel: any): Observable<Token> {
    return this.getHttpClient()
      .post<Token>(this.loginUrl, authModel)
      .pipe(tap((token) => this.storeTokens(token)));
  }

  refreshToken(body: any): Observable<any> {
    return this.getHttpClient()
      .post(this.refreshTokenUrl, body)
      .pipe(
        tap((token: any) => localStorage.setItem('access', token.access)),
        catchError((error) => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  storeTokens(token: Token): void {
    localStorage.setItem('access', token.access);
    if (token.refresh) {
      localStorage.setItem('refresh', token.refresh);
    }
    this.loggedInSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    this.loggedInSubject.next(false);
    this.router.navigate(['/sign-in']);
  }

  checkLoggedIn(): boolean {
    return !!localStorage.getItem('access');
  }

  validateToken(): Observable<boolean> {
    const access = localStorage.getItem('access');
    if (!access) {
      return new Observable<boolean>((subscriber) => {
        subscriber.next(false);
        subscriber.complete();
      });
    }
    return this.getHttpClient()
      .get(this.validateTokenURL)
      .pipe(
        map(() => true),
        catchError(() => {
          return new Observable<boolean>((subscriber) => {
            subscriber.next(false);
            subscriber.complete();
          });
        })
      );
  }

  validateTokenOnStart() {
    this.validateToken().subscribe((isValid) => {
      console.log('Initial token validation result:', isValid);
      if (!isValid && this.checkLoggedIn()) {
        // If validation fails but checkLoggedIn was true, update state
        // This might happen if token exists but is invalid/expired
        // However, the interceptor's refresh logic is usually better suited for this
        // Consider if this explicit update is needed vs letting 401 handling work.
        // this.loggedInSubject.next(false);
      } else if (isValid && !this.checkLoggedIn()) {
        this.loggedInSubject.next(true);
      }
    });
  }

  getCurrentUser(): Observable<User> {
    const accessToken: string | null = localStorage.getItem('access');
    let headers = new HttpHeaders();
    if (accessToken) {
      headers = headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return this.getHttpClient().get<User>(this.meUrl, {
      headers: headers,
      responseType: 'json',
    });
  }

  public isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }
}

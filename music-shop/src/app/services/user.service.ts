import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthModel } from '../interfaces/authModel';
import { Token } from '../interfaces/token';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private loginUrl = 'http://127.0.0.1:8000/api/login/';
  private refreshTokenUrl = 'http://127.0.0.1:8000/api/refresh/';

  constructor(private client: HttpClient) {}

  login(authModel: AuthModel): Observable<Token> {
    return this.client.post<Token>(this.loginUrl, authModel);
  }

  refreshToken(body: any): Observable<any> {
    return this.client.post(this.refreshTokenUrl, body);
  }

  storeTokens(token: Token): void {
    localStorage.setItem('access', token.access);
    localStorage.setItem('refresh', token.refresh);
  }

  clearTokens(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }
}

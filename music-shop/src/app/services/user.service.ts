import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {AuthModel} from '../interfaces/authModel';
import {Token} from '../interfaces/token';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private client: HttpClient) { }

  login(authModel: AuthModel): Observable<Token> {
    return this.client.post<Token>('http://127.0.0.1:8000/api/login/', authModel)
  }
}

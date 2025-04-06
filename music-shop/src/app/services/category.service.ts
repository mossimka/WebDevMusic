import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Category} from '../category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = 'http://localhost:8000/api/categories'
  constructor(private http: HttpClient) { }

  getCategories() : Observable<Category[]> {
    return this.http.get<Category[]>(this.url)
  }
}

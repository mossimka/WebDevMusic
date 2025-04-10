import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product'
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = 'http://localhost:8000/api/products'
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url)
  }
  getProductById(id: Number) : Observable<Product>  {
    return this.http.get<Product>(`${this.url}/${id}`)
  }
}

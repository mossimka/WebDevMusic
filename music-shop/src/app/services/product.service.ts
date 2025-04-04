import { Injectable } from '@angular/core';
import { Product } from './product';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicsService {
  url = 'http://localhost:8000/api/products'
  constructor() { }

  async getAllProducts() : Promise<Product[]> {
    const data = await fetch(this.url)
    return await data.json() ?? [];
  }
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl)
  }
  async getProductById(id: Number) : Promise<Product>  {
    const data = await fetch(`${this.url}/${id}`);
    return await data.json() ?? [];
  }
  async getAllCategories() : Promise<string[]> {
    const data = await this.getAllProducts();
    const categories = new Set<string>();

    data.forEach(product => {
      categories.add(product.type);
    });

    return Array.from(categories);
  }
}
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Company} from '../interfaces/company';
import {Vacancy} from '../interfaces/vacancy';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:8000/api/companies/'
  constructor(private http: HttpClient) { }

  getCompaniesList(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl)
  }
  getCompanyDetails(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}${id}`)
  }

  getCompanyVacancies(id: string | null): Observable<Vacancy[]> {
    return this.http.get<Vacancy[]>(`${this.apiUrl}${id}/vacancies`)
  }
}


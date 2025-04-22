// src/app/services/favorite.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, tap, catchError, throwError, of } from 'rxjs';
import { Favorite, CreateFavorite } from '../interfaces/favorite';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private apiUrl = 'http://127.0.0.1:8000/api/favorites';
  private http = inject(HttpClient);

  private _favoritesUpdated = new Subject<void>();

  get favoritesUpdated$(): Observable<void> {
    return this._favoritesUpdated.asObservable();
  }

  getFavorites(): Observable<Favorite[]> {
    console.log('FavoriteService: getFavorites START');
    console.log(
      'FavoriteService: Attempting GET request to:',
      `${this.apiUrl}/`
    );
    return this.http.get<Favorite[]>(`${this.apiUrl}/`);
  }

  addFavorite(productId: number): Observable<Favorite> {
    const payload: CreateFavorite = { product_id: productId };
    return this.http.post<Favorite>(`${this.apiUrl}/`, payload).pipe(
      tap(() => this._favoritesUpdated.next()),
      catchError(this.handleError)
    );
  }

  removeFavorite(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/product/${productId}/`).pipe(
      tap(() => this._favoritesUpdated.next()),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error(
      'Favorite Service: handleError ENTERED (for POST/DELETE)',
      error
    );
    let errorMessage = 'An error happend during work with favorites.';
    if (error.error?.detail) {
      errorMessage = error.error.detail;
    } else if (error.status === 400 && error.error?.product_id) {
      errorMessage = error.error.product_id.join(' ');
    } else if (error.status === 401) {
      errorMessage = 'Authorization is needed';
    } else if (error.status === 404) {
      errorMessage = "Rosource isn't found.";
    }
    const err = new Error(errorMessage);
    console.error(
      'Favorite Service: handleError THROWING (for POST/DELETE)',
      err
    );
    return throwError(() => err);
  }
}

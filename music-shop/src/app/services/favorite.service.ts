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

  /** Получить список избранного */
  getFavorites(): Observable<Favorite[]> {
    console.log('FavoriteService: getFavorites START');
    console.log(
      'FavoriteService: Attempting GET request to:',
      `${this.apiUrl}/`
    );
    // НАПРЯМУЮ возвращаем Observable от HttpClient БЕЗ pipe/catchError здесь
    return this.http.get<Favorite[]>(`${this.apiUrl}/`);
    // .pipe(catchError(this.handleError)); // <-- Обработка ошибок GET здесь УБРАНА/ЗАКОММЕНТИРОВАНА
  }

  /** Добавить товар в избранное */
  addFavorite(productId: number): Observable<Favorite> {
    const payload: CreateFavorite = { product_id: productId };
    return this.http.post<Favorite>(`${this.apiUrl}/`, payload).pipe(
      tap(() => this._favoritesUpdated.next()),
      catchError(this.handleError) // Оставим здесь для POST
    );
  }

  /** Удалить товар из избранного по ID товара */
  removeFavorite(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/product/${productId}/`).pipe(
      tap(() => this._favoritesUpdated.next()),
      catchError(this.handleError) // Оставим здесь для DELETE
    );
  }

  // Обработчик ошибок (для POST/DELETE)
  private handleError(error: HttpErrorResponse) {
    console.error(
      'Favorite Service: handleError ENTERED (for POST/DELETE)',
      error
    );
    let errorMessage = 'Произошла ошибка при работе с избранным.';
    if (error.error?.detail) {
      errorMessage = error.error.detail;
    } else if (error.status === 400 && error.error?.product_id) {
      errorMessage = error.error.product_id.join(' ');
    } else if (error.status === 401) {
      errorMessage = 'Требуется авторизация.';
    } else if (error.status === 404) {
      errorMessage = 'Ресурс не найден.';
    }
    const err = new Error(errorMessage);
    console.error(
      'Favorite Service: handleError THROWING (for POST/DELETE)',
      err
    );
    return throwError(() => err);
  }
}

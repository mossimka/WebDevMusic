// src/app/services/favorite.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, tap, catchError, throwError } from 'rxjs';
import { Favorite, CreateFavorite } from '../interfaces/favorite';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private apiUrl = 'http://127.0.0.1:8000/api/favorites';
  private http = inject(HttpClient);

  // Subject для оповещения об изменениях
  private _favoritesUpdated = new Subject<void>();

  get favoritesUpdated$(): Observable<void> {
    return this._favoritesUpdated.asObservable();
  }

  /** Получить список избранного */
  getFavorites(): Observable<Favorite[]> {
    return this.http
      .get<Favorite[]>(`${this.apiUrl}/`)
      .pipe(catchError(this.handleError));
  }

  /** Добавить товар в избранное */
  addFavorite(productId: number): Observable<Favorite> {
    const payload: CreateFavorite = { product_id: productId };
    return this.http.post<Favorite>(`${this.apiUrl}/`, payload).pipe(
      tap(() => this._favoritesUpdated.next()), // Оповещаем
      catchError(this.handleError)
    );
  }

  /** Удалить товар из избранного по ID товара */
  removeFavorite(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/product/${productId}/`).pipe(
      tap(() => this._favoritesUpdated.next()), // Оповещаем
      catchError(this.handleError)
    );
  }

  // Обработчик ошибок (можно оставить упрощенный)
  private handleError(error: HttpErrorResponse) {
    console.error('Favorite Service Error:', error);
    let errorMessage = 'Произошла ошибка при работе с избранным.';
    if (error.error?.detail) {
      // Часто DRF возвращает ошибки в 'detail'
      errorMessage = error.error.detail;
    } else if (error.status === 400 && error.error?.product_id) {
      // Конкретная ошибка валидации
      errorMessage = error.error.product_id.join(' ');
    } else if (error.status === 401) {
      errorMessage = 'Требуется авторизация.';
    } else if (error.status === 404) {
      errorMessage = 'Ресурс не найден.';
    }
    return throwError(() => new Error(errorMessage));
  }
}

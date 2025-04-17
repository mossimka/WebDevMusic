import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../services/favorite.service';
import { Favorite } from '../interfaces/favorite';
import { Observable, Subscription, catchError, of, tap } from 'rxjs';
import { ShopItemsComponent } from '../MainPage/shop-items/shop-items.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule, ShopItemsComponent, RouterLink], // Импортируем ShopItemsComponent
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css'], // Убедись, что CSS файл есть
})
export class FavoriteComponent implements OnInit, OnDestroy {
  private favoriteService = inject(FavoriteService);
  favorites$: Observable<Favorite[]> = of([]);
  loading = true;
  error: string | null = null;
  private updateSub?: Subscription;

  ngOnInit(): void {
    this.loadFavorites();
    // Подписываемся на обновления из сервиса
    this.updateSub = this.favoriteService.favoritesUpdated$.subscribe(() => {
      this.loadFavorites(); // Перезагружаем при обновлении
    });
  }

  ngOnDestroy(): void {
    this.updateSub?.unsubscribe(); // Отписываемся
  }

  loadFavorites(): void {
    this.loading = true;
    this.error = null;
    this.favorites$ = this.favoriteService.getFavorites().pipe(
      tap({
        // Используем tap для побочных эффектов
        error: () => (this.loading = false), // Выключаем загрузку при ошибке
        complete: () => (this.loading = false), // Выключаем загрузку при успехе
      }),
      catchError((err) => {
        console.error('Error loading favorites:', err);
        this.error = err.message || 'Не удалось загрузить избранное.';
        return of([]);
      })
    );
  }

  retryLoad(): void {
    this.loadFavorites();
  }
}

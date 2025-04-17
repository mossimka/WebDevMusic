import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../services/favorite.service';
import { Favorite } from '../interfaces/favorite';
// Убираем Observable и of, добавляем Subscription
import { Subscription } from 'rxjs';
import { ShopItemsComponent } from '../MainPage/shop-items/shop-items.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule, ShopItemsComponent, RouterLink],
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css'],
})
export class FavoriteComponent implements OnInit, OnDestroy {
  private favoriteService = inject(FavoriteService);

  // --- Изменения здесь ---
  // Убираем favorites$: Observable<Favorite[]> = of([]);
  favorites: Favorite[] = []; // Обычный массив для хранения данных
  loading = true;
  error: string | null = null;
  private updateSub?: Subscription;
  private dataSub?: Subscription; // Добавляем подписку для данных
  // --- Конец изменений ---

  ngOnInit(): void {
    this.loadFavorites();
    // Подписка на обновления остается
    this.updateSub = this.favoriteService.favoritesUpdated$.subscribe(() => {
      this.loadFavorites(); // Перезагружаем при обновлении
    });
  }

  ngOnDestroy(): void {
    // Отписываемся от обеих подписок
    this.updateSub?.unsubscribe();
    this.dataSub?.unsubscribe(); // <-- Не забываем отписаться от данных!
  }

  loadFavorites(): void {
    console.log('loadFavorites starting (Simpler Version)');
    this.loading = true;
    this.error = null;
    this.favorites = []; // Очищаем предыдущие данные (опционально)

    // Отписываемся от предыдущего запроса данных, если он еще выполняется
    this.dataSub?.unsubscribe();

    this.dataSub = this.favoriteService.getFavorites().subscribe({
      next: (data) => {
        console.log('Favorites data received:', data);
        this.favorites = data; // Сохраняем данные в массив
        this.loading = false; // Устанавливаем loading=false при успехе
        this.error = null; // Сбрасываем ошибку
      },
      error: (err) => {
        console.error('Error loading favorites:', err);
        // err уже должен быть объектом Error с сообщением из handleError
        this.error = err.message || 'Не удалось загрузить избранное.';
        this.loading = false; // Устанавливаем loading=false при ошибке
        this.favorites = []; // Очищаем данные при ошибке
      },
      // complete: () => { console.log('Loading favorites complete'); } // Можно добавить, если нужно
    });
  }

  retryLoad(): void {
    this.loadFavorites();
  }
}

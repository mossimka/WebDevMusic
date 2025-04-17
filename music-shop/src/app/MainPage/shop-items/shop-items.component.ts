import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { CartButtonComponent } from '../../Buttons/cart-button/cart-button.component';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shop-items',
  standalone: true,
  imports: [CommonModule, RouterModule, CartButtonComponent],
  templateUrl: 'shop-items.component.html',
  styleUrl: `./shop-items.css`,
})
export class ShopItemsComponent {
  @Input() product!: Product;
  @Output() productRemoved = new EventEmitter<Number>();

  liked = false;

  like() {
    if (!this.liked) {
      this.product.likes++;
      this.liked = true;
    } else {
      this.product.likes--;
      this.liked = false;
    }
  }
  remove() {
    this.productRemoved.emit(this.product.id);
  }

  // Инъекция новых сервисов
  private favoriteService = inject(FavoriteService);
  public authService = inject(AuthService); // public для доступа в шаблоне

  // Локальное состояние для кнопки избранного
  isTogglingFavorite = false;
  favoriteError: string | null = null;

  // Новый метод для переключения избранного
  toggleFavorite(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    // Используем синхронный геттер isLoggedIn() из AuthService
    // Убедись, что этот метод действительно есть в твоем локальном auth.service.ts!
    if (!this.authService.isLoggedIn()) {
      alert('Пожалуйста, войдите в систему.');
      return;
    }
    if (this.isTogglingFavorite || !this.product) {
      return;
    } // Проверка на продукт

    this.isTogglingFavorite = true;
    this.favoriteError = null;

    // Разделяем логику для добавления и удаления
    if (this.product.is_favorite) {
      // --- Логика УДАЛЕНИЯ ---
      this.favoriteService.removeFavorite(this.product.id).subscribe({
        next: () => {
          if (this.product) {
            // Проверка на всякий случай
            this.product.is_favorite = false; // Обновляем локально
          }
          console.log(`Product ${this.product?.id} removed from favorites`);
          this.isTogglingFavorite = false;
        },
        // Указываем тип для err
        error: (err: unknown) => {
          // Можно использовать Error или HttpErrorResponse, если импортировать
          const message =
            err instanceof Error
              ? err.message
              : 'Не удалось удалить из избранного.';
          console.error('Failed to remove favorite status:', err);
          this.favoriteError = message;
          this.isTogglingFavorite = false;
          alert(`Ошибка: ${this.favoriteError}`);
        },
      });
    } else {
      // --- Логика ДОБАВЛЕНИЯ ---
      this.favoriteService.addFavorite(this.product.id).subscribe({
        // Можно указать тип для value, если он используется (здесь нет)
        next: (/* fav: Favorite */) => {
          if (this.product) {
            // Проверка
            this.product.is_favorite = true; // Обновляем локально
          }
          console.log(`Product ${this.product?.id} added to favorites`);
          this.isTogglingFavorite = false;
        },
        // Указываем тип для err
        error: (err: unknown) => {
          // Можно использовать Error или HttpErrorResponse
          const message =
            err instanceof Error
              ? err.message
              : 'Не удалось добавить в избранное.';
          console.error('Failed to add favorite status:', err);
          this.favoriteError = message;
          this.isTogglingFavorite = false;
          alert(`Ошибка: ${this.favoriteError}`);
        },
      });
    }
  }
}

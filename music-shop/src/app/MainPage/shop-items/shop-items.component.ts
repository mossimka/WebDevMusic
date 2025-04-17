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

  private favoriteService = inject(FavoriteService);
  public authService = inject(AuthService);

  isTogglingFavorite = false;
  favoriteError: string | null = null;

  toggleFavorite(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.authService.isLoggedIn()) {
      alert('Please log in.');
      return;
    }
    if (this.isTogglingFavorite || !this.product) {
      return;
    }

    this.isTogglingFavorite = true;
    this.favoriteError = null;

    if (this.product.is_favorite) {
      this.favoriteService.removeFavorite(this.product.id).subscribe({
        next: () => {
          if (this.product) {
            this.product.is_favorite = false;
          }
          console.log(`Product ${this.product?.id} removed from favorites`);
          this.isTogglingFavorite = false;
        },
        error: (err: unknown) => {
          const message =
            err instanceof Error
              ? err.message
              : 'Cannot remove from favorites.';
          console.error('Failed to remove favorite status:', err);
          this.favoriteError = message;
          this.isTogglingFavorite = false;
          alert(`Error: ${this.favoriteError}`);
        },
      });
    } else {
      this.favoriteService.addFavorite(this.product.id).subscribe({
        next: (/* fav: Favorite */) => {
          if (this.product) {
            this.product.is_favorite = true;
          }
          console.log(`Product ${this.product?.id} added to favorites`);
          this.isTogglingFavorite = false;
        },
        error: (err: unknown) => {
          const message =
            err instanceof Error
              ? err.message
              : 'Cannot add to favorites.';
          console.error('Failed to add favorite status:', err);
          this.favoriteError = message;
          this.isTogglingFavorite = false;
          alert(`Error: ${this.favoriteError}`);
        },
      });
    }
  }
}

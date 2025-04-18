import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Favorite } from '../../interfaces/favorite';


@Component({
  selector: 'app-favorites-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites-item.component.html',
  styleUrls: ['./favorites-item.component.css']
})
export class FavoritesItemComponent {
  @Input() favoriteItem!: Favorite;

  @Output() removeFavorite = new EventEmitter<number>();

  constructor() { }

  onRemoveClick(): void {
    if (this.favoriteItem?.product?.id) {
      this.removeFavorite.emit(this.favoriteItem.product.id);
    } else {
      console.error("Favorite item or ID is missing, cannot remove.");
    }
  }

  getProductImage(): string | null {
    return this.favoriteItem?.product?.photo || null;
  }
}

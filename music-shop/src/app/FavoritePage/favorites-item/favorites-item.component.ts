import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Import RouterLink

import { Favorite } from '../../interfaces/favorite'; // Adjust path if needed
// Assuming Product interface is also needed indirectly or directly
// import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-favorites-item', // The selector for using this component
  standalone: true,
  imports: [CommonModule, RouterLink], // Add RouterLink here
  templateUrl: './favorites-item.component.html',
  styleUrls: ['./favorites-item.component.css']
})
export class FavoritesItemComponent {
  // Input property to receive the favorite data from the parent
  @Input() favoriteItem!: Favorite; // Use definite assignment assertion or handle undefined

  // Output event emitter to notify the parent when removal is requested
  // Emits the ID of the favorite entry to be removed
  @Output() removeFavorite = new EventEmitter<number>();

  constructor() { }

  onRemoveClick(): void {
    // Check if favoriteItem and its id exist before emitting
    if (this.favoriteItem?.product?.id) {
      // Emit the favorite ID when the remove button is clicked
      this.removeFavorite.emit(this.favoriteItem.product.id);
    } else {
      console.error("Favorite item or ID is missing, cannot remove.");
    }
  }

  // Helper to prevent image errors if photo is null/empty
  getProductImage(): string | null {
    // Assuming your backend provides full URLs or you have a base URL prepend logic
    // If paths are relative, you might need to construct the full URL here
    return this.favoriteItem?.product?.photo || null; // Return null if no photo
    // Example if you need to prepend a base URL:
    // return this.favoriteItem?.product?.photo ? `http://your-media-url/${this.favoriteItem.product.photo}` : 'path/to/default-image.png';
  }
}

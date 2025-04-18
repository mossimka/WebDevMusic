import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../../services/favorite.service';
import { Favorite } from '../../interfaces/favorite';
import { Subscription } from 'rxjs';
// Remove ShopItemsComponent import if no longer needed directly
// import { ShopItemsComponent } from '../../MainPage/shop-items/shop-items.component';
import { RouterLink } from '@angular/router';
import { FavoritesItemComponent} from '../favorites-item/favorites-item.component';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [
    CommonModule,
    // ShopItemsComponent, // Remove if only FavoriteItemComponent is used
    RouterLink,
    FavoritesItemComponent // <<< Add the new component here
  ],
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css'],
})
export class FavoriteComponent implements OnInit, OnDestroy {
  private favoriteService = inject(FavoriteService);

  favorites: Favorite[] = []
  loading = true;
  error: string | null = null;
  private updateSub?: Subscription;
  private dataSub?: Subscription;

  ngOnInit(): void {
    this.loadFavorites();
    // Subscribe to updates (e.g., if an item is added/removed elsewhere)
    this.updateSub = this.favoriteService.favoritesUpdated$.subscribe(() => {
      console.log('Favorites updated event received, reloading...');
      this.loadFavorites();
    });
  }

  ngOnDestroy(): void {
    this.updateSub?.unsubscribe();
    this.dataSub?.unsubscribe();
  }

  loadFavorites(): void {
    console.log('loadFavorites starting');
    this.loading = true;
    this.error = null;
    this.dataSub?.unsubscribe(); // Unsubscribe from previous data fetch

    this.dataSub = this.favoriteService.getFavorites().subscribe({
      next: (data) => {
        console.log('Favorites data received:', data);
        this.favorites = data;
        this.loading = false;
        this.error = null;
      },
      error: (err) => {
        console.error('Error loading favorites:', err);
        // Provide a more user-friendly error message
        this.error = "Could not load your favorite items. Please try again.";
        this.loading = false;
        this.favorites = []; // Clear favorites on error
      },
    });
  }

  retryLoad(): void {
    this.loadFavorites();
  }

  // --- New Method to Handle Removal ---
  handleRemoveFavorite(favoriteId: number): void {
    console.log(`Attempting to remove favorite with ID: ${favoriteId}`);
    // Assuming favoriteService has a method like removeFavorite(id)
    // Adjust if your service uses productId instead.
    this.favoriteService.removeFavorite(favoriteId).subscribe({
      next: () => {
        console.log(`Favorite ${favoriteId} removed successfully.`);
        // Optionally remove immediately from the local array for faster UI update,
        // but favoritesUpdated$ should trigger a reload anyway.
        // this.favorites = this.favorites.filter(fav => fav.id !== favoriteId);

        // The favoritesUpdated$ observable in the service should ideally emit
        // after successful deletion, triggering the subscription in ngOnInit
        // which calls loadFavorites() to refresh the list from the backend.
        // If favoritesUpdated$ doesn't exist or fire automatically, uncomment
        // the line above or call this.loadFavorites() here.
      },
      error: (err) => {
        console.error(`Error removing favorite ${favoriteId}:`, err);
        // Optionally show an error message to the user
        this.error = "Could not remove item from favorites. Please try again.";
      }
    });
  }
}

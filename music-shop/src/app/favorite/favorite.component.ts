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

  favorites: Favorite[] = []
  loading = true;
  error: string | null = null;
  private updateSub?: Subscription;
  private dataSub?: Subscription;

  ngOnInit(): void {
    this.loadFavorites();
    this.updateSub = this.favoriteService.favoritesUpdated$.subscribe(() => {
      this.loadFavorites();
    });
  }

  ngOnDestroy(): void {
    this.updateSub?.unsubscribe();
    this.dataSub?.unsubscribe();
  }

  loadFavorites(): void {
    console.log('loadFavorites starting (Simpler Version)');
    this.loading = true;
    this.error = null;
    this.favorites = [];
    this.dataSub?.unsubscribe();

    this.dataSub = this.favoriteService.getFavorites().subscribe({
      next: (data) => {
        console.log('Favorites data received:', data);
        this.favorites = data;
        this.loading = false;
        this.error = null;
      },
      error: (err) => {
        console.error('Error loading favorites:', err);
        this.error = err.message || "Can't load favorites";
        this.loading = false;
        this.favorites = [];
      },
    });
  }

  retryLoad(): void {
    this.loadFavorites();
  }
}

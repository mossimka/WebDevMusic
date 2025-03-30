import { Component } from '@angular/core';
import { ShopItemsComponent } from "./shop-items/shop-items.component";
import { Product } from './product';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
   standalone: true,
  imports: [CommonModule, RouterModule], 
  template: `
    <header>
      <img class="brand-logo" src="/assets/logo.png" alt="logo">
    </header>
    <main>
      <section class="results">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'music-shop';
}

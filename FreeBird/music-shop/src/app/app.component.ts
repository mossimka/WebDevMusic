import { Component } from '@angular/core';
import { ShopItemsComponent } from "./shop-items/shop-items.component";
import { Product } from './product';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
   standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'music-shop';

  logged_in:boolean = false;
}

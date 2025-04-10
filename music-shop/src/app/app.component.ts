import { Component } from '@angular/core';
import { ShopItemsComponent } from "./shop-items/shop-items.component";
import { Product } from './interfaces/product';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'music-shop';

  logged_in = false;
  isPopupVisible = false;

  log(){
    this.logged_in = !this.logged_in;
  }
  popUp() {
    this.isPopupVisible = !this.isPopupVisible;
  }
}

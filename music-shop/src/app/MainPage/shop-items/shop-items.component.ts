import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import {CartButtonComponent} from '../../Buttons/cart-button/cart-button.component';

@Component({
  selector: 'app-shop-items',
  standalone: true,
  imports: [CommonModule, RouterModule, CartButtonComponent],
  templateUrl: 'shop-items.component.html',
  styleUrl: `./shop-items.css`,
})
export class ShopItemsComponent {
  @Input() product!:Product;
  @Output() productRemoved = new EventEmitter<Number>();

  liked = false;

  like(){
    if (!this.liked){
      this.product.likes++;
      this.liked = true;
    } else{
      this.product.likes--;
      this.liked = false;
    }
  }
  remove(){
    this.productRemoved.emit(this.product.id);
  }
}

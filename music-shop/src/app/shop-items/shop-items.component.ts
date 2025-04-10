import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../interfaces/product';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shop-items',
  standalone: true,
  imports: [CommonModule, RouterModule],
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

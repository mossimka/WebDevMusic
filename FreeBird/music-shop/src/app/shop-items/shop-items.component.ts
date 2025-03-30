import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../product';
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

  like(){
    this.product.likes++;
  }
  remove(){
    this.productRemoved.emit(this.product.id);
  }
}

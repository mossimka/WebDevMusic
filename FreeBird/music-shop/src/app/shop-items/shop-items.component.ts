import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../product';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shop-items',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="listing">
      <div class="listing-photo-frame">
        <img class="listing-photo" [src]="product.photo" alt="Photo of: {{ product.name }}">
        <div class="actions">
          <div div class="likes" (click)="like()"><img src="/assets/like-icon.png"> {{product.likes}}</div>
          <p class="remove" (click)="remove()">🗑</p>  
        </div>
      </div>
      <div class="listing-info">
        <h2 class="listing-heading"> {{ product.name }} </h2>
        <h3>☆ {{product.rating}}</h3>
        <p class="lisitng-price"> {{ product.price }} ₸ </p>
        <button class="primary" [routerLink]="['/details', product.id]">View Details</button>
      </div>
    </section>
  `,
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

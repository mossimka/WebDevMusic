import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartItem } from '../../interfaces/cart-item'; // Adjust path as needed
import { CommonModule, CurrencyPipe } from '@angular/common'; // Import CommonModule for *ngIf etc., CurrencyPipe

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {
  @Input() cartItem!: CartItem;

  @Output() remove = new EventEmitter<number>();
  @Output() update = new EventEmitter<{ itemId: number; quantity: number }>();

  constructor() {}

  onRemoveClick(): void {
    if (this.cartItem && this.cartItem.id) {
      this.remove.emit(this.cartItem.id);
    } else {
      console.error("Cart item data is missing for removal.");
    }
  }

  onQuantityChange(newQuantity: number): void {
    if (newQuantity < 1) {
      newQuantity = 1;
    }
    if (this.cartItem && this.cartItem.id && newQuantity !== this.cartItem.quantity) {
       this.update.emit({ itemId: this.cartItem.id, quantity: newQuantity });
    }
  }

  incrementQuantity(): void {
    this.onQuantityChange(this.cartItem.quantity + 1);
  }

  decrementQuantity(): void {
    this.onQuantityChange(this.cartItem.quantity - 1);
  }
}

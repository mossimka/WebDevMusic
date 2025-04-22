import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {CommonModule, NgForOf} from '@angular/common';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { CartItem } from '../../interfaces/cart-item';
import { CartService } from '../../services/cart.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {RouterLink} from '@angular/router';
import {RoutingButtonComponent} from '../../Buttons/routing-button/routing-button.component';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    NgForOf,
    CartItemComponent,
    RoutingButtonComponent
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  cartItemList: CartItem[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();

    this.cartService.cartUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadCartItems();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCartItems(): void {
    this.cartService.getCartItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe((cartItems) => {
        this.cartItemList = cartItems;
      });
  }

  handleRemoveItem(itemId: number): void {
    this.cartService.removeItem(itemId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadCartItems();
        }
      });
  }

  handleUpdateQuantity(update: { itemId: number; quantity: number }): void {
    this.cartService.updateItemQuantity(update.itemId, update.quantity)
       .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
           this.loadCartItems();
        }
      });
  }

  calculateTotalPrice(): number {
    return this.cartItemList.reduce(
      (total, item) => {
        const itemPrice = parseFloat(item.item_total_price.toString());
        return total + itemPrice;
      },
      0
    );
  }

  createOrder(): void {
    if (this.cartItemList.length === 0) {
      console.warn('Cannot create an empty order.');
      return;
    }

    const itemsData = this.cartItemList.map(item => ({
      product: item.product,
      quantity: item.quantity
    }));

    const orderPayload = {
      items_data: itemsData
    };

    this.orderService.createOrder(orderPayload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (order) => {
          console.log('Order created:', order);
          this.cartService.clearCart().subscribe(() => {
            this.router.navigate(['/orders', order.id]);
          });
        }
      });
  }
}

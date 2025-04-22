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
  private authService = inject(AuthService);

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
        console.log('Cart items loaded:', this.cartItemList);
      });
  }

  handleRemoveItem(itemId: number): void {
    console.log('Removing item with ID:', itemId);
    this.cartService.removeItem(itemId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Item removed successfully');
          this.loadCartItems();
        },
        error: (err) => console.error('Failed to remove item:', err)
      });
  }

  handleUpdateQuantity(update: { itemId: number; quantity: number }): void {
    console.log('Updating quantity:', update);
    this.cartService.updateItemQuantity(update.itemId, update.quantity)
       .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
           console.log('Quantity updated successfully');
           this.loadCartItems();
        },
        error: (err) => console.error('Failed to update quantity:', err)
      });
  }

  calculateTotalPrice(): number {
    return this.cartItemList.reduce(
      (total, item) => {
        const itemPrice = parseFloat(item.item_total_price.toString());
        return total + (isNaN(itemPrice) ? 0 : itemPrice);
      },
      0
    );
  }

  createOrder(): void {
    this.authService.getCurrentUser()
      .subscribe({
        next: (user) => {
          if (!user || typeof user.id === 'undefined') {
            console.error('Cannot create order: Valid user data not available.');
            return;
          }
          const currentUserId = user.id;
          const orderData = {
            user: currentUserId,
            items: this.cartItemList.map(item => ({
              product: item.product,
              quantity: item.quantity
            })),
            total_order_price: this.calculateTotalPrice()
          };

          this.orderService.createOrder(orderData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (order) => {
                console.log('Order created:', order);
                this.cartService.clearCart().subscribe(() => {
                  this.router.navigate(['/orders']);
                });
              },
              error: (err) => {
                console.error('Failed to create order:', err);
              }
            });
        },
        error: (err) => {
          console.error('Failed to get user details before creating order:', err);
        }
      });
  }
}

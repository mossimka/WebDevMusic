import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../interfaces/order';

import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);

  orders: Order[] = [];
  loading = true;
  error: string | null = null;

  private ordersSub?: Subscription;

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.ordersSub?.unsubscribe();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    this.orders = [];

    this.ordersSub?.unsubscribe();

    this.ordersSub = this.orderService.getMyOrders().subscribe({
      next: (loadedOrders) => {
        this.orders = loadedOrders;
        this.loading = false;
        this.error = null;
        console.log('Orders loaded (manual sub):', this.orders);
      },
      error: (err) => {
        console.error('Error loading orders (manual sub):', err);
        this.error = err.message || "Can't load orders History.";
        this.loading = false;
        this.orders = [];
      },
    });
  }

  retryLoad(): void {
    this.loadOrders();
  }
}

import { Component, OnInit, inject } from '@angular/core';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
} from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../interfaces/order';
import { Observable, catchError, of, tap } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'], // Убедись, что этот CSS есть или удали строку
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  orders$: Observable<Order[]> = of([]);
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    this.orders$ = this.orderService.getMyOrders().pipe(
      tap({
        // Используем tap для побочных эффектов
        // next: () => console.log('Orders loaded'), // Можно убрать в продакшене
        error: () => (this.loading = false), // Выключаем загрузку при ошибке
        complete: () => (this.loading = false), // Выключаем загрузку при успехе
      }),
      catchError((err) => {
        console.error('Error loading orders:', err);
        this.error = err.message || 'Не удалось загрузить историю заказов.';
        return of([]); // Возвращаем пустой массив в случае ошибки
      })
    );
  }

  retryLoad(): void {
    this.loadOrders();
  }
}

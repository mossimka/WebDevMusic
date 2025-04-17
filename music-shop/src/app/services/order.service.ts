import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'http://localhost:8000/api/orders/';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}${id}/`);
  }

  createOrder(orderData?: any): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, orderData || {});
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/my-orders/`);
  }
  getOrderDetails(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/orders/${orderId}/`);
  }
}

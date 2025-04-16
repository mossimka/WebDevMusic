import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../interfaces/cart';
import { CartItem } from '../interfaces/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartUrl = 'http://localhost:8000/api/cart/';
  private itemsUrl = 'http://localhost:8000/api/cart/items/';

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.cartUrl);
  }

  clearCart(): Observable<Cart> {
    return this.http.delete<Cart>(this.cartUrl);
  }

  getCartItems(): Observable<CartItem[]> {
      return this.http.get<CartItem[]>(this.itemsUrl);
  }

  addCartItem(itemData: { product: number; quantity: number }): Observable<CartItem> {
    return this.http.post<CartItem>(this.itemsUrl, itemData);
  }

  updateCartItem(itemId: number, itemData: { quantity: number }): Observable<CartItem> {
    return this.http.patch<CartItem>(`${this.itemsUrl}${itemId}/`, itemData);
  }

  removeCartItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.itemsUrl}${itemId}/`);
  }
}

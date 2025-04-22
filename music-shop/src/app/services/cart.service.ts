import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Cart } from '../interfaces/cart';
import { CartItem } from '../interfaces/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartUrl = 'http://localhost:8000/api/cart/';
  private itemsUrl = 'http://localhost:8000/api/cart/items/';


  private _cartUpdated = new Subject<void>();
  cartUpdated$ = this._cartUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getCartItems(): Observable<CartItem[]> {
      return this.http.get<CartItem[]>(this.itemsUrl);
  }

  removeItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.itemsUrl}${itemId}/`).pipe(
      tap(() => {
        // Notify subscribers that the cart has changed
        this._cartUpdated.next();
        console.log(`CartService: Emitted cart update after removing item ${itemId}`);
      })
    );
  }

  updateItemQuantity(itemId: number, quantity: number): Observable<CartItem> {
    const itemData = { quantity: quantity };
    return this.http.patch<CartItem>(`${this.itemsUrl}${itemId}/`, itemData).pipe(
      tap((updatedItem) => {
        this._cartUpdated.next();
        console.log(`CartService: Emitted cart update after updating item ${itemId} to quantity ${updatedItem.quantity}`);
      })
    );
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.cartUrl);
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.cartUrl).pipe(
       tap(() => {
        this._cartUpdated.next();
        console.log(`CartService: Emitted cart update after clearing cart`);
      })
    );
  }

  addCartItem(productData: { product: number; quantity: number }): Observable<CartItem> {
    return this.http.post<CartItem>(this.itemsUrl, productData).pipe(
      tap((addedItem) => {
        this._cartUpdated.next();
        console.log(`CartService: Emitted cart update after adding product ${addedItem.product}`);
      })
    );
  }

}

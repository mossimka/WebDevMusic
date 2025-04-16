import {CartItem} from './cart-item';
import {User} from './user';

export interface Cart {
  id: number;
  user: User;
  items: CartItem[];
  total_cart_price: number;
  created_at: string;
  updated_at: string;
}

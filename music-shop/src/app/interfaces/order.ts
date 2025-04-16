import {OrderItem} from './order-item';

export interface Order {
  id: number;
  user: number;
  date: string;
  items: OrderItem[];
  total_order_price: number;
}

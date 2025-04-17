import { OrderItem } from './order-item';

export interface Order {
  date_ordered: string | number | Date;
  id: number;
  user: number;
  date: string;
  items: OrderItem[];
  total_order_price: number;
}

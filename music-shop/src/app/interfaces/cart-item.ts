export interface CartItem {
  id: number;
  product: number;
  product_name: string;
  product_price: number;
  product_photo_url?: string;
  quantity: number;
  item_total_price: number;
}

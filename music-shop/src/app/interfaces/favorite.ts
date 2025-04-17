import { Product } from './product';

// Структура для чтения (GET /api/favorites/)
export interface Favorite {
  id: number;
  user: number;
  product: Product; // Вложенные данные продукта
  added_on: string;
}

// Структура для создания (POST /api/favorites/)
export interface CreateFavorite {
  product_id: number;
}

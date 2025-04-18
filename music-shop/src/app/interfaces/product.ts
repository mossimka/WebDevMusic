export interface Product {
  id: number;
  name: string;
  price: number;
  photo: string;
  photo_url: string;
  subPhotos: string[];
  category: string;
  description: string;
  availableUnits: number;
  country: string;
  link: string;
  telegram: string;
  whatsapp: string;
  is_favorite?: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  photo: string;
  photo_url: string;
  subPhotos: string[];
  category: string; // number -> string
  description: string;
  availableUnits: number;
  country: string;
  link: string;
  telegram: string;
  whatsapp: string;
  rating: number;
  likes: number;
  is_favorite?: boolean;
}

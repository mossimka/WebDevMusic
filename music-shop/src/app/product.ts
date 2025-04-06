export interface Product {
    id: number;
    name: string;
    price: number;
    photo: string;
    photo_url: string;
    subPhotos: string[];
    type: string;
    description: string;
    availableUnits: number;
    country: string;
    link: string;
    telegram: string;
    whatsapp: string;
    rating: number;
    likes: number;
}

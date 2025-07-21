export interface PartCategory {
  id: number;
  name: string;
  slug: string;
}

export interface PartImage {
  id: number;
  image: string;
  is_primary: boolean;
  created_at: string;
}

export interface Part {
  id: number;
  name: string;
  category: PartCategory;
  brand: string;
  compatible_models: string;
  price: string; // Django renvoie un string pour DecimalField
  stock: number;
  condition: 'new' | 'used_excellent' | 'used_good' | 'used_fair' | 'refurbished';
  description: string;
  is_available: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  images: PartImage[];
}

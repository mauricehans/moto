export interface Part {
  id: string;
  name: string;
  category: string;
  brand: string;
  compatibleModels: string;
  price: number;
  stock: number;
  condition: 'new' | 'used_excellent' | 'used_good' | 'used_fair' | 'refurbished';
  description: string;
  specifications: Record<string, string>;
  images: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: string;
}
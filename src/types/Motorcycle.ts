export interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engine: string;
  power: number;
  license: string;
  color: string;
  description: string;
  features: string[];
  images: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  createdAt: string;
}
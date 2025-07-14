export interface MotorcycleImage {
  id: number;
  image: string;
  is_primary: boolean;
  created_at: string;
}

export interface Motorcycle {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: string; // Django renvoie un string pour DecimalField
  mileage: number;
  engine: string;
  power: number;
  license: string;
  color: string;
  description: string;
  is_sold: boolean;
  is_new: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  images: MotorcycleImage[];
}

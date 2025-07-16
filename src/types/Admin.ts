export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'moderator' | 'editor';
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
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
  license: 'A1' | 'A2' | 'A';
  color: string;
  description: string;
  is_sold: boolean;
  is_new: boolean;
  is_featured: boolean;
  images: MotorcycleImage[];
  created_at: string;
  updated_at: string;
}

export interface MotorcycleImage {
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
  images: PartImage[];
  created_at: string;
  updated_at: string;
}

export interface PartCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface PartImage {
  id: number;
  image: string;
  is_primary: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: BlogCategory;
  image: string;
  is_published: boolean;
  author: User;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface GarageSettings {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  social_media: SocialMediaLinks;
  business_hours: BusinessHours;
  seo_settings: SEOSettings;
}

export interface SocialMediaLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  twitter: string;
  linkedin: string;
}

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  is_closed: boolean;
}

export interface SEOSettings {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
}

export interface AdminStats {
  total_motorcycles: number;
  sold_motorcycles: number;
  total_parts: number;
  low_stock_parts: number;
  total_blog_posts: number;
  published_posts: number;
  total_users: number;
  active_users: number;
  monthly_revenue: number;
  monthly_views: number;
}

export type TabType = 'dashboard' | 'motorcycles' | 'parts' | 'blog' | 'users' | 'settings' | 'analytics';

export interface FormData {
  [key: string]: string | number | boolean | File | null | undefined;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

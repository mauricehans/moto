import axios, { AxiosResponse } from 'axios';
import { Motorcycle } from '../types/Motorcycle';
import { Part, PartCategory } from '../types/Part';
import { Post, BlogCategory } from '../types/Blog';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Configuration d'axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Intercepteur pour les erreurs
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.code === 'ECONNREFUSED') {
      console.warn('Backend server is not running. Using fallback behavior.');
    }
    return Promise.reject(error);
  }
);

// Interface pour les réponses paginées
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Services pour les motos
export const motorcycleService = {
  getAll: (): Promise<AxiosResponse<PaginatedResponse<Motorcycle>>> => 
    api.get('/motorcycles/motorcycles/'),
  
  getById: (id: string): Promise<AxiosResponse<Motorcycle>> => 
    api.get(`/motorcycles/motorcycles/${id}/`),
  
  getFeatured: (): Promise<AxiosResponse<Motorcycle[]>> => 
    api.get('/motorcycles/motorcycles/featured/'),
  
  create: (data: Omit<Motorcycle, 'id' | 'created_at' | 'updated_at'>): Promise<AxiosResponse<Motorcycle>> => 
    api.post('/motorcycles/motorcycles/', data), // Déjà correct
  
  update: (id: string, data: Partial<Motorcycle>): Promise<AxiosResponse<Motorcycle>> => 
    api.put(`/motorcycles/motorcycles/${id}/`, data),
  
  delete: (id: string): Promise<AxiosResponse<void>> => 
    api.delete(`/motorcycles/motorcycles/${id}/`),
};

// Services pour les pièces détachées
export const partsService = {
  getAll: (): Promise<AxiosResponse<PaginatedResponse<Part>>> => 
    api.get('/parts/parts/'),
  
  getById: (id: string): Promise<AxiosResponse<Part>> => 
    api.get(`/parts/parts/${id}/`),
  
  getCategories: (): Promise<AxiosResponse<PartCategory[]>> => 
    api.get('/parts/categories/'),
  
  create: (data: Omit<Part, 'id' | 'created_at' | 'updated_at'>): Promise<AxiosResponse<Part>> => 
    api.post('/parts/parts/', data), // Déjà correct
  
  update: (id: string, data: Partial<Part>): Promise<AxiosResponse<Part>> => 
    api.put(`/parts/parts/${id}/`, data),
  
  delete: (id: string): Promise<AxiosResponse<void>> => 
    api.delete(`/parts/parts/${id}/`),
};

// Services pour le blog
export const blogService = {
  getPosts: (): Promise<AxiosResponse<PaginatedResponse<Post>>> => 
    api.get('/blog/posts/'),
  
  getPostById: (id: string): Promise<AxiosResponse<Post>> => 
    api.get(`/blog/posts/${id}/`),
  
  getCategories: (): Promise<AxiosResponse<BlogCategory[]>> => 
    api.get('/blog/categories/'),
};

export default api;

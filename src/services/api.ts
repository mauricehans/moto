import axios from 'axios';
import { Motorcycle } from '../types/Motorcycle';
import { Part, PartCategory } from '../types/Part';
import { Post, BlogCategory } from '../types/Blog';

const API_BASE_URL = 'http://localhost:8000/api';

// Configuration d'axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes de timeout
});

// Intercepteur pour les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running on http://localhost:8000');
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
  getAll: () => api.get<PaginatedResponse<Motorcycle>>('/motorcycles/motorcycles/'),
  getById: (id: string) => api.get<Motorcycle>(`/motorcycles/motorcycles/${id}/`),
  getFeatured: () => api.get<Motorcycle[] | PaginatedResponse<Motorcycle>>('/motorcycles/motorcycles/featured/'),
  create: (data: Motorcycle) => api.post<Motorcycle>('/motorcycles/motorcycles/', data),
  update: (id: string, data: Motorcycle) => api.put<Motorcycle>(`/motorcycles/motorcycles/${id}/`, data),
  delete: (id: string) => api.delete<void>(`/motorcycles/motorcycles/${id}/`),
};

// Services pour les pièces détachées
export const partsService = {
  getAll: () => api.get<PaginatedResponse<Part>>('/parts/parts/'),
  getById: (id: string) => api.get<Part>(`/parts/parts/${id}/`),
  getCategories: () => api.get<PartCategory[]>('/parts/categories/'),
  create: (data: Part) => api.post<Part>('/parts/parts/', data),
  update: (id: string, data: Part) => api.put<Part>(`/parts/parts/${id}/`, data),
  delete: (id: string) => api.delete<void>(`/parts/parts/${id}/`),
};

// Services pour le blog
export const blogService = {
  getPosts: () => api.get<PaginatedResponse<Post>>('/blog/posts/'),
  getPostById: (id: string) => api.get<Post>(`/blog/posts/${id}/`),
  getCategories: () => api.get<BlogCategory[]>('/blog/categories/'),
};

export default api;
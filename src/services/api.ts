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

// Intercepteur de requête pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse pour gérer le rafraîchissement du token
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh: refreshToken });
        localStorage.setItem('access_token', response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Optionnel: rediriger vers la page de login
      }
    }
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
  
  create: (data: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<AxiosResponse<Post>> => 
    api.post('/blog/posts/', data),
  
  update: (id: string, data: Partial<Post>): Promise<AxiosResponse<Post>> => 
    api.put(`/blog/posts/${id}/`, data),
  
  delete: (id: string): Promise<AxiosResponse<void>> => 
    api.delete(`/blog/posts/${id}/`),
};

export default api;

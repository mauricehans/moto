import axios from 'axios';

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
  getAll: () => api.get<PaginatedResponse<any>>('/motorcycles/motorcycles/'),
  getById: (id: string) => api.get(`/motorcycles/motorcycles/${id}/`),
  getFeatured: () => api.get('/motorcycles/motorcycles/featured/'),
  create: (data: any) => api.post('/motorcycles/motorcycles/', data),
  update: (id: string, data: any) => api.put(`/motorcycles/motorcycles/${id}/`, data),
  delete: (id: string) => api.delete(`/motorcycles/motorcycles/${id}/`),
};

// Services pour les pièces détachées
export const partsService = {
  getAll: () => api.get<PaginatedResponse<any>>('/parts/parts/'),
  getById: (id: string) => api.get(`/parts/parts/${id}/`),
  getCategories: () => api.get('/parts/categories/'),
  create: (data: any) => api.post('/parts/parts/', data),
  update: (id: string, data: any) => api.put(`/parts/parts/${id}/`, data),
  delete: (id: string) => api.delete(`/parts/parts/${id}/`),
};

// Services pour le blog
export const blogService = {
  getPosts: () => api.get<PaginatedResponse<any>>('/blog/posts/'),
  getPostById: (id: string) => api.get(`/blog/posts/${id}/`),
  getCategories: () => api.get('/blog/categories/'),
};

export default api;
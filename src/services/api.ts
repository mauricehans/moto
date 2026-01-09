import axios, { AxiosResponse } from 'axios';
import { Motorcycle } from '../types/Motorcycle';
import { Part, PartCategory } from '../types/Part';
import { Post, BlogCategory } from '../types/Blog';
import { GarageSettings } from '../types/Admin';

// Configuration simplifiée de l'URL de l'API
// Utilise des URLs relatives qui passent par le proxy Vite configuré
const API_BASE_URL = '/api';
console.log('API_BASE_URL configured:', API_BASE_URL, 'Using Vite proxy configuration');

// Configuration d'axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Cache pour éviter de vérifier l'API à chaque appel
let apiAvailabilityCache: { available: boolean; timestamp: number } | null = null;
const CACHE_DURATION = 30000; // 30 secondes

// Forcer la suppression du cache au démarrage
apiAvailabilityCache = null;

// Nettoyer les tokens invalides au démarrage
const cleanInvalidTokens = () => {
  const token = localStorage.getItem('access_token');
  if (token) {
    try {
      // Vérifier si le token est expiré (simple vérification basique)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      if (payload.exp && payload.exp < now) {
        console.log('Token expiré détecté, nettoyage du localStorage');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    } catch (error) {
      console.log('Token invalide détecté, nettoyage du localStorage');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }
};

// Nettoyer les tokens au démarrage
cleanInvalidTokens();

// Fonction pour vérifier si l'API backend Django est disponible
const isApiAvailable = async () => {
  console.log('Checking API availability. API_BASE_URL:', API_BASE_URL);
  
  // Vérifier le cache
  const now = Date.now();
  if (apiAvailabilityCache && (now - apiAvailabilityCache.timestamp) < CACHE_DURATION) {
    console.log('Using cached API availability:', apiAvailabilityCache.available);
    return apiAvailabilityCache.available;
  }
  
  try {
    console.log('Testing API endpoint via proxy:', `${API_BASE_URL}/health/`);
    const response = await axios.get(`${API_BASE_URL}/health/`, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const isAvailable = response.status === 200;
    console.log('API Health Check - Status:', response.status, 'Available:', isAvailable);
    
    // Mettre à jour le cache
    apiAvailabilityCache = { available: isAvailable, timestamp: now };
    
    return isAvailable;
  } catch (error: any) {
    console.error('Erreur de connexion à l\'API Django via proxy:', {
      message: error.message,
      code: error.code,
      status: error.response?.status
    });
    
    // Mettre à jour le cache avec false
    apiAvailabilityCache = { available: false, timestamp: now };
    
    throw error; // Propager l'erreur au lieu de retourner false
  }
};

// Intercepteur de requête pour ajouter le token
api.interceptors.request.use(
  (config) => {
    // Liste des endpoints publics qui n'ont pas besoin d'authentification
    const publicEndpoints = [
      '/health/',
      '/motorcycles/',
      '/parts/',
      '/blog/',
      '/blog/posts/',
      '/blog/categories/',
      '/parts/categories/'
    ];
    
    // Vérifier si l'endpoint est public
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url?.includes(endpoint) && config.method?.toLowerCase() === 'get'
    );

    if (config.url && config.url.includes('/login/')) {
      return config;
    }
    
    // Ajouter le token seulement si ce n'est pas un endpoint public
    if (!isPublicEndpoint) {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
        if (!refreshToken || (originalRequest.url && originalRequest.url.includes('/login/'))) {
          throw new Error('No refresh token');
        }
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh: refreshToken });
        localStorage.setItem('access_token', response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.reject(error);
      }
    }
    const url = error.config?.url || '';
    // Ignorer les requêtes GET de pages frontend comme /blog/admin/
    if (error.response?.status === 404 && typeof url === 'string' && url.endsWith('/blog/admin/')) {
      return Promise.reject(error);
    }
    // Ignorer l'erreur 403 sur /superadmin/admins/ car c'est une vérification de droits normale
    if (error.response?.status === 403 && typeof url === 'string' && url.includes('/superadmin/admins/')) {
      return Promise.reject(error);
    }
    console.error('API Error Details:', {
      url,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.config?.headers
    });
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
  getAll: async (): Promise<AxiosResponse<PaginatedResponse<Motorcycle>>> => {
    return api.get('/motorcycles/');
  },
  
  getById: async (id: string): Promise<AxiosResponse<Motorcycle>> => {
    return api.get(`/motorcycles/${id}/`);
  },
  
  getFeatured: async (): Promise<AxiosResponse<Motorcycle[]>> => {
    return api.get('/motorcycles/featured/');
  },
  
  create: async (data: Omit<Motorcycle, 'id' | 'created_at' | 'updated_at'>): Promise<AxiosResponse<Motorcycle>> => {
    return api.post('/motorcycles/', data);
  },
  
  update: async (id: string, data: Partial<Motorcycle>): Promise<AxiosResponse<Motorcycle>> => {
    return api.put(`/motorcycles/${id}/`, data);
  },
  
  delete: (id: string): Promise<AxiosResponse<void>> => {
    return api.delete(`/motorcycles/${id}/`);
  },
};



// Services pour les pièces détachées
export const partsService = {
  getAll: async (): Promise<AxiosResponse<PaginatedResponse<Part>>> => {
    return api.get('/parts/');
  },
  
  getById: async (id: string): Promise<AxiosResponse<Part>> => {
    return api.get(`/parts/${id}/`);
  },
  
  getCategories: async (): Promise<AxiosResponse<PartCategory[]>> => {
    return api.get('/parts/categories/');
  },
  
  create: async (data: Omit<Part, 'id' | 'created_at' | 'updated_at'>): Promise<AxiosResponse<Part>> => {
    return api.post('/parts/', data);
  },
  
  update: async (id: string, data: Partial<Part>): Promise<AxiosResponse<Part>> => {
    return api.patch(`/parts/${id}/`, {
      ...data,
      price: Number(data.price) || 0,
      stock: Number(data.stock) || 0,
      category: Number(data.category) || null,
      name: data.name?.trim(),
      // Only process slug if it exists in data
      ...(data.name && { slug: data.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') })
    });
  },
  
  delete: async (id: string): Promise<AxiosResponse<void>> => {
    return api.delete(`/parts/${id}/`);
  },
};



// Services pour le blog
export const blogService = {
  getPosts: async (): Promise<AxiosResponse<PaginatedResponse<Post>>> => {
    return api.get('/blog/');
  },
  
  getPostById: async (id: string): Promise<AxiosResponse<Post>> => {
    return api.get(`/blog/${id}/`);
  },
  
  getCategories: async (): Promise<AxiosResponse<BlogCategory[]>> => {
    return api.get('/blog/categories/');
  },
  
  create: async (data: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<AxiosResponse<Post>> => {
    return api.post('/blog/', data);
  },
  
  update: async (id: string, data: Partial<Post>): Promise<AxiosResponse<Post>> => {
    const payload: any = {
      title: data.title?.trim(),
      content: data.content?.trim(),
      is_published: data.is_published,
    };
    if ((data as any).category !== undefined) {
      const cat = (data as any).category;
      const cid = typeof cat === 'number' ? cat : cat?.id;
      if (cid !== undefined && cid !== null && cid !== '') {
        payload.category_id = cid;
      }
    }
    return api.put(`/blog/${id}/`, payload);
  },
  
  delete: async (id: string): Promise<AxiosResponse<void>> => {
    return api.delete(`/blog/${id}/`);
  },
};

// Services pour la gestion des images
export const imageService = {
  // Upload d'images pour les motos
  uploadMotorcycleImages: (motorcycleId: string, files: FileList): Promise<AxiosResponse<{ id: number; url: string }[]>> => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    return api.post(`/motorcycles/${motorcycleId}/upload_images/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Upload d'images pour les pièces
  uploadPartImages: (partId: string, files: FileList): Promise<AxiosResponse<{ id: number; url: string }[]>> => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    return api.post(`/parts/${partId}/upload_images/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Upload d'image pour les articles de blog
  uploadBlogImage: (postSlug: string, file: File): Promise<AxiosResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post(`/blog/${postSlug}/upload_image/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Définir une image comme principale pour les motos
  setMotorcyclePrimaryImage: (motorcycleId: string, imageId: number): Promise<AxiosResponse<{ success: boolean }>> =>
    api.post(`/motorcycles/${motorcycleId}/set_primary_image/`, { image_id: imageId }),
  
  // Définir une image comme principale pour les pièces
  setPartPrimaryImage: (partId: string, imageId: number): Promise<AxiosResponse<{ success: boolean }>> =>
    api.post(`/parts/${partId}/set_primary_image/`, { image_id: imageId }),
  
  // Supprimer une image de moto
  deleteMotorcycleImage: (motorcycleId: string, imageId: number): Promise<AxiosResponse<void>> => 
    api.delete(`/motorcycles/${motorcycleId}/delete_image/`, { data: { image_id: imageId } }),
  
  // Supprimer une image de pièce
  deletePartImage: (partId: string, imageId: number): Promise<AxiosResponse<void>> => 
    api.delete(`/parts/${partId}/delete_image/`, { data: { image_id: imageId } }),
  
  // Supprimer l'image d'un article de blog
  deleteBlogImage: (postSlug: string): Promise<AxiosResponse<void>> => 
    api.delete(`/blog/${postSlug}/delete_image/`),
};



// Services pour les paramètres du garage
export const garageService = {
  getSettings: async (): Promise<AxiosResponse<GarageSettings>> => {
    return api.get('/garage/settings/');
  },
  
  updateSettings: async (data: Partial<GarageSettings>): Promise<AxiosResponse<GarageSettings>> => {
    return api.put('/garage/settings/', data);
  },
};

// Services pour l'administration
export const adminService = {
  requestPasswordReset: (email: string): Promise<AxiosResponse<{ message: string }>> => 
    api.post('/admin/password-reset/', { email }),
  
  confirmPasswordReset: (data: { token: string; new_password: string }): Promise<AxiosResponse<{ message: string }>> => 
    api.post('/admin/password-reset/confirm/', data),
};

export default api;

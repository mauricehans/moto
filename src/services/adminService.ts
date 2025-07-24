import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000/api';

// Configuration d'axios pour l'administration
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Services pour l'administration
export const adminService = {
  requestPasswordReset: (email: string): Promise<AxiosResponse<{ message: string }>> => 
    adminApi.post('/admin/password-reset/', { email }),
  
  confirmPasswordReset: (data: { token: string; new_password: string }): Promise<AxiosResponse<{ message: string }>> => 
    adminApi.post('/admin/password-reset/confirm/', data),
};

export default adminService;
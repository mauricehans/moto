import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = '/api';

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
  
  confirmPasswordReset: (uidb64: string, token: string, data: { new_password: string; confirm_password: string }): Promise<AxiosResponse<{ message: string }>> => 
    adminApi.post(`/admin/password-reset/${uidb64}/${token}/`, data),
};

export default adminService;
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = (import.meta as any)?.env?.VITE_API_URL || '/api';

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

  requestAdminOTP: (email: string): Promise<AxiosResponse<{ message: string; dev_code?: string }>> => 
    adminApi.post('/admin/otp/request/', { email }),
  
  confirmAdminOTP: (email: string, code: string, new_password: string): Promise<AxiosResponse<{ message: string }>> => 
    adminApi.post('/admin/otp/confirm/', { email, code, new_password }),

  verifyAdminOTP: (email: string, code: string): Promise<AxiosResponse<{ message: string }>> => 
    adminApi.post('/admin/otp/verify/', { email, code }),
  
  confirmPasswordReset: (uidb64: string, token: string, data: { new_password: string; confirm_password: string }): Promise<AxiosResponse<{ message: string }>> => 
    adminApi.post(`/admin/password-reset/${uidb64}/${token}/`, data),
};

export default adminService;

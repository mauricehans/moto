import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const adminService = {
  login: async (password: string) => {
    return api.post('/login/', { password });
  },

  requestPasswordReset: async (email: string) => {
    return api.post('/admin/password-reset/', { email });
  },

  confirmPasswordReset: async (uidb64: string, token: string, new_password: string) => {
    return api.post(`/admin/password-reset/${uidb64}/${token}/`, { new_password, confirm_password: new_password });
  },

  requestAdminOTP: async (email: string) => {
    return api.post('/admin/otp/request/', { email });
  },

  confirmAdminOTP: async (email: string, code: string, new_password: string) => {
    return api.post('/admin/otp/confirm/', { email, code, new_password });
  },
};
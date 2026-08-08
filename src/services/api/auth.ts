import { api } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      phone: string;
      name: string;
      role: string;
      avatar?: string;
    };
  };
}

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  employeeId?: string;
  createdAt: string;
}

export const authApi = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
  logout: () => api.post('/auth/logout', {}),
  getProfile: () => api.get<{ success: boolean; data: UserProfile }>('/auth/me'),
  register: (data: { email: string; phone: string; password: string; name: string; role: string }) =>
    api.post('/auth/register', data),
};

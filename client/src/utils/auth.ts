import Cookies from 'js-cookie';
import api from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string, bio: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { name, email, password, bio });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  logout: () => {
    Cookies.remove('token');
    window.location.href = '/login';
  }
};

export const setAuthToken = (token: string) => {
  Cookies.set('token', token, { expires: 7 });
};

export const getAuthToken = () => {
  return Cookies.get('token');
};
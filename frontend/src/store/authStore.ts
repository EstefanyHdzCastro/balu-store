import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authService.login({ email, password });
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Error al iniciar sesión'
      });
      throw error;
    }
  },

  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authService.register(userData);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Error al registrar usuario'
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null
    });
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    try {
      set({ isLoading: true });
      
      const user = await authService.verifyToken();
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  },

  updateProfile: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      
      const updatedUser = await authService.updateProfile(userData);
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      set({
        user: updatedUser,
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Error al actualizar perfil'
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));

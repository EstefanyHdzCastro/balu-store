import api, { handleApiResponse, handlePaginatedResponse } from './api';
import { User, PaginatedResponse } from '../types';

export const authService = {
  // Registrar usuario
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<{ token: string; user: User }> => {
    const response = await api.post('/auth/register', userData);
    return handleApiResponse(response);
  },

  // Iniciar sesión
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<{ token: string; user: User }> => {
    const response = await api.post('/auth/login', credentials);
    return handleApiResponse(response);
  },

  // Obtener perfil
  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return handleApiResponse(response);
  },

  // Actualizar perfil
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put('/auth/profile', userData);
    return handleApiResponse(response);
  },

  // Cambiar contraseña
  changePassword: async (passwords: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    const response = await api.put('/auth/change-password', passwords);
    handleApiResponse(response);
  },

  // Verificar token
  verifyToken: async (): Promise<User> => {
    const response = await api.get('/auth/verify');
    return handleApiResponse(response);
  },
};

export const adminService = {
  // Dashboard
  getDashboard: async (): Promise<any> => {
    const response = await api.get('/admin/dashboard');
    return handleApiResponse(response);
  },

  // Reporte de ventas
  getSalesReport: async (filters: {
    startDate?: string;
    endDate?: string;
    groupBy?: string;
  } = {}): Promise<any> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    const response = await api.get(`/admin/sales-report?${params.toString()}`);
    return handleApiResponse(response);
  },

  // Gestión de usuarios
  getUsers: async (filters: {
    search?: string;
    role?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  } = {}): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/admin/users?${params.toString()}`);
    return handlePaginatedResponse(response);
  },

  // Actualizar rol de usuario
  updateUserRole: async (userId: string, role: string): Promise<User> => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return handleApiResponse(response);
  },

  // Activar/Desactivar usuario
  updateUserStatus: async (userId: string, isActive: boolean): Promise<User> => {
    const response = await api.put(`/admin/users/${userId}/status`, { isActive });
    return handleApiResponse(response);
  },

  // Crear backup
  createBackup: async (): Promise<any> => {
    const response = await api.post('/admin/backup');
    return handleApiResponse(response);
  },
};

import axios, { AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse } from '../types';

// Configuración base de axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funciones helper para manejar respuestas
export const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Error en la respuesta del servidor');
};

export const handlePaginatedResponse = <T>(
  response: AxiosResponse<PaginatedResponse<T>>
): PaginatedResponse<T> => {
  if (response.data.success) {
    return response.data;
  }
  throw new Error(response.data.message || 'Error en la respuesta del servidor');
};

// Configuración para subida de archivos
export const createFormDataConfig = () => ({
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export default api;

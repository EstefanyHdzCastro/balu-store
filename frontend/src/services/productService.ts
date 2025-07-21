import api, { handleApiResponse, handlePaginatedResponse } from './api';
import { Product, ProductFilters, PaginatedResponse } from '../types';

export const productService = {
  // Obtener todos los productos
  getProducts: async (filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/products?${params.toString()}`);
    return handlePaginatedResponse(response);
  },

  // Obtener producto por ID
  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return handleApiResponse(response);
  },

  // Obtener productos destacados
  getFeaturedProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products/featured/list');
    return handleApiResponse(response);
  },

  // Obtener muestras de productos
  getSampleProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products/samples/list');
    return handleApiResponse(response);
  },

  // Crear producto (Admin)
  createProduct: async (productData: FormData): Promise<Product> => {
    const response = await api.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return handleApiResponse(response);
  },

  // Actualizar producto (Admin)
  updateProduct: async (id: string, productData: FormData): Promise<Product> => {
    const response = await api.put(`/products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return handleApiResponse(response);
  },

  // Eliminar producto (Admin)
  deleteProduct: async (id: string): Promise<void> => {
    const response = await api.delete(`/products/${id}`);
    handleApiResponse(response);
  },
};

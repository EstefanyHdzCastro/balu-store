import api, { handleApiResponse, handlePaginatedResponse } from './api';
import { Order, OrderFilters, CustomOrderForm, PaginatedResponse } from '../types';

export const orderService = {
  // Crear nueva orden
  createOrder: async (orderData: CustomOrderForm): Promise<Order> => {
    const response = await api.post('/orders', orderData);
    return handleApiResponse(response);
  },

  // Obtener orden por número
  getOrder: async (orderNumber: string): Promise<Order> => {
    const response = await api.get(`/orders/${orderNumber}`);
    return handleApiResponse(response);
  },

  // Obtener todas las órdenes (Admin)
  getOrders: async (filters: OrderFilters = {}): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/orders?${params.toString()}`);
    return handlePaginatedResponse(response);
  },

  // Actualizar estado de orden (Admin)
  updateOrderStatus: async (id: string, status: string, note?: string): Promise<Order> => {
    const response = await api.put(`/orders/${id}/status`, { status, note });
    return handleApiResponse(response);
  },

  // Actualizar información de envío (Admin)
  updateShipping: async (
    id: string, 
    data: { trackingNumber?: string; estimatedDelivery?: string }
  ): Promise<Order> => {
    const response = await api.put(`/orders/${id}/shipping`, data);
    return handleApiResponse(response);
  },

  // Cancelar orden (Admin)
  cancelOrder: async (id: string, reason?: string): Promise<Order> => {
    const response = await api.put(`/orders/${id}/cancel`, { reason });
    return handleApiResponse(response);
  },
};

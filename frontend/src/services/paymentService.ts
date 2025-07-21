import api, { handleApiResponse } from './api';
import { StripePaymentIntent } from '../types';

export const paymentService = {
  // Crear Payment Intent de Stripe
  createPaymentIntent: async (orderNumber: string, amount: number): Promise<StripePaymentIntent> => {
    const response = await api.post('/payments/create-intent', {
      orderNumber,
      amount
    });
    return handleApiResponse(response);
  },

  // Confirmar pago exitoso
  confirmPayment: async (paymentIntentId: string): Promise<any> => {
    const response = await api.post('/payments/confirm', {
      paymentIntentId
    });
    return handleApiResponse(response);
  },

  // Obtener detalles de pago
  getPaymentDetails: async (orderNumber: string): Promise<any> => {
    const response = await api.get(`/payments/details/${orderNumber}`);
    return handleApiResponse(response);
  },

  // Procesar reembolso (Admin)
  processRefund: async (orderNumber: string, amount?: number, reason?: string): Promise<any> => {
    const response = await api.post('/payments/refund', {
      orderNumber,
      amount,
      reason
    });
    return handleApiResponse(response);
  },
};

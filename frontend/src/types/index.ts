// Tipos para productos
export interface Product {
  _id: string;
  name: string;
  description: string;
  category: 'muestra' | 'personalizado' | 'popular';
  basePrice: number;
  images: ProductImage[];
  materials: Material[];
  sizes: Size[];
  customizationOptions: CustomizationOption[];
  isActive: boolean;
  isSample: boolean;
  stock: number;
  featured: boolean;
  tags: string[];
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    slug?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  url: string;
  alt: string;
}

export interface Material {
  name: string;
  additionalCost: number;
}

export interface Size {
  name: string;
  additionalCost: number;
}

export interface CustomizationOption {
  name: string;
  type: 'text' | 'color' | 'image' | 'select' | 'number';
  required: boolean;
  options?: string[];
  additionalCost: number;
}

// Tipos para órdenes
export interface Order {
  _id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  shipping: Shipping;
  taxes: number;
  discount: Discount;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentDetails: PaymentDetails;
  estimatedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
  timeline: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  basePrice: number;
  customizations: Customization[];
  selectedMaterial?: Material;
  selectedSize?: Size;
  itemTotal: number;
  specialInstructions?: string;
}

export interface Customization {
  optionName: string;
  value: string;
  additionalCost: number;
}

export interface Shipping {
  cost: number;
  method: 'standard' | 'express' | 'pickup';
  trackingNumber?: string;
}

export interface Discount {
  amount: number;
  code?: string;
  reason?: string;
}

export interface PaymentDetails {
  transactionId?: string;
  paymentIntentId?: string;
  last4?: string;
  brand?: string;
}

export interface OrderTimeline {
  status: string;
  date: string;
  note?: string;
  updatedBy?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_production' 
  | 'completed' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

export type PaymentMethod = 
  | 'stripe' 
  | 'paypal' 
  | 'transfer' 
  | 'cash';

// Tipos para usuarios
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: Address;
  preferences: UserPreferences;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
  };
  newsletter: boolean;
}

// Tipos para API responses
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: ValidationError[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  count: number;
  total: number;
  page: number;
  pages: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Tipos para formularios
export interface CustomOrderForm {
  customer: CustomerForm;
  items: OrderItemForm[];
  shipping: ShippingForm;
  notes?: string;
}

export interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  address: AddressForm;
}

export interface AddressForm {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItemForm {
  productId: string;
  quantity: number;
  customizations: { [key: string]: string };
  selectedMaterial?: string;
  selectedSize?: string;
  specialInstructions?: string;
}

export interface ShippingForm {
  method: 'standard' | 'express' | 'pickup';
}

// Tipos para carrito de compras
export interface CartItem {
  product: Product;
  quantity: number;
  customizations: { [key: string]: string };
  selectedMaterial?: Material;
  selectedSize?: Size;
  specialInstructions?: string;
  itemTotal: number;
}

// Tipos para Stripe
export interface StripePaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

// Tipos para filtros y búsqueda
export interface ProductFilters {
  category?: string;
  search?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  page?: number;
  limit?: number;
}

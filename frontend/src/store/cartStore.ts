import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotal: () => number;
  getItemsCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  isOpen: false,

  addItem: (newItem: CartItem) => {
    const { items } = get();
    const existingItemIndex = items.findIndex(
      item => item.product._id === newItem.product._id &&
      JSON.stringify(item.customizations) === JSON.stringify(newItem.customizations) &&
      item.selectedMaterial?.name === newItem.selectedMaterial?.name &&
      item.selectedSize?.name === newItem.selectedSize?.name
    );

    let updatedItems;
    if (existingItemIndex >= 0) {
      updatedItems = items.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + newItem.quantity }
          : item
      );
    } else {
      updatedItems = [...items, newItem];
    }

    localStorage.setItem('cart', JSON.stringify(updatedItems));
    set({ items: updatedItems });
  },

  removeItem: (productId: string) => {
    const { items } = get();
    const updatedItems = items.filter(item => item.product._id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    set({ items: updatedItems });
  },

  updateQuantity: (productId: string, quantity: number) => {
    const { items } = get();
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    const updatedItems = items.map(item =>
      item.product._id === productId
        ? { ...item, quantity }
        : item
    );

    localStorage.setItem('cart', JSON.stringify(updatedItems));
    set({ items: updatedItems });
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [] });
  },

  toggleCart: () => set(state => ({ isOpen: !state.isOpen })),

  getTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.itemTotal * item.quantity, 0);
  },

  getItemsCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + item.quantity, 0);
  }
}));

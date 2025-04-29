import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  cart_item_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  toggleCart: () => void;
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, 'quantity' | 'cart_item_id'>, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, newQuantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Only fetch cart if user is authenticated
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Clear cart items when user is not authenticated
      setCartItems([]);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart/');
      if (response.data && Array.isArray(response.data)) {
        const updatedItems = response.data
          .filter((cartItem: any) => Boolean(cartItem?.item?.item_id && cartItem?.item?.title && cartItem?.quantity))
          .map((apiItem: any) => ({
            id: apiItem.item.item_id.toString(),
            cart_item_id: apiItem.cart_item_id.toString(),
            name: apiItem.item.title,
            price: apiItem.item.price,
            quantity: apiItem.quantity,
            image: apiItem.item.image,
          }));
        setCartItems(updatedItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (item: Omit<CartItem, 'quantity' | 'cart_item_id'>, quantity: number = 1) => {
    if (!isAuthenticated) {
      throw new Error('Please login to add items to cart');
    }

    setIsLoading(true);
    try {
      await api.post('/cart/', {
        item_id: item.id,
        quantity: quantity
      });
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      await api.delete(`/cart/${cartItemId}/`);
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      await api.patch(`/cart/${cartItemId}/`, {
        quantity: newQuantity
      });
      
      // Update the cart item locally first
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.cart_item_id === cartItemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

      // Then fetch the updated cart in the background
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Refresh the cart if there was an error
      fetchCart();
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      await api.delete('/cart/');
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        toggleCart,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
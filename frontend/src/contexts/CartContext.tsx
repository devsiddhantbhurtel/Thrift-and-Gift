import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export type CartItem = {
  id: string;
  cart_item_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type CartContextType = {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  addToCart: (item: Omit<CartItem, 'quantity' | 'cart_item_id'>, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, newQuantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isCartOpen: boolean;
  toggleCart: () => void;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cart items on mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await api.get('cart/');
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
      console.error('Error fetching cart items:', error);
    }
  };

  const addToCart = async (item: Omit<CartItem, 'quantity' | 'cart_item_id'>, quantity: number = 1) => {
    setIsLoading(true);
    try {
      await api.post('cart/', {
        item_id: item.id,
        quantity: quantity
      });
      await fetchCartItems();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    setIsLoading(true);
    try {
      await api.delete(`cart/${cartItemId}/`);
      await fetchCartItems();
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
    setIsLoading(true);
    try {
      await api.patch(`cart/${cartItemId}/`, {
        quantity: newQuantity
      });
      await fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      await api.post('cart/clear/');
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
        setCartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        toggleCart,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 
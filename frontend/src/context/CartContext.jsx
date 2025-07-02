// context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserCart, addToCart as addToCartService, updateCartItem, removeFromCart } from '../services/CartService';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  // Replace with actual user ID from your authentication system
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const decoded = jwtDecode(token);
      return decoded.id || decoded._id;
    } catch {
      return null;
    }
  };

  const userId = getUserIdFromToken();
  // Fetch cart on mount
  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getUserCart(userId);
      setCart(response.cart);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // Don't show error toast for empty cart
      if (!error.message.includes('Cart not found')) {
        toast.error('Failed to load cart');
      }
    } finally {
      setLoading(false);
    }
  };

const addToCart = async (productId, size, color, quantity = 1) => {
  try {
    setLoading(true);
    const response = await addToCartService(userId, productId, size, color, quantity);
    setCart(response.cart); // ✅ use updated cart
    toast.success('Added to cart successfully!');
    return response;
  } catch (error) {
    toast.error(error.message || 'Failed to add to cart');
    throw error;
  } finally {
    setLoading(false);
  }
};




const updateCart = async (productId, newQuantity, size, color) => {
  try {
    setLoading(true);
    const response = await updateCartItem(userId, productId, newQuantity, size, color);
    setCart(response.cart);
    toast.success('Cart updated successfully!');
    return response;
  } catch (error) {
    toast.error(error.message || 'Failed to update cart');
    throw error;
  } finally {
    setLoading(false);
  }
};



const removeItem = async (productId, size, color) => {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const userId = decoded.id;

  if (!userId || !productId || !size || !color) {
    toast.error("Missing item details");
    throw new Error("userId, productId, newSize, and newColor are required");
  }

  try {
    await removeFromCart(userId, productId, size, color);
    toast.success("Item removed from cart");
    fetchCart(); // Refresh cart
  } catch (error) {
    console.error("Error removing from cart:", error);
    toast.error("Failed to remove from cart");
    throw error;
  }
};




  const getCartItemCount = () => {
    return cart?.totalItems || 0;
  };

  const getCartTotal = () => {
    return cart?.totalPrice || 0;
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCart,
    removeItem,
    fetchCart,
    getCartItemCount,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
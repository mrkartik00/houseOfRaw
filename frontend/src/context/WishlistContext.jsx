import React, { createContext, useContext, useState, useEffect } from 'react';
import { toggleWishlist as apiToggleWishlist, fetchWishlist } from '../services/authService';
import { toast } from 'sonner';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist from backend
  const loadWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setWishlistItems([]);
        return;
      }

      setLoading(true);
      const wishlistData = await fetchWishlist();
      if (wishlistData?.success && wishlistData?.wishlist) {
        setWishlistItems(wishlistData.wishlist);
      }
    } catch (error) {
      console.warn('Failed to fetch wishlist:', error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle wishlist item
  const toggleWishlistItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please login to use wishlist.");
        return false;
      }

      const wasInWishlist = isInWishlist(productId);
      
      // Optimistically update UI
      setWishlistItems(prev => {
        if (wasInWishlist) {
          return prev.filter(item => {
            const itemId = typeof item === 'string' ? item : item._id;
            return itemId !== productId;
          });
        } else {
          return [...prev, productId];
        }
      });

      // Make API call
      const res = await apiToggleWishlist(productId);
      
      // Trigger navbar update
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      
      toast.success(res.message || (wasInWishlist ? "Removed from wishlist" : "Added to wishlist"));
      
      // Reload to ensure sync with backend
      await loadWishlist();
      
      return true;
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error("Please login to use wishlist.");
      
      // Revert optimistic update on error
      await loadWishlist();
      return false;
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => {
      const itemId = typeof item === 'string' ? item : item._id;
      return itemId === productId;
    });
  };

  // Get wishlist count
  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  // Load wishlist on mount and when auth state changes
  useEffect(() => {
    loadWishlist();
  }, []);

  // Listen for auth changes
  useEffect(() => {
    const handleStorageChange = () => {
      loadWishlist();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value = {
    wishlistItems,
    loading,
    toggleWishlistItem,
    isInWishlist,
    getWishlistCount,
    loadWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

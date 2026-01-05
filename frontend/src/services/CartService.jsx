// services/cartService.js
const API_BASE_URL = 'http://localhost:7000/api/cart';

// Add product to cart
export const addToCart = async (userId, productId, size, color, quantity) => {
  try {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        productId,
        size,
        color,
        quantity
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add to cart');
    }
    
    return data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// Get user's cart
export const getUserCart = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch cart');
    }
    
    // Return the actual data, not wrapped in another object
    return data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

// Update cart item
export const updateCartItem = async (userId, productId, newQuantity, newSize, newColor) => {
  if (!userId || !productId || !newSize || !newColor) {
    throw new Error("userId, productId, newSize, and newColor are required");
  }

  const response = await fetch(`${API_BASE_URL}/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, productId, newQuantity, newSize, newColor }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update cart');
  }

  return data;
};


// Remove item from cart (set quantity to 0)
export const removeFromCart = async (userId, productId, size, color) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        productId,
        newQuantity: 0,   // ✅ required for removal
        newSize: size,    // ✅ required
        newColor: color   // ✅ required
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to remove from cart');
    return data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

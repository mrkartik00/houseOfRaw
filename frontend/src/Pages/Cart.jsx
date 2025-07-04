// pages/Cart.js
import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, loading, updateCart, removeItem, fetchCart, getCartTotal } = useCart();
  const [updatingItems, setUpdatingItems] = useState({});

  useEffect(() => {
    fetchCart();
  }, []);

  const navigate = useNavigate();
  const handleCheckOut = () => {
    navigate("/Checkout");
  }


  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) return;

    const productId = item.product?._id || item.product; // fallback to item.product if it's just an ID
    const size = item.variant?.size;
    const color = item.variant?.color;

    const itemKey = `${productId}-${size}-${color}`;
    setUpdatingItems(prev => ({ ...prev, [itemKey]: true }));

    console.log("handleQuantityChange called with:", {
      productId,
      size,
      color,
      quantity: newQuantity,
    });

    try {
      await updateCart(productId, newQuantity, size, color);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemKey]: false }));
    }
  };



  const handleRemoveItem = async (item) => {
    const productId = item.product?._id || item.product;
    const size = item.variant?.size;
    const color = item.variant?.color;

    try {
      await removeItem(productId, size, color);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item");
    }
  };



  if (loading && !cart) {
    return (
      <div className="min-h-screen bg-[#c9c9bf4d] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#c9c9bf4d] flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <Link
            to="/shops/all"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#c9c9bf4d] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {cart.items.map((item, index) => {
                const itemKey = `${item.product._id}-${item.variant.size}-${item.variant.color}`;
                const isUpdating = updatingItems[itemKey];

                return (
                  <div key={`${item.product._id}-${item.variant.size}-${item.variant.color}`}
                    className={`p-6 ${index !== cart.items.length - 1 ? 'border-b' : ''} ${isUpdating ? 'opacity-50' : ''}`}>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="w-full sm:w-24 h-48 sm:h-24 flex-shrink-0">
                        <img
                          src={
                            item.product && typeof item.product === "object" && item.product.image
                              ? item.product.image[0]
                              : "/placeholder-image.jpg"
                          }
                          alt={item.product?.name || "Product Image"}
                          className="w-full h-full object-cover rounded-lg"
                        />

                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <Link
                            to={`/product/${item.product._id}`}
                            className="text-lg font-semibold hover:text-blue-600 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => handleRemoveItem(item)}
                            disabled={isUpdating}
                            className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50"
                            title="Remove item"
                          >
                            <FaTrash />
                          </button>
                        </div>

                        <div className="text-gray-600 mb-4">
                          <p>Size: <span className="font-medium">{item.variant.size}</span></p>
                          <p>Color: <span className="font-medium">{item.variant.color}</span></p>
                          <p className="text-lg font-semibold text-black">₹{item.price}</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isUpdating}
                              className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FaMinus size={12} />
                            </button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity + 1)}
                              disabled={isUpdating}
                              className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FaPlus size={12} />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-semibold">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Items ({cart.totalItems})</span>
                  <span>₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button onClick ={handleCheckOut} 
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                Proceed to Checkout
              </button>

              <Link
                to="/shops/all"
                className="block text-center text-blue-600 hover:text-blue-800 mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
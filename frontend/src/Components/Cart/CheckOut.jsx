import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserCart } from "../../services/CartService";

const CheckOut = () => {
  const navigate = useNavigate();
  const [ShippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",             // ✅ Added state
    pincode: "",
    country: "",
    phone: "",
  });
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      return payload.userId || payload.id || payload.sub || payload.user?._id || payload.user?.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }
      try {
        const response = await getUserCart(userId);
        if (response?.success && response.cart) {
          setCart(response.cart);
        } else {
          setError("Failed to load cart data");
        }
      } catch (err) {
        setError(`Failed to load cart: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [userId]);

  const handlePayment = (e) => {
    e.preventDefault();

    const { firstName, lastName, address, city, state, pincode, country, phone } = ShippingAddress;

    if (!firstName || !lastName || !address || !city || !state || !pincode || !country || !phone) {
      alert("Please fill out all the shipping address fields.");
      return;
    }

    const shipping = {
      street: address,
      city,
      state,       // ✅ now present
      pincode,
      country,
    };

    const checkoutInfo = { shippingAddress: shipping };
    localStorage.setItem("checkoutInfo", JSON.stringify(checkoutInfo));
    navigate("/payments");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto py-12 px-4 lg:px-8">
      {/* Checkout Form */}
      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-semibold mb-6 border-b pb-2">Checkout</h2>
        <form className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" value={ShippingAddress.firstName}
              onChange={(e) => setShippingAddress({ ...ShippingAddress, firstName: e.target.value })} className="px-4 py-2 border rounded-md" required />
            <input type="text" placeholder="Last Name" value={ShippingAddress.lastName}
              onChange={(e) => setShippingAddress({ ...ShippingAddress, lastName: e.target.value })} className="px-4 py-2 border rounded-md" required />
          </div>
          <input type="text" placeholder="Street Address" value={ShippingAddress.address}
            onChange={(e) => setShippingAddress({ ...ShippingAddress, address: e.target.value })} className="w-full px-4 py-2 border rounded-md" required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="City" value={ShippingAddress.city}
              onChange={(e) => setShippingAddress({ ...ShippingAddress, city: e.target.value })} className="px-4 py-2 border rounded-md" required />
            <input type="text" placeholder="State" value={ShippingAddress.state}
              onChange={(e) => setShippingAddress({ ...ShippingAddress, state: e.target.value })} className="px-4 py-2 border rounded-md" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Pincode" value={ShippingAddress.pincode}
              onChange={(e) => setShippingAddress({ ...ShippingAddress, pincode: e.target.value })} className="px-4 py-2 border rounded-md" required />
            <input type="text" placeholder="Country" value={ShippingAddress.country}
              onChange={(e) => setShippingAddress({ ...ShippingAddress, country: e.target.value })} className="px-4 py-2 border rounded-md" required />
          </div>
          <input type="text" placeholder="Phone Number" value={ShippingAddress.phone}
            onChange={(e) => setShippingAddress({ ...ShippingAddress, phone: e.target.value })} className="w-full px-4 py-2 border rounded-md" required />

          <button onClick={handlePayment} type="submit"
            className="w-full mt-6 bg-black text-white text-lg py-3 rounded-md hover:bg-gray-900 transition">
            Continue to Payment
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow-md rounded-lg p-8">
        <h3 className="text-2xl font-semibold mb-6 border-b pb-2">Order Summary</h3>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <span className="ml-2">Loading cart...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : cart && cart.items.length > 0 ? (
          <>
            <div className="space-y-4">
              {cart.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-4 border-b pb-4">
                  <div className="flex items-start gap-4">
                    <img src={item.product.image?.[0] || '/placeholder-image.png'} alt={item.product.name}
                      className="w-20 h-24 object-cover rounded-md" />
                    <div>
                      <h4 className="text-md font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-500">Size: {item.variant.size}</p>
                      <p className="text-sm text-gray-500">Color: {item.variant.color}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2 text-lg">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cart.totalPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between border-t pt-4 font-semibold text-xl">
                <span>Total</span>
                <span>${cart.totalPrice?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckOut;

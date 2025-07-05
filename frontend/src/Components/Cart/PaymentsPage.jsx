import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../../services/orderServices";
import { getUserCart } from "../../services/CartService";
import { toast } from "sonner";
import Confetti from "react-confetti";

const PaymentsPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(null);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId || payload.id || payload.sub || payload.user?._id || payload.user?.id;
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  };

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getUserCart(userId);
        setCart(res?.cart || res?.data?.cart || null);
      } catch (error) {
        console.error("Failed to load cart:", error);
        toast.error("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    };

    // Load shipping address from checkout info
    const checkoutInfo = JSON.parse(localStorage.getItem("checkoutInfo") || "{}");
    if (checkoutInfo.selectedAddress) {
      setShippingAddress(checkoutInfo.selectedAddress);
    }

    if (userId) fetchCart();
  }, [userId]);

  const handlePlaceOrder = async () => {
    const checkoutInfo = JSON.parse(localStorage.getItem("checkoutInfo"));
    if (!checkoutInfo?.selectedAddress) {
      toast.error("Missing shipping details");
      return;
    }

    setPlacingOrder(true);

    try {
      const response = await placeOrder({
        shippingAddress: checkoutInfo.selectedAddress,
        paymentMethod,
      });

      if (response.success) {
        toast.success("🎉 Order placed successfully!");
        setShowConfetti(true);
        localStorage.setItem("latestOrder", JSON.stringify(response.order));
        // Optional: clear cart from localStorage
        localStorage.removeItem("checkoutInfo");

        setTimeout(() => {
          navigate("/order-confirmation");
        }, 3000); // 3s for confetti effect
      } else {
        toast.error(response.message || "Failed to place order");
      }
    } catch (err) {
      toast.error("Order failed");
      console.error(err);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}

      {/* Payment Method Section */}
      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Select Payment Method</h2>
        <form className="space-y-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="payment"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
              className="mr-2"
            />
            Cash on Delivery (COD)
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="payment"
              value="RAZORPAY"
              checked={paymentMethod === "RAZORPAY"}
              onChange={() => setPaymentMethod("RAZORPAY")}
              className="mr-2"
            />
            Pay with Razorpay
          </label>
        </form>

        <button
          onClick={handlePlaceOrder}
          disabled={placingOrder}
          className={`w-full mt-8 text-white text-lg py-3 rounded-md transition ${
            placingOrder ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-900"
          }`}
        >
          {placingOrder ? "Placing Order..." : "Place Order"}
        </button>

        {/* Shipping Address Display */}
        {shippingAddress && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Shipping Address:</h4>
            <div className="text-sm text-gray-600">
              <p className="font-medium">{shippingAddress.fullName}</p>
              <p>{shippingAddress.street}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
              <p>{shippingAddress.country}</p>
              <p>Phone: {shippingAddress.mobile}</p>
            </div>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow-md rounded-lg p-8">
        <h3 className="text-2xl font-semibold mb-6 border-b pb-2">Order Summary</h3>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-black border-b-transparent rounded-full" />
            <span className="ml-3">Loading cart...</span>
          </div>
        ) : cart && cart.items?.length > 0 ? (
          <>
            {cart.items.map((item, index) => (
              <div key={index} className="flex justify-between gap-4 border-b pb-4">
                <div className="flex gap-4">
                  <img
                    src={item.product.image?.[0] || '/placeholder.png'}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-gray-500">Size: {item.variant.size} | Color: {item.variant.color}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-lg font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="mt-6 space-y-2 text-lg">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cart.totalPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between border-t pt-4 font-semibold text-xl">
                <span>Total</span>
                <span>₹{cart.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">Your cart is empty</div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../../services/orderServices";
import { getUserCart } from "../../services/CartService";
import { toast } from "sonner";
import Confetti from "react-confetti";
import { initiateRazorpayPayment, formatPaymentAmount } from "../../utils/razorpayUtils";
import { CreditCard, Truck, Shield, CheckCircle } from "lucide-react";

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

    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setPlacingOrder(true);

    try {
      const orderData = {
        userId,
        orderItems: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price,
          variant: item.variant
        })),
        shippingAddress: checkoutInfo.selectedAddress,
        totalAmount: cart.totalPrice,
        paymentMethod
      };

      if (paymentMethod === "RAZORPAY") {
        // Handle Razorpay payment
        await initiateRazorpayPayment({
          orderData,
          userInfo: {
            name: checkoutInfo.selectedAddress.fullName,
            email: "", // Add user email if available
            mobile: checkoutInfo.selectedAddress.mobile
          },
          onSuccess: (verificationResponse, razorpayResponse) => {
            setPlacingOrder(false);
            setShowConfetti(true);
            
            // Clear checkout info and cart data
            localStorage.removeItem("checkoutInfo");
            localStorage.setItem("latestOrder", JSON.stringify({
              orderId: verificationResponse.orderId,
              paymentId: razorpayResponse.razorpay_payment_id,
              amount: cart.totalPrice
            }));
            
            toast.success("Order placed successfully! 🎉");
            
            setTimeout(() => {
              navigate("/order-confirmation");
            }, 3000);
          },
          onFailure: (error) => {
            setPlacingOrder(false);
            toast.error("Payment failed. Please try again.");
            console.error("Payment failed:", error);
          },
          onClose: () => {
            setPlacingOrder(false);
            toast.info("Payment cancelled");
          }
        });
      } else {
        // Handle COD payment (existing logic)
        const response = await placeOrder({
          shippingAddress: checkoutInfo.selectedAddress,
          paymentMethod,
        });

        if (response.success) {
          toast.success("🎉 Order placed successfully!");
          setShowConfetti(true);
          localStorage.setItem("latestOrder", JSON.stringify(response.order));
          localStorage.removeItem("checkoutInfo");

          setTimeout(() => {
            navigate("/order-confirmation");
          }, 3000);
        } else {
          toast.error(response.message || "Failed to place order");
        }
      }
    } catch (err) {
      toast.error("Order failed");
      console.error(err);
    } finally {
      if (paymentMethod === "COD") {
        setPlacingOrder(false);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}

      {/* Payment Method Section */}
      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Select Payment Method</h2>
        
        {/* Payment Options */}
        <div className="space-y-4">
          {/* Razorpay Option */}
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              paymentMethod === "RAZORPAY" 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setPaymentMethod("RAZORPAY")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="payment"
                  value="RAZORPAY"
                  checked={paymentMethod === "RAZORPAY"}
                  onChange={() => setPaymentMethod("RAZORPAY")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <CreditCard className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Pay with Razorpay</p>
                  <p className="text-sm text-gray-500">Credit/Debit Card, UPI, Net Banking</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600 font-medium">Secure</span>
              </div>
            </div>
            {paymentMethod === "RAZORPAY" && (
              <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Instant Payment Processing</p>
                    <p className="text-blue-600">Pay securely with your preferred method</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* COD Option */}
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              paymentMethod === "COD" 
                ? "border-orange-500 bg-orange-50" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setPaymentMethod("COD")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="text-orange-600 focus:ring-orange-500"
                />
                <Truck className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-900">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">Pay when your order arrives</p>
                </div>
              </div>
            </div>
            {paymentMethod === "COD" && (
              <div className="mt-3 p-3 bg-orange-50 rounded border-l-4 border-orange-400">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div className="text-sm text-orange-800">
                    <p className="font-medium">Pay on Delivery</p>
                    <p className="text-orange-600">Cash payment at your doorstep</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={placingOrder}
          className={`w-full mt-8 text-white text-lg py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
            placingOrder 
              ? "bg-gray-500 cursor-not-allowed" 
              : paymentMethod === "RAZORPAY"
                ? "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
                : "bg-black hover:bg-gray-900 shadow-lg hover:shadow-xl"
          }`}
        >
          {placingOrder ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>
                {paymentMethod === "RAZORPAY" ? "Processing Payment..." : "Placing Order..."}
              </span>
            </>
          ) : (
            <>
              {paymentMethod === "RAZORPAY" ? (
                <>
                  <CreditCard className="h-5 w-5" />
                  <span>Pay {formatPaymentAmount(cart?.totalPrice || 0)}</span>
                </>
              ) : (
                <>
                  <Truck className="h-5 w-5" />
                  <span>Place Order - COD</span>
                </>
              )}
            </>
          )}
        </button>

        {/* Payment Security Info */}
        {paymentMethod === "RAZORPAY" && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Your payment information is secure and encrypted</span>
            </div>
          </div>
        )}

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

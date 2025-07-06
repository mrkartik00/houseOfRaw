import React, { useState } from 'react';
import { initiateRazorpayPayment } from '../utils/razorpayUtils';
import { toast } from 'sonner';

const RazorpayTest = () => {
  const [loading, setLoading] = useState(false);

  const testPayment = async () => {
    setLoading(true);
    
    const testOrderData = {
      userId: "test-user-id",
      orderItems: [
        {
          product: "test-product-id",
          quantity: 1,
          price: 100,
          variant: { size: "M", color: "Black" }
        }
      ],
      shippingAddress: {
        fullName: "Test User",
        street: "123 Test Street",
        city: "Test City",
        state: "Test State",
        pincode: "123456",
        country: "India",
        mobile: "9876543210"
      },
      totalAmount: 100,
      paymentMethod: "RAZORPAY"
    };

    try {
      await initiateRazorpayPayment({
        orderData: testOrderData,
        userInfo: {
          name: "Test User",
          email: "test@example.com",
          mobile: "9876543210"
        },
        onSuccess: (verificationResponse, razorpayResponse) => {
          console.log("Payment Success:", { verificationResponse, razorpayResponse });
          toast.success("Test payment successful!");
          setLoading(false);
        },
        onFailure: (error) => {
          console.error("Payment Failed:", error);
          toast.error("Test payment failed!");
          setLoading(false);
        },
        onClose: () => {
          console.log("Payment modal closed");
          toast.info("Payment cancelled");
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Failed to initiate payment");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Razorpay Test</h2>
      <p className="text-gray-600 mb-6 text-center">
        Click the button below to test Razorpay payment integration
      </p>
      
      <button
        onClick={testPayment}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Processing...' : 'Test Payment (₹100)'}
      </button>
      
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This is a test payment. Use test cards for testing.
        </p>
      </div>
    </div>
  );
};

export default RazorpayTest;

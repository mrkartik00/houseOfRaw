import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, CreditCard, Truck, Clock } from 'lucide-react';
import { formatPaymentAmount } from '../../utils/razorpayUtils';

const OrderConfirmationPage = () => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const storedOrder = localStorage.getItem("latestOrder");
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
    }
  }, []);

  const calculatedEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-600">No order found</h2>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-green-100">Thank you for your purchase. Your order has been received.</p>
        </div>

        <div className="p-8">
          {/* Order Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Order Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Order Details</h3>
              </div>
              <p className="text-sm text-gray-600">
                Order ID: <span className="font-medium text-gray-800">
                  #{order.orderId?.slice(-8)?.toUpperCase() || order._id?.slice(-8)?.toUpperCase()}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Date: {new Date().toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Status: <span className="font-medium text-green-600">Confirmed</span>
              </p>
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Payment</h3>
              </div>
              <p className="text-sm text-gray-600">
                Method: <span className="font-medium text-gray-800">
                  {order.paymentId ? "Online Payment" : "Cash on Delivery"}
                </span>
              </p>
              {order.paymentId && (
                <p className="text-sm text-gray-600">
                  Payment ID: <span className="font-medium text-gray-800">{order.paymentId}</span>
                </p>
              )}
              <p className="text-sm text-gray-600">
                Amount: <span className="font-medium text-green-600">
                  {formatPaymentAmount(order.amount)}
                </span>
              </p>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Truck className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Delivery</h3>
              </div>
              <p className="text-sm text-gray-600">
                Estimated: <span className="font-medium text-gray-800">
                  {calculatedEstimatedDelivery(new Date())}
                </span>
              </p>
              <p className="text-sm text-gray-600">Method: Standard Delivery</p>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">What happens next?</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• You'll receive an order confirmation email shortly</li>
                  <li>• We'll notify you when your order is being prepared</li>
                  <li>• Track your order status in your account</li>
                  <li>• Estimated delivery: {calculatedEstimatedDelivery(new Date())}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Order Total: {formatPaymentAmount(order.amount)}
            </h3>
            <div className="text-sm text-green-700">
              {order.paymentId ? (
                <p>✅ Payment completed successfully</p>
              ) : (
                <p>💰 Payment on delivery - Have exact change ready</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/profile/orders'}
              className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Track Your Order
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;

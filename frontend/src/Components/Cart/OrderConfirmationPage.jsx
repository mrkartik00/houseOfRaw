import React, { useEffect, useState } from 'react';

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
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-emerald-700 mb-10">
          🎉 Thank You for Your Order!
        </h1>

        {/* Order Summary */}
        <div className="flex justify-between flex-wrap mb-8 border-b pb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Order ID: <span className="text-gray-600">{order._id}</span>
            </h2>
            <p className="text-sm text-gray-500">
              Order Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-2 sm:mt-0 text-sm text-gray-700">
            <span className="font-semibold text-emerald-700">Estimated Delivery:</span>{' '}
            {calculatedEstimatedDelivery(order.createdAt)}
          </div>
        </div>

        {/* Product Items */}
        <div className="space-y-6 mb-10">
          {order.orderItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 border-b pb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product?.image?.[0] || "/placeholder.png"}
                  alt={item.product?.name}
                  className="w-20 h-20 object-cover rounded-md border"
                />
                <div>
                  <h4 className="text-md font-semibold text-gray-800">{item.product?.name}</h4>
                  <p className="text-sm text-gray-500 capitalize">
                    {item.variant?.color} | Size: {item.variant?.size}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-md font-medium text-gray-800">
                  ₹{item.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment & Delivery Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold mb-2 text-gray-800">Payment Method</h4>
            <p>{order.paymentMethod === "COD" ? "Cash on Delivery (COD)" : order.paymentMethod}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold mb-2 text-gray-800">Shipping Address</h4>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
            <p>{order.shippingAddress.pincode}, {order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Call-to-action */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm mb-4">
            You'll receive a confirmation email with your order details shortly.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;

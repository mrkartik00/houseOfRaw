import React, { useEffect, useState } from "react";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "../../services/orderServices";
import { toast } from "sonner";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchAllOrders();
        setOrders(data);
      } catch (error) {
        toast.error("Failed to fetch orders", error.message);
      }
    };

    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated");

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (error) {
      toast.error("Failed to update status", error.message);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Payment Status</th>
              <th className="py-3 px-4">Order Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className="border-b hover:bg-gray-100 cursor-pointer" onClick={() => toggleOrderDetails(order._id)}>
                    <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex items-center">
                        <button className="mr-2 text-gray-400 hover:text-gray-600">
                          {expandedOrder === order._id ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </button>
                        #{order._id.slice(-8).toUpperCase()}
                      </div>
                    </td>
                    <td className="p-4 font-medium">{order.user?.name || "Unknown"}</td>
                    <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-semibold">₹{order.totalAmount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.isPaid 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        className="p-2 border rounded text-sm"
                        value={order.orderStatus}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(order._id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(order._id, "Delivered");
                        }}
                        disabled={order.orderStatus === "Delivered"}
                        className={`px-3 py-1 rounded text-sm transition-all duration-200 ${
                          order.orderStatus === "Delivered"
                            ? "bg-green-400 text-white cursor-not-allowed"
                            : "bg-green-700 text-white hover:bg-blue-600 hover:shadow-lg transform hover:scale-105"
                        }`}
                      >
                        {order.orderStatus === "Delivered" ? "Already Delivered" : "Mark Delivered"}
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order._id && (
                    <tr className="border-b bg-gray-50">
                      <td colSpan={7} className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Order Details */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-800">Order Details</h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-medium">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                              <p><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
                              <p><span className="font-medium">Payment Status:</span> 
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                  {order.isPaid ? 'Paid' : 'Unpaid'}
                                </span>
                              </p>
                              {order.trackingNumber && (
                                <p><span className="font-medium">Tracking Number:</span> {order.trackingNumber}</p>
                              )}
                            </div>
                            
                            {/* Shipping Address */}
                            <div>
                              <h5 className="font-semibold text-gray-700 mb-2">Shipping Address</h5>
                              <div className="text-sm text-gray-600 bg-white p-3 rounded border">
                                <p className="font-medium">{order.user?.name}</p>
                                {order.user?.email && <p className="text-xs text-gray-500 mb-2">{order.user.email}</p>}
                                <p>{order.shippingAddress?.street}</p>
                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                                <p>{order.shippingAddress?.pincode}, {order.shippingAddress?.country}</p>
                                {order.shippingAddress?.phone && <p className="mt-2 font-medium">Phone: {order.shippingAddress.phone}</p>}
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-800">Order Items ({order.orderItems?.length || 0})</h4>
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                              {order.orderItems?.map((item, index) => (
                                <div key={index} className="flex items-center space-x-3 bg-white p-3 rounded border shadow-sm">
                                  <img
                                    src={item.product?.image?.[0] || "/placeholder.png"}
                                    alt={item.product?.name || "Product"}
                                    className="w-16 h-16 object-cover rounded border"
                                  />
                                  <div className="flex-1 text-sm">
                                    <p className="font-medium text-gray-800">{item.product?.name || "Product Name Not Available"}</p>
                                    <p className="text-gray-600 text-xs">
                                      Size: <span className="font-medium">{item.variant?.size || "N/A"}</span> | 
                                      Color: <span className="font-medium">{item.variant?.color || "N/A"}</span>
                                    </p>
                                    <p className="text-gray-600 text-xs mt-1">
                                      Quantity: <span className="font-medium">{item.quantity}</span> × ₹{item.price}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="border-t pt-3 bg-white p-3 rounded">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-700">Total Items:</span>
                                <span className="font-medium">{order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0}</span>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <span className="font-semibold text-gray-700">Total Amount:</span>
                                <span className="font-bold text-lg text-green-600">₹{order.totalAmount}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;

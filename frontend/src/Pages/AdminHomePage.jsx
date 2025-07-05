import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAdminSummary } from "../services/orderServices";
import { toast } from "sonner";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const AdminHomePage = () => {
  const [summary, setSummary] = useState({
    revenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    recentOrders: [],
  });
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchAdminSummary();
        setSummary(data);
      } catch (error) {
        console.error("Failed to load admin summary:", error);
        toast.error("Failed to load admin summary");
      }
    };

    getData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Revenue</h2>
          <p className="text-2xl">₹{summary.revenue}</p>
        </div>
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-2xl">{summary.totalOrders}</p>
          <Link to="/admin/orders" className="text-blue-500 hover:underline">
            Manage Orders
          </Link>
        </div>
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-2xl">{summary.totalProducts}</p>
          <Link to="/admin/products" className="text-blue-500 hover:underline">
            Manage Products
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="py-3 px-4 w-8"></th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {summary.recentOrders.length > 0 ? (
                summary.recentOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleOrderExpansion(order._id)}
                    >
                      <td className="p-4">
                        {expandedOrder === order._id ? (
                          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </td>
                      <td className="p-4">#{order._id.slice(-8).toUpperCase()}</td>
                      <td className="p-4">{order.user?.name || "Unknown"}</td>
                      <td className="p-4">₹{order.totalAmount}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.orderStatus === "Delivered" ? "bg-green-100 text-green-700" :
                          order.orderStatus === "Shipped" ? "bg-blue-100 text-blue-700" :
                          order.orderStatus === "Processing" ? "bg-purple-100 text-purple-700" :
                          order.orderStatus === "Cancelled" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                    {expandedOrder === order._id && (
                      <tr className="border-b bg-gray-50">
                        <td colSpan={5} className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                  <p>{order.user?.name}</p>
                                  <p>{order.shippingAddress?.street}</p>
                                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                                  <p>{order.shippingAddress?.pincode}, {order.shippingAddress?.country}</p>
                                </div>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-gray-800">Order Items</h4>
                              <div className="space-y-3 max-h-64 overflow-y-auto">
                                {order.orderItems?.map((item, index) => (
                                  <div key={index} className="flex items-center space-x-3 bg-white p-3 rounded border">
                                    <img
                                      src={item.product?.image?.[0] || "/placeholder.png"}
                                      alt={item.product?.name || "Product"}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1 text-sm">
                                      <p className="font-medium text-gray-800">{item.product?.name || "Product"}</p>
                                      <p className="text-gray-600">
                                        Size: {item.variant?.size || "N/A"} | Color: {item.variant?.color || "N/A"}
                                      </p>
                                      <p className="text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="border-t pt-3">
                                <div className="flex justify-between items-center font-semibold text-lg">
                                  <span>Total Amount:</span>
                                  <span className="text-green-600">₹{order.totalAmount}</span>
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
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;

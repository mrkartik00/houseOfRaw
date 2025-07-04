import React, { useEffect, useState } from "react";
import { getUserOrders } from "../services/orderServices";
import { toast } from "sonner";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = await getUserOrders();
        setOrders(userOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className='max-w-7xl mx-auto p-4 sm:p-6'>
      <h2 className='text-xl sm:text-2xl font-bold mb-6'>My Orders</h2>

      {loading ? (
        <div className="text-center text-gray-500 py-6">Loading orders...</div>
      ) : (
        <div className='relative shadow-md sm:rounded-lg overflow-hidden'>
          <table className='min-w-full text-left text-gray-500'>
            <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
              <tr>
                <th className='py-2 px-4 sm:py-3'>Image</th>
                <th className='py-2 px-4 sm:py-3'>Order ID</th>
                <th className='py-2 px-4 sm:py-3'>Created</th>
                <th className='py-2 px-4 sm:py-3'>Shipping Address</th>
                <th className='py-2 px-4 sm:py-3'>Items</th>
                <th className='py-2 px-4 sm:py-3'>Total</th>
                <th className='py-2 px-4 sm:py-3'>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className='border-b hover:border-gray-50'>
                    <td className='py-2 px-2 sm:py-4 sm:px-4'>
                      <img
                        src={
                          order.orderItems?.[0]?.product?.image?.[0] ||
                          "/placeholder.png"
                        }
                        alt={order.orderItems?.[0]?.product?.name || "Product"}
                        className='w-10 h-10 sm:w-12 object-cover rounded-lg'
                      />
                    </td>
                    <td className='py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap'>
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className='py-2 px-2 sm:py-4 sm:px-4'>
                      {new Date(order.createdAt).toLocaleDateString()}{" "}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </td>
                    <td className='py-2 px-2 sm:py-4 sm:px-4'>
                      {order.shippingAddress
                        ? `${order.shippingAddress.city}, ${order.shippingAddress.state}`
                        : "N/A"}
                    </td>
                    <td className='py-2 px-2 sm:py-4 sm:px-4'>
                      {order.orderItems?.length || 0}
                    </td>
                    <td className='py-2 px-2 sm:py-4 sm:px-4'>
                      ₹{order.totalAmount?.toFixed(2) || "0.00"}
                    </td>
                    <td className='py-2 px-2 sm:py-4 sm:px-4'>
                      <span
                        className={`${
                          order.isPaid
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        } px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}
                      >
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className='py-6 px-4 text-center text-gray-500'>
                    You have no orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;

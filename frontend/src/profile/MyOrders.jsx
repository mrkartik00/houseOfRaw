import React, { useEffect, useState } from "react";
import { getUserOrders } from "../services/orderServices";
import { toast } from "sonner";
import { ChevronDownIcon, ChevronRightIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import ReviewModal from "../Components/Common/ReviewModal";
import { PaymentStatusBadge, PaymentMethodIcon } from "../Components/Common/PaymentStatus";
import { formatPaymentAmount } from "../utils/razorpayUtils";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [reviewModal, setReviewModal] = useState({ isOpen: false, orderItems: [], orderId: null });

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const openReviewModal = (orderItems, orderId) => {
    // Filter out items that have already been reviewed
    const unreviewed = orderItems.filter(item => !item.hasReviewed);
    setReviewModal({ isOpen: true, orderItems: unreviewed, orderId });
  };

  const closeReviewModal = () => {
    setReviewModal({ isOpen: false, orderItems: [], orderId: null });
    // Refresh orders to update review status
    fetchOrders();
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await getUserOrders();
      setOrders(userOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarSolidIcon key={star} className="h-4 w-4 text-yellow-400" />
          ) : (
            <StarIcon key={star} className="h-4 w-4 text-gray-300" />
          )
        ))}
      </div>
    );
  };

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
                <th className='py-2 px-4 sm:py-3 w-8'></th>
                <th className='py-2 px-4 sm:py-3'>Order ID</th>
                <th className='py-2 px-4 sm:py-3'>Items</th>
                <th className='py-2 px-4 sm:py-3'>Total</th>
                <th className='py-2 px-4 sm:py-3'>Order Status</th>
                <th className='py-2 px-4 sm:py-3'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr 
                      className='border-b hover:bg-gray-50 cursor-pointer'
                      onClick={() => toggleOrderExpansion(order._id)}
                    >
                      <td className='p-4'>
                        {expandedOrder === order._id ? (
                          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </td>
                      <td className='py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap'>
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className='py-2 px-2 sm:py-4 sm:px-4'>
                        {order.orderItems?.length || 0}
                      </td>
                      <td className='py-2 px-2 sm:py-4 sm:px-4 font-semibold'>
                        {formatPaymentAmount(order.totalAmount || 0)}
                      </td>
                      <td className='py-2 px-2 sm:py-4 sm:px-4'>
                        <span
                          className={`${
                            order.orderStatus === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : order.orderStatus === "Shipped"
                              ? "bg-blue-100 text-blue-700"
                              : order.orderStatus === "Processing"
                              ? "bg-purple-100 text-purple-700"
                              : order.orderStatus === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          } px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}
                        >
                          {order.orderStatus || "Pending"}
                        </span>
                      </td>
                      <td className='py-2 px-2 sm:py-4 sm:px-4'>
                        {order.orderStatus === "Delivered" && !order.allItemsReviewed && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openReviewModal(order.orderItems, order._id);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            Review Products
                          </button>
                        )}
                        {order.orderStatus === "Delivered" && order.allItemsReviewed && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-md">
                            ✓ Reviewed
                          </span>
                        )}
                      </td>
                    </tr>
                    {expandedOrder === order._id && (
                      <tr className="border-b bg-gray-50">
                        <td colSpan={6} className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Order Details */}
                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-gray-800">Order Details</h4>
                              <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                                <p><span className="font-medium">Payment Method:</span> <PaymentMethodIcon method={order.paymentMethod} /></p>
                                <p><span className="font-medium">Payment Status:</span> 
                                  <PaymentStatusBadge 
                                    status={order.isPaid ? 'paid' : 'unpaid'} 
                                    showAmount={false}
                                  />
                                </p>
                                {order.razorpayOrderId && (
                                  <p><span className="font-medium">Payment ID:</span> {order.razorpayOrderId}</p>
                                )}
                                {order.trackingNumber && (
                                  <p><span className="font-medium">Tracking Number:</span> {order.trackingNumber}</p>
                                )}
                              </div>
                              
                              {/* Shipping Address */}
                              <div>
                                <h5 className="font-semibold text-gray-700 mb-2">Shipping Address</h5>
                                <div className="text-sm text-gray-600 bg-white p-3 rounded border">
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
                                  <div key={index} className="bg-white p-3 rounded border">
                                    <div className="flex items-center space-x-3">
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
                                    
                                    {/* Show review if this item has been reviewed */}
                                    {item.hasReviewed && item.userReview && (
                                      <div className="mt-3 pt-3 border-t bg-gray-50 p-3 rounded">
                                        <div className="flex items-center space-x-2 mb-2">
                                          <span className="text-sm font-medium text-gray-700">Your Review:</span>
                                          {renderStars(item.userReview.rating)}
                                          <span className="text-sm text-gray-600">
                                            ({item.userReview.rating}/5)
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-2">{item.userReview.comment}</p>
                                        
                                        {/* Review Images */}
                                        {item.userReview.images && item.userReview.images.length > 0 && (
                                          <div className="flex space-x-2 mb-2">
                                            {item.userReview.images.map((image, imgIndex) => (
                                              <img
                                                key={imgIndex}
                                                src={image}
                                                alt={`Review ${imgIndex + 1}`}
                                                className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80"
                                                onClick={() => {
                                                  // Open image in new tab
                                                  window.open(image, '_blank');
                                                }}
                                              />
                                            ))}
                                          </div>
                                        )}
                                        
                                        <p className="text-xs text-gray-500">
                                          Reviewed on {new Date(item.userReview.createdAt).toLocaleDateString()}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className="border-t pt-3">
                                <div className="flex justify-between items-center font-semibold text-lg">
                                  <span>Total Amount:</span>
                                  <span className="text-green-600">{formatPaymentAmount(order.totalAmount)}</span>
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
                  <td colSpan={6} className='py-6 px-4 text-center text-gray-500'>
                    You have no orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={closeReviewModal}
        orderItems={reviewModal.orderItems}
        orderId={reviewModal.orderId}
      />
    </div>
  );
};

export default MyOrders;

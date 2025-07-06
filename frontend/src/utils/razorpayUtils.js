import { loadRazorpayScript, createRazorpayOrder, verifyRazorpayPayment } from '../services/orderServices';
import { toast } from 'sonner';

export const initiateRazorpayPayment = async ({
  orderData,
  userInfo,
  onSuccess,
  onFailure,
  onClose
}) => {
  try {
    // Load Razorpay script
    const isScriptLoaded = await loadRazorpayScript();
    
    if (!isScriptLoaded) {
      toast.error("Failed to load payment gateway. Please try again.");
      if (onFailure) onFailure("Payment gateway loading failed");
      return;
    }

    // Create Razorpay order
    toast.loading("Preparing payment...", { id: "payment-prep" });
    
    const orderResponse = await createRazorpayOrder(orderData);
    
    toast.dismiss("payment-prep");

    if (!orderResponse.success) {
      toast.error(orderResponse.message || "Failed to create payment order");
      if (onFailure) onFailure(orderResponse.message);
      return;
    }

    const {
      razorpayOrderId,
      razorpayKeyId,
      amount,
      currency,
      orderId
    } = orderResponse;

    // Razorpay options
    const options = {
      key: razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount * 100, // amount in smallest currency unit
      currency: currency,
      name: import.meta.env.VITE_APP_NAME || "House of Raw",
      description: `Order #${orderId?.slice(-8)?.toUpperCase()}`,
      order_id: razorpayOrderId,
      handler: async function (response) {
        try {
          toast.loading("Verifying payment...", { id: "payment-verify" });
          
          // Verify payment
          const verificationData = {
            userId: orderData.userId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderId
          };

          const verificationResponse = await verifyRazorpayPayment(verificationData);
          
          toast.dismiss("payment-verify");

          if (verificationResponse.success) {
            toast.success("Payment successful! 🎉");
            if (onSuccess) onSuccess(verificationResponse, response);
          } else {
            toast.error("Payment verification failed. Please contact support.");
            if (onFailure) onFailure("Payment verification failed");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.dismiss("payment-verify");
          toast.error("Payment verification failed. Please contact support.");
          if (onFailure) onFailure("Payment verification error");
        }
      },
      prefill: {
        name: userInfo?.name || orderData.shippingAddress?.fullName || "",
        email: userInfo?.email || "",
        contact: userInfo?.mobile || orderData.shippingAddress?.mobile || ""
      },
      notes: {
        address: `${orderData.shippingAddress?.street}, ${orderData.shippingAddress?.city}`
      },
      theme: {
        color: "#000000"
      },
      modal: {
        ondismiss: function() {
          if (onClose) onClose();
        }
      }
    };

    // Open Razorpay checkout
    const razorpay = new window.Razorpay(options);
    razorpay.open();

    // Handle payment failure
    razorpay.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error);
      toast.error(`Payment failed: ${response.error.description}`);
      if (onFailure) onFailure(response.error.description);
    });

  } catch (error) {
    console.error("Error initiating Razorpay payment:", error);
    toast.error("Failed to initiate payment. Please try again.");
    if (onFailure) onFailure("Payment initiation failed");
  }
};

export const formatPaymentAmount = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

export const getPaymentStatusBadge = (status) => {
  const statusClasses = {
    'Paid': 'bg-green-100 text-green-700',
    'Unpaid': 'bg-orange-100 text-orange-700',
    'Failed': 'bg-red-100 text-red-700',
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Refunded': 'bg-gray-100 text-gray-700'
  };

  return {
    className: `px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || statusClasses['Pending']}`,
    text: status
  };
};

// services/adminService.js
import axiosInstance from "./axiosInstance";

// services/adminService.js
export const fetchAllOrders = async () => {
  const token = localStorage.getItem("adminToken");
  const res = await axiosInstance.get("/api/order/list", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.orders;
};


export const updateOrderStatus = async (orderId, status) => {
  const token = localStorage.getItem("adminToken");
  const res = await axiosInstance.post(
  "/api/order/status",
  { orderId, status },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

  return res.data;
};

export const fetchAdminSummary = async () => {
  const token = localStorage.getItem("adminToken");
  const res = await axiosInstance.get("/api/order/summary", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};



export const placeOrder = async (orderData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return { success: false, message: "Token not found. Please log in again." };
  }

  try {
    const response = await axiosInstance.post(
      "/api/order/placeOrder",
      orderData,
      {
        headers: {
          token,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Order placement failed:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Server error",
    };
  }
};


export const getUserOrders = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token missing");

  const response = await axiosInstance.get("/api/order/getUserOrders", {
    headers: {
      token,
    },
  });

  return response.data.orders;
};

// Razorpay payment functions
export const createRazorpayOrder = async (orderData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return { success: false, message: "Token not found. Please log in again." };
  }

  try {
    const response = await axiosInstance.post(
      "/api/order/placeOrderRazorpay",
      orderData,
      {
        headers: {
          token,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to create Razorpay order",
    };
  }
};

export const verifyRazorpayPayment = async (paymentData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return { success: false, message: "Token not found. Please log in again." };
  }

  try {
    const response = await axiosInstance.post(
      "/api/order/verifyRazorpay",
      paymentData,
      {
        headers: {
          token,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Razorpay payment verification failed:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to verify payment",
    };
  }
};

// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

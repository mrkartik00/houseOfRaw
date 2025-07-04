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


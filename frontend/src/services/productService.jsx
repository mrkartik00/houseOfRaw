// services/productService.js
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000'}/api/products`;

export const fetchAllProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await axios.get(`/api/products?${query}`);
  // API returns array directly, not wrapped in { products: [] }
  return Array.isArray(response.data) ? response.data : (response.data.products || []);
};


export const fetchSingleProduct = async (id) => {
  const response = await axios.get(`${BASE_URL}/single`, {
    params: { id }, // ✅ passed as query param
  });
  return response.data.product;
};

export const fetchRelatedProducts = async (id) => {
  const res = await axios.get(`/api/products/related/${id}`);
  return res.data.relatedProducts || [];
};

export const addProduct = async (formData, token) => {
  const response = await axios.post(
    `${BASE_URL}/add`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type manually for FormData
      },
    }
  );
  return response.data;
};

export const removeProduct = async (id, token) => {
  const response = await axios.get(`/api/products/remove`, {
    params: { id },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateProduct = async (formData, token, id) => {
  const response = await axios.put(
    `${BASE_URL}/update/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};



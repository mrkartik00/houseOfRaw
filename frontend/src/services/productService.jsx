// services/productService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:7000/api/products'; // Update if your backend runs on a different port or route

export const fetchAllProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await axios.get(`/api/products?${query}`);
  return response.data;
};


export const fetchSingleProduct = async (id) => {
  const response = await axios.get(`http://localhost:7000/api/products/single`, {
    params: { id }, // ✅ passed as query param
  });
  return response.data.product;
};

export const fetchRelatedProducts = async (id) => {
  const res = await axios.get(`/api/products/related/${id}`);
  return res.data;
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
    `http://localhost:7000/api/products/update/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};



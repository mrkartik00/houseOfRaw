// services/productService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/products'; // Update if your backend runs on a different port or route

export const fetchAllProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await axios.get(`/api/products?${query}`);
  return response.data;
};


export const fetchSingleProduct = async (id) => {
  const response = await axios.get(`http://localhost:3000/api/products/single`, {
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
  const res = await axios.get(`${BASE_URL}/remove`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { id }, // not recommended with GET, but matches your backend for now
  });
  return res.data;
};
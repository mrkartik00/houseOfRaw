// src/services/auth.js
import axiosInstance from './axiosInstance';

export const loginUser = async (email, password) => {
  const response = await axiosInstance.post('/api/user/login', { email, password });
  return response.data;
};


export const registerUser = async (name, email, password, phone) => {
  const response = await axiosInstance.post('/api/user/register', {
    name,
    email,
    password,
    phone,
  });
  return response.data;
};

export const getUserDetails = async () => {
  const token = localStorage.getItem('token');

  const res = await axiosInstance.get('/api/user/details', {
    headers: {
      token,
    },
  });

  return res.data;
};

export const updateUserDetails = async (formData, token) => {
  return axios.put('/api/user/update', formData, {
    headers: { token }
  });
};

export const updateUserPassword = async (passwordData, token) => {
  return axiosInstance.put('/api/user/update-password', passwordData, {
    headers: { token }
  });
};

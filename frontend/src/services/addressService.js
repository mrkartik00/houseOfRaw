// services/addressService.js
import axiosInstance from './axiosInstance';

// Add a new shipping address
export const addShippingAddress = async (addressData) => {
  try {
    const response = await axiosInstance.post('/api/user/address', addressData);
    return response.data;
  } catch (error) {
    console.error('Error adding shipping address:', error);
    throw error.response?.data || error;
  }
};

// Get all user addresses
export const getUserAddresses = async () => {
  try {
    const response = await axiosInstance.get('/api/user/addresses');
    return response.data;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error.response?.data || error;
  }
};

// Update shipping address
export const updateShippingAddress = async (addressIndex, addressData) => {
  try {
    const response = await axiosInstance.put(`/api/user/address/${addressIndex}`, addressData);
    return response.data;
  } catch (error) {
    console.error('Error updating shipping address:', error);
    throw error.response?.data || error;
  }
};

// Delete shipping address
export const deleteShippingAddress = async (addressIndex) => {
  try {
    const response = await axiosInstance.delete(`/api/user/address/${addressIndex}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting shipping address:', error);
    throw error.response?.data || error;
  }
};

import axiosInstance from "./axiosInstance";

// Add a product review
export const addProductReview = async (reviewData) => {
  try {
    // reviewData can be either FormData (with images) or regular object
    // userId will be extracted from auth token on backend
    const response = await axiosInstance.post("/api/reviews/add", reviewData, {
      headers: {
        'Content-Type': reviewData instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error.response?.data || error.message;
  }
};

// Get product reviews
export const getProductReviews = async (productId) => {
  try {
    const response = await axiosInstance.post("/api/reviews/get", { productId });
    return response.data;
  } catch (error) {
    console.error("Error getting reviews:", error);
    throw error.response?.data || error.message;
  }
};

// Get all reviews by current user
export const getUserReviews = async () => {
  try {
    const response = await axiosInstance.get("/api/reviews/user");
    return response.data;
  } catch (error) {
    console.error("Error getting user reviews:", error);
    throw error.response?.data || error.message;
  }
};

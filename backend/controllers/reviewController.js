import Product from "../models/productmodel.js";
import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import { v2 as cloudinary } from "cloudinary";

const addProductReview = async (req, res) => {
  try {
    const { productId, comment, rating, orderId } = req.body;
    const userId = req.userId; // Get from auth middleware

    // Validate
    if (!productId || !comment || !rating || !orderId) {
      return res.status(400).json({
        success: false,
        message: "productId, comment, rating, and orderId are required",
      });
    }

    // Convert rating to number (it comes as string from FormData)
    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 1 and 5",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Find product
    const product = await Product.findById(productId).select('reviews ratings');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user has already reviewed this product from this specific order
    const alreadyReviewed = product.reviews.find(
      (rev) => rev.user.toString() === userId && rev.order && rev.order.toString() === orderId
    );
    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product from this order",
      });
    }

    // Check if user has purchased this product in this specific order
    const hasOrdered = await Order.findOne({
      _id: orderId,
      user: userId,
      "orderItems.product": productId,
    }).select('_id'); // Only select _id for faster query

    if (!hasOrdered) {
      return res.status(403).json({
        success: false,
        message: "You can only review products you have purchased from this order",
      });
    }

    // Handle image uploads if any
    let reviewImages = [];
    if (req.files && req.files.length > 0) {
      // Upload images in parallel for faster processing
      const uploadPromises = req.files.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "image",
            folder: "reviews",
            quality: "auto:good", // Optimize quality for faster upload
            fetch_format: "auto", // Auto-optimize format
          });
          return result.secure_url;
        } catch (uploadError) {
          console.error("Error uploading review image:", uploadError);
          return null; // Return null for failed uploads
        }
      });

      const uploadResults = await Promise.all(uploadPromises);
      reviewImages = uploadResults.filter(url => url !== null); // Filter out failed uploads
    }

    // Add review
    const newReview = {
      user: userId,
      order: orderId,
      comment,
      rating: numericRating,
      images: reviewImages,
    };

    product.reviews.push(newReview);

    // Update average rating
    const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    product.ratings = totalRating / product.reviews.length;

    // Save product with the new review
    await product.save();

    // Return response immediately with the new review data
    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: {
        ...newReview,
        user: { _id: userId }, // Include basic user info
        createdAt: new Date(),
      },
      averageRating: product.ratings,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      success: false,
      message: "Error adding review",
      error: error.message,
    });
  }
};

// //example
// http://localhost:3000/api/reviews/add
// {
//   "productId": "685be7a6ea11bca2822c3c8b",
//   "userId": "6859a0a542f9006636c64caa",
//   "rating": 5,
//   "comment": "Amazing quality, fits perfectly!"
// }

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId).populate(
      "reviews.user",
      "name email"
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
      averageRating: product.ratings,
    });
  } catch (error) {
    console.error("Error getting reviews:", error);
    res.status(500).json({ success: false, message: "Failed to get reviews" });
  }
};

// Get all reviews by the current user
const getUserReviews = async (req, res) => {
  try {
    const userId = req.userId; // Get from auth middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Find all products that have reviews by this user
    const products = await Product.find({
      "reviews.user": userId
    }).populate("reviews.user", "name");

    // Extract only the reviews by this user
    const userReviews = [];
    products.forEach(product => {
      const userProductReviews = product.reviews.filter(
        review => review.user._id.toString() === userId
      );
      userProductReviews.forEach(review => {
        userReviews.push({
          _id: review._id,
          comment: review.comment,
          rating: review.rating,
          images: review.images,
          createdAt: review.createdAt,
          product: {
            _id: product._id,
            name: product.name,
            image: product.image
          }
        });
      });
    });

    res.status(200).json({
      success: true,
      reviews: userReviews,
    });
  } catch (error) {
    console.error("Error getting user reviews:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to get user reviews",
      error: error.message 
    });
  }
};

export { addProductReview, getProductReviews, getUserReviews };

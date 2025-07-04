import Product from "../models/productmodel.js";
import mongoose from "mongoose";
import Order from "../models/orderModel.js";

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, comment, rating } = req.body;

    // Validate
    if (!productId || !userId || !comment || typeof rating !== "number") {
      return res.status(400).json({
        success: false,
        message: "productId, userId, comment, and rating are required",
      });
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user has already reviewed
    const alreadyReviewed = product.reviews.find(
      (rev) => rev.user.toString() === userId
    );
    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    //  Check if user has purchased this product
    const hasOrdered = await Order.findOne({
      user: userId,
      "orderItems.product": productId,
      paymentStatus: "Completed", // optional check
    });

    if (!hasOrdered) {
      return res.status(403).json({
        success: false,
        message: "You can only review products you have purchased",
      });
    }

    // Add review
    product.reviews.push({
      user: new mongoose.Types.ObjectId(userId),
      comment,
      rating,
    });

    // Update average rating
    const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    product.ratings = totalRating / product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      reviews: product.reviews,
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

export { addProductReview, getProductReviews };

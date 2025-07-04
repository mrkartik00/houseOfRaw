import express from 'express';
import { addProductReview, getProductReviews } from '../controllers/reviewController.js';

const reviewRouter = express.Router();

// Route to add a product review
reviewRouter.post('/add', addProductReview);
// Route to get reviews for a product
reviewRouter.get('/get', getProductReviews);
// Export the review router
export default reviewRouter;
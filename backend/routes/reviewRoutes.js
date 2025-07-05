import express from 'express';
import { addProductReview, getProductReviews, getUserReviews } from '../controllers/reviewController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const reviewRouter = express.Router();

// Route to add a product review (requires authentication, supports image uploads)
reviewRouter.post('/add', authUser, upload.array('images', 5), addProductReview);
// Route to get reviews for a product
reviewRouter.post('/get', getProductReviews);
// Route to get all reviews by current user (requires authentication)
reviewRouter.get('/user', authUser, getUserReviews);
// Export the review router
export default reviewRouter;
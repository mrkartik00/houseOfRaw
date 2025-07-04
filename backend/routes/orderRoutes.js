import express from 'express';
import {
  placeOrder,
  placeOrderRazorpay,
  getUserOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
  getAdminSummary,
  verifyRazorpay,
} from '../controllers/orderController.js';
import adminAuth from '../middlewares/adminAuth.js';
import authUser from '../middlewares/authUser.js';

const orderRouter = express.Router();

//admin routes
orderRouter.get('/list', adminAuth, getAllOrders);
orderRouter.get('/getSingleOrder', adminAuth, getSingleOrder);
orderRouter.post('/status', adminAuth, updateOrderStatus);

//user routes
orderRouter.post('/placeOrder',authUser, placeOrder);

// Payment routes
orderRouter.post('/placeOrderRazorpay', authUser, placeOrderRazorpay);
orderRouter.get('/getUserOrders', authUser, getUserOrders);

orderRouter.get("/summary", adminAuth, getAdminSummary);
// Verify Razorpay payment
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay);

export default orderRouter;
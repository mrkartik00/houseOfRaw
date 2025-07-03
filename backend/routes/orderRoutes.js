import express from 'express';
import {
  placeOrder,
  placeOrderRazorpay,
  getUserOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import adminAuth from '../middlewares/adminAuth.js';
import authUser from '../middlewares/authUser.js';

const orderRouter = express.Router();

//admin routes
orderRouter.get('/list', adminAuth, getAllOrders);
orderRouter.get('/getSingleOrder', adminAuth, getSingleOrder);
orderRouter.post('/status', updateOrderStatus);

//user routes
orderRouter.post('/placeOrder',authUser, placeOrder);

// Payment routes
orderRouter.post('/placeOrderRazorpay', authUser, placeOrderRazorpay);
orderRouter.get('/getUserOrders', getUserOrders);

export default orderRouter;
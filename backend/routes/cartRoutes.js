import express from 'express';
import { addToCart,getUserCart,updateCart } from '../controllers/cartController.js';
import authUser from '../middlewares/authUser.js';

const cartRouter = express.Router();

// add auth middleware to all routes 
// cartRouter.use(authUser);
// cart routes
cartRouter.post('/add',addToCart);
cartRouter.post('/update',updateCart);
cartRouter.post('/get', getUserCart);

export default cartRouter;
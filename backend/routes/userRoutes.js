import express from 'express';
import { registerUser,
    loginUser,
    logoutUser,
    getUserDetails,
    updateUserDetails,
    updateUserPassword,
    deleteUserAccount,
    adminLogin,
    toggleWishlist,
    getWishlist,
    addShippingAddress,
    getUserAddresses,
    updateShippingAddress,
    deleteShippingAddress,
} from '../controllers/userController.js';
import  authUser  from '../middlewares/authUser.js';
import { get } from 'mongoose';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.get('/details', authUser, getUserDetails); // Protected
userRouter.put('/update', authUser, updateUserDetails);
userRouter.put('/update-password', authUser, updateUserPassword);
userRouter.delete('/delete', authUser, deleteUserAccount);
userRouter.post('/admin/login',adminLogin);
userRouter.post('/wishlist', authUser, toggleWishlist); 
userRouter.get('/wishlist', authUser, getWishlist); 

// Address management routes
userRouter.post('/address', authUser, addShippingAddress);
userRouter.get('/addresses', authUser, getUserAddresses);
userRouter.put('/address/:addressIndex', authUser, updateShippingAddress);
userRouter.delete('/address/:addressIndex', authUser, deleteShippingAddress); 

export default userRouter;
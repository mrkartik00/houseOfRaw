import express from 'express';
import { registerUser,
    loginUser,
    logoutUser,
    getUserDetails,
    updateUserDetails,
    updateUserPassword,
    deleteUserAccount,
    adminLogin
} from '../controllers/userController.js';
import  authUser  from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.get('/details', authUser, getUserDetails); // Protected
userRouter.put('/update', authUser, updateUserDetails);
userRouter.put('/update-password', authUser, updateUserPassword);
userRouter.delete('/delete', authUser, deleteUserAccount);
userRouter.post('/admin',adminLogin);

export default userRouter;
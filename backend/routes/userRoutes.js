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

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.get('/details', getUserDetails);
userRouter.put('/update', updateUserDetails);
userRouter.put('/update-password', updateUserPassword);
userRouter.delete('/delete', deleteUserAccount);
userRouter.post('/admin',adminLogin);

export default userRouter;
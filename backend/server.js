import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Connect database and cloudinary
connectDB();
connectCloudinary();

// ✅ Middleware
app.use(cors());
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse x-www-form-urlencoded

// ✅ API Endpoints
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// ✅ User routes
app.use('/api/users', userRouter);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
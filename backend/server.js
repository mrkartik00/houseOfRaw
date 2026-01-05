import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import productController from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";

const app = express();  
const PORT = process.env.PORT || 7000;

//  Connect db and cloudinary
connectDB();
connectCloudinary();

//  Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse x-www-form-urlencoded

//  API Endpoints
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// User routes
app.use("/api/user", userRouter);

// Product routes
app.use("/api/products", productController);

// Cart routes
app.use("/api/cart", cartRoutes);

// Order routes
app.use("/api/order", orderRouter);

// review routes
app.use("/api/reviews", reviewRouter);



//  Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

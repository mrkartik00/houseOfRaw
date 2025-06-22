import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

//app config
const app = express();
const PORT = process.env.PORT || 3000;
connectDB();
connectCloudinary();

//middleware
app.use(express.json());
app.use(cors());


//api endpoints
app.get('/', (req, res) => {
  res.send('Hello World!');
});

//start the server
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
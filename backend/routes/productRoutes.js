import express from 'express';
import { addProduct,removeProduct,listProducts,singleProduct } from '../controllers/productController.js';
import upload from '../middlewares/multer.js';

const productController = express.Router();

// Route to add a new product
productController.post('/add',upload.fields([{name:'image1', maxCount:1,},{name:'image2', maxCount:1,},{name:'image3', maxCount:1,},{name:'image4', maxCount:1,},{name:'image5',maxCount:1}]), addProduct);
// Route to remove a product
productController.get('/remove', removeProduct);
// Route to list all products
productController.get('/list', listProducts);
// Route to get a single product by ID
productController.get('/single', singleProduct);

export default productController;
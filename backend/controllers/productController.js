import productModel from "../models/productModel.js";
import Product from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

// add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subcategory,
      color,
      stock,
      sizes,
    } = req.body;

    // images using multer
    const image3 = req.files.image3 && req.files.image3[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image1 = req.files.image1 && req.files.image1[0];
    const image4 = req.files.image4 && req.files.image4[0];
    const image5 = req.files.image5 && req.files.image5[0];

    // add images to cloudinary
    const images = [image1, image2, image3, image4, image5].filter(
      (item) => item !== undefined
    );

    let imageUrls = await Promise.all(
      images.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    console.log(image1, image2, image3, image4, image5);
    console.log(imageUrls);

    //save product to database
    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      subcategory,
      color,
      sizes: JSON.parse(sizes),
      stock: Number(stock),
      image: imageUrls,
    });
    await product.save();
    console.log("✅ Product added successfully:", product);

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//list all products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Remove product by ID
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    console.log("Product ID to delete:", id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const deleted = await productModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found or already deleted",
      });
    }

    res.json({
      success: true,
      message: "Product removed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single product by ID
const singleProduct = async (req, res) => {
  try {
    const {id} = req.body;
    const product = await productModel.findById(id);
     res.json({
      success: true,
      product,
    });
    
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
    
  }
};

export { addProduct, listProducts, removeProduct, singleProduct };

import productModel from "../models/productmodel.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

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
    const product = new productModel({
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
    const {
      category,
      color,
      size,
      material,
      minPrice,
      maxPrice,
      sortBy
    } = req.query;

    let query = {};

    if (category) query.category = category;
    if (color) query.color = color;
    if (size) query.sizes = { $in: size.split(',') };
    if (material) query.material = { $in: material.split(',') };
    if (minPrice || maxPrice) {
      query.price = {
        ...(minPrice ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice ? { $lte: Number(maxPrice) } : {})
      };
    }

    let productQuery = productModel.find(query).populate('reviews.user', 'name email');

    if (sortBy === 'priceAsc') productQuery = productQuery.sort({ price: 1 });
    else if (sortBy === 'priceDesc') productQuery = productQuery.sort({ price: -1 });
    else if (sortBy === 'popularity') productQuery = productQuery.sort({ sold: -1 });

    const products = await productQuery;
    res.json({ success: true, products });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// Remove product by ID
// productController.js
const removeProduct = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    await productModel.findByIdAndDelete(id);

    return res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ success: false, message: "Server error while deleting" });
  }
};


// Get single product by ID
const singleProduct = async (req, res) => {
  try {
    const { id } = req.query; // ✅ not req.body
    if (!id) return res.status(400).json({ message: "Product ID is required" });

    const product = await productModel.findById(id).populate('reviews.user', 'name email');
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// GET /api/products/related/:id
// controller/productController.js
// productController.js

const getRelatedProducts = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const relatedProducts = await productModel.find({
      _id: { $ne: productId },
      subcategory: product.subcategory,
    }).limit(10).populate('reviews.user', 'name email');

    res.status(200).json({ success: true, relatedProducts });
  } catch (error) {
    console.error("Error in getRelatedProducts:", error);
    res.status(500).json({ success: false, message: "Failed to fetch related products", error: error.message });
  }
};

export default getRelatedProducts;



const getAllProducts = async (req, res) => {
  const { sortBy, category, color, size, material, minPrice, maxPrice } = req.query;
  
  // Build filter object
  let filter = {};
  
  // Category filter
  if (category) {
    filter.category = { $regex: category, $options: 'i' };
  }
  
  // Color filter
  if (color) {
    filter.color = { $regex: color, $options: 'i' };
  }
  
  // Size filter
  if (size) {
    const sizeArray = size.split(',');
    filter.sizes = { $in: sizeArray };
  }
  
  // Material filter
  if (material) {
    const materialArray = material.split(',');
    filter.material = { $in: materialArray };
  }
  
  // Price range filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseInt(minPrice);
    if (maxPrice) filter.price.$lte = parseInt(maxPrice);
  }

  // Build sort object
  let sort = {};
  switch (sortBy) {
    case 'priceAsc':
      sort.price = 1;
      break;
    case 'priceDesc':
      sort.price = -1;
      break;
    case 'popularity':
      sort.sold = -1;
      break;
    case 'newest':
      sort.createdAt = -1;
      break;
    case 'rating':
      sort.ratings = -1;
      break;
    default:
      sort.createdAt = -1; // Default fallback: newest first
      break;
  }

  try {
    const products = await productModel.find(filter).sort(sort).populate('reviews.user', 'name email');
    res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

const updateProduct = async (req, res) => {
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

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    // Handle image uploads
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];
    const image5 = req.files?.image5?.[0];

    const images = [image1, image2, image3, image4, image5].filter(Boolean);

    const imageUrls = await Promise.all(
      images.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    // Prepare update payload
    const updatedFields = {
      name,
      description,
      price: Number(price),
      category,
      subcategory,
      color,
      stock: Number(stock),
      sizes: JSON.parse(sizes),
    };

    // Only update image if new ones are uploaded
    if (imageUrls.length > 0) {
      updatedFields.image = imageUrls;
    }

    const updatedProduct = await productModel.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};








export { addProduct, listProducts, removeProduct, singleProduct, getRelatedProducts, getAllProducts, updateProduct };

import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

// Add product to user 's cart
const addToCart = async (req, res) => {
  try {
    const { userId, productId, size, color, quantity } = req.body;

    // Validate fields
    if (!userId || !productId || !size || !color || !quantity) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (userId, productId, size, color, quantity) are required",
      });
    }

    // Get product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if requested quantity is available
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items in stock`,
      });
    }

    // Find cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      // Create new cart
      cart = new Cart({
        user: userId,
        items: [
          {
            product: productId,
            variant: { size, color },
            quantity,
            price: product.price,
          },
        ],
      });
    } else {
      // Check for existing item
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === productId &&
          item.variant.size === size &&
          item.variant.color === color
      );

      if (existingItemIndex > -1) {
        const currentQty = cart.items[existingItemIndex].quantity;
        const totalRequested = currentQty + quantity;

        // Check combined quantity vs stock
        if (totalRequested > product.stock) {
          return res.status(400).json({
            success: false,
            message: `Only ${product.stock} items in stock. You already have ${currentQty} in cart.`,
          });
        }

        cart.items[existingItemIndex].quantity += quantity;
      } else {
        if (quantity > product.stock) {
          return res.status(400).json({
            success: false,
            message: `Only ${product.stock} items in stock`,
          });
        }

        cart.items.push({
          product: productId,
          variant: { size, color },
          quantity,
          price: product.price,
        });
      }
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

{
  /* example usage http://localhost:3000/api/cart/add
{
  "userId": "665b3a3fc9f7cd5533f0c9d3",
  "productId": "685be8a1cb091dc82ca161cc",
  "size": "M",
  "color": "black",
  "quantity": 22
}
  */
}

// Update product in user's cart
const updateCart = async (req, res) => {
  try {
    const { userId, productId, newQuantity, newSize, newColor } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "userId and productId are required",
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found for user",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variant.size === newSize &&
        item.variant.color === newColor
    );

    // If updating quantity of existing item
    if (itemIndex > -1) {
      if (newQuantity <= 0) {
        // Remove item if quantity is zero or less
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = newQuantity;
      }
    } else {
      // Otherwise, check if trying to update a different variant
      const originalItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (originalItemIndex > -1) {
        const product = await Product.findById(productId);
        if (!product) {
          return res
            .status(404)
            .json({ success: false, message: "Product not found" });
        }

        // Update variant and quantity
        cart.items[originalItemIndex].variant = {
          size: newSize,
          color: newColor,
        };
        cart.items[originalItemIndex].quantity = newQuantity;
        cart.items[originalItemIndex].price = product.price;
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Product not found in cart" });
      }
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

{
  /* example usage http://localhost:3000/api/cart/update
{
  "userId": "665b3a3fc9f7cd5533f0c9d3",
  "productId": "685be8a1cb091dc82ca161cc",
  "newSize": "M",
  "newColor": "black",
  "newQuantity": 4
}
  */
}

// Get user's cart
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error fetching user cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


{/* example usage http://localhost:3000/api/cart/get
  "userId": "665b3a3fc9f7cd5533f0c9d3"
}
*/}

export { addToCart, getUserCart, updateCart };

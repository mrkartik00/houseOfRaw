import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// Utility: Add totalItems and totalPrice to cart
const getCartSummary = (cart) => {
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  return { ...cart.toObject(), totalItems, totalPrice };
};

// Add product to user's cart
const addToCart = async (req, res) => {
  try {
    const { userId, productId, size, color, quantity } = req.body;

    if (!userId || !productId || !size || !color || !quantity) {
      return res.status(400).json({
        success: false,
        message: "All fields (userId, productId, size, color, quantity) are required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items in stock`,
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{
          product: productId,
          variant: { size, color },
          quantity,
          price: product.price,
        }],
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === productId &&
          item.variant.size === size &&
          item.variant.color === color
      );

      if (existingItemIndex > -1) {
        const currentQty = cart.items[existingItemIndex].quantity;
        const totalRequested = currentQty + quantity;

        if (totalRequested > product.stock) {
          return res.status(400).json({
            success: false,
            message: `Only ${product.stock} items in stock. You already have ${currentQty} in cart.`,
          });
        }

        cart.items[existingItemIndex].quantity = totalRequested;
      } else {
        cart.items.push({
          product: productId,
          variant: { size, color },
          quantity,
          price: product.price,
        });
      }
    }

    await cart.save();

    // 🧠 Fetch populated version before returning
    const populatedCart = await Cart.findById(cart._id).populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: getCartSummary(populatedCart),
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update product in user's cart
const updateCart = async (req, res) => {
  try {
    const { userId, productId, newQuantity, newSize, newColor } = req.body;

    if (!userId || !productId || !newSize || !newColor) {
      return res.status(400).json({
        success: false,
        message: "userId, productId, newSize, and newColor are required",
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found for user" });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variant.size === newSize &&
        item.variant.color === newColor
    );

    if (itemIndex > -1) {
      if (newQuantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = newQuantity;
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart for the given variant",
      });
    }

    await cart.save();

    // 🧠 Fetch populated version before returning
    const populatedCart = await Cart.findById(cart._id).populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: getCartSummary(populatedCart),
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get user's cart
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found for this user" });
    }

    return res.status(200).json({
      success: true,
      cart: getCartSummary(cart),
    });
  } catch (error) {
    console.error("Error fetching user cart:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { addToCart, updateCart, getUserCart };

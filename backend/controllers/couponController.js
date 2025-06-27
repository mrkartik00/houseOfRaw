import Coupon from "../models/couponModel.js";
import Cart from "../models/cartModel.js";

export const applyCoupon = async (req, res) => {
  try {
    const { code, userId } = req.body;

    // Find coupon
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon code" });
    }

    // Check if coupon is expired
    if (new Date(coupon.expiry) < new Date()) {
      return res.status(400).json({ success: false, message: "Coupon has expired" });
    }

    // ✅ Check if user has already used this coupon
    if (coupon.usedBy.includes(userId)) {
      return res.status(400).json({ success: false, message: "Coupon already used by this user" });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(400).json({ success: false, message: "Cart not found" });
    }

    const discount = (cart.totalPrice * coupon.discountPercent) / 100;
    const finalTotal = cart.totalPrice - discount;

    // Optional: Save that the user used the coupon now (do this at order placement too)
    // coupon.usedBy.push(userId);
    // await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      discount,
      finalTotal
    });

  } catch (error) {
    console.error("Error applying coupon:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};
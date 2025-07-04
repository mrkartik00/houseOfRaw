import Cart from "../models/cartModel.js";
import orderModel from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const placeOrder = async (req, res) => {
  try {
    const { userId, shippingAddress } = req.body;

    // Validate input
    if (!userId || !shippingAddress || !shippingAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: "userId and full shippingAddress (with pincode) are required",
      });
    }

    // Fetch user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty or not found",
      });
    }

    // Create orderItems for the order
    const orderItems = cart.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
    }));

    // Create order based on your orderModel
    const newOrder = new orderModel({
      user: userId,
      orderItems,
      totalAmount: cart.totalPrice,
      shippingAddress,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Pending",
      orderStatus: "Pending",
      isPaid: false,
    });

    await newOrder.save();

    // Update stock and sold in product model
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity,
          sold: item.quantity,
        },
      });
    }

    // Clear cart after order placed
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
};

// example
{
  /*
   http://localhost:3000/api/order/placeOrder
  {
  "userId": "665b3a3fc9f7cd5533f0c9d3",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  }
}
  */
}

// place order using online razorpay
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, orderItems, shippingAddress, totalAmount } = req.body;

    const { origin } = req.headers;

    const orderData = {
      user: userId,
      orderItems: orderItems,
      shippingAddress: shippingAddress,
      totalAmount: totalAmount,
      paymentMethod: "Online Payment",
      paymentStatus: "Pending",
      orderStatus: "Pending",
      isPaid: false,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    const options = {
      amount: totalAmount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: newOrder._id.toString(),
      notes: {
        orderId: newOrder._id.toString(),
      },
    };
    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log("Razorpay order creation error:", error);
        res.json({
          success: false,
          message: "Failed to create Razorpay order",
          error: error.message,
        });
      }
      res.json({
        success: true,
        message: "Razorpay order created successfully",
        order: order,
        orderId: newOrder._id,
        amount: totalAmount,
        currency: "INR",
        razorpayOrderId: order.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
        callbackUrl: `${origin}/api/order/verifyPayment`,
      });
    });
  } catch (error) {
    console.error("Error placing Razorpay order:", error);
    res.json({
      success: false,
      message: "Failed to place Razorpay order",
      error: error.message,
    });
  }
};

// verify payment using razorpay
const verifyRazorpay = async (req, res) => {
  try {
    const { userId, razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === "paid") {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, {
        paymentStatus: "Paid",
        isPaid: true,
        razorpayOrderId: razorpay_order_id,
      });
      await Cart.findOneAndUpdate({ user: userId }, { items: [], totalItems: 0, totalPrice: 0 });
      res.json({
        success: true,
        message: "Razorpay payment verified successfully",
        orderId: orderInfo.receipt,
      });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.json({
      success: false,
      message: "Failed to verify Razorpay payment",
      error: error.message,
    });
  }
};

// user order data for frontend
const getUserOrders = async (req, res) => {
  try {
    const userId = req.body;
    const orders = await orderModel.find({ user: userId });
    console.log("User Orders:", orders);
    res.json({
      success: true,
      orders: orders,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

// get single order admin only
const getSingleOrder = async (req, res) => {};

// get all orders admin only
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({
      success: true,
      orders: orders,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

// update order status admin only
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { orderStatus: status });
    res.json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const getAdminSummary = async (req, res) => {
  try {
    const orders = await orderModel.find({}).populate("user", "name");
    const products = await Product.find({});

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    const recentOrders = orders
      .slice(-5) // last 5 orders
      .reverse(); // most recent first

    res.json({
      success: true,
      revenue: totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch summary",
      error: error.message,
    });
  }
};




export {
  placeOrder,
  placeOrderRazorpay,
  verifyRazorpay,
  getUserOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
  getAdminSummary,
};

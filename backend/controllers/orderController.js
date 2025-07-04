import Cart from "../models/cartModel.js";
import orderModel from "../models/orderModel.js";
import Product from "../models/productModel.js";

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
    const orderItems = cart.items.map(item => ({
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
{/*
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
  */}


// place order using online razorpay
const placeOrderRazorpay = async (req, res) => {
  
};


// user order data for frontend
const getUserOrders = async (req, res) => {

  try {
    const userId = req.body;
    const orders = await orderModel.find({user: userId});
    console.log("User Orders:", orders);
    res.json({
      success: true,
      orders: orders,
    });
  } catch (error) {
    res.json({
      success:false,
      error: error.message
    })
  }
};

// get single order admin only
const getSingleOrder = async (req, res) => {};

// get all orders admin only
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({})
    res.json({
      success: true,
      orders: orders,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    })
  }
};

// update order status admin only
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
  await orderModel.findByIdAndUpdate(orderId, { orderStatus: status })
  res.json({
    success: true,
    message: "Order status updated successfully",
  });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    })
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
  getUserOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
  getAdminSummary,
};

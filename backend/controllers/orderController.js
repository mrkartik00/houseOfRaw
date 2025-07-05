import Cart from "../models/cartModel.js";
import orderModel from "../models/orderModel.js";
import Product from "../models/productmodel.js";
import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const placeOrder = async (req, res) => {
  try {
    console.log("=== PlaceOrder API Called ===");
    console.log("Request body:", req.body);
    console.log("User ID from auth middleware:", req.userId);
    
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.userId; // Get userId from auth middleware instead of request body

    // Validate input
    if (!userId || !shippingAddress) {
      console.log("Validation failed - missing required fields");
      return res.status(400).json({
        success: false,
        message: "User authentication and shippingAddress are required",
      });
    }

    // Map the address fields correctly for the order model
    const orderShippingAddress = {
      street: shippingAddress.street || shippingAddress.addressLine || shippingAddress.address,
      city: shippingAddress.city,
      state: shippingAddress.state,
      pincode: shippingAddress.pincode,
      country: shippingAddress.country || "India"
    };

    // Validate required address fields
    if (!orderShippingAddress.street || !orderShippingAddress.city || 
        !orderShippingAddress.state || !orderShippingAddress.pincode) {
      console.log("Address validation failed - missing required address fields");
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required (street, city, state, pincode)",
      });
    }

    console.log("Searching for cart with userId:", userId);
    // Fetch user's cart and populate product details
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    console.log("Cart found:", !!cart);
    console.log("Cart items count:", cart?.items?.length || 0);
    
    if (!cart || cart.items.length === 0) {
      console.log("Cart is empty or not found");
      return res.status(400).json({
        success: false,
        message: "Cart is empty or not found",
      });
    }

    console.log("Creating order items...");
    // Create orderItems for the order with complete product and variant information
    const orderItems = cart.items.map((item) => ({
      product: item.product,
      variant: {
        size: item.variant.size,
        color: item.variant.color
      },
      quantity: item.quantity,
      price: item.price,
    }));
    console.log("Order items created:", orderItems);

    console.log("Creating new order...");
    
    // Map payment method from frontend to backend enum values
    const mappedPaymentMethod = paymentMethod === "COD" ? "Cash on Delivery" : 
                               paymentMethod === "RAZORPAY" ? "Online Payment" : 
                               "Cash on Delivery"; // default
                               
    // Create order based on your orderModel
    const newOrder = new orderModel({
      user: userId,
      orderItems,
      totalAmount: cart.totalPrice,
      shippingAddress: orderShippingAddress,
      paymentMethod: mappedPaymentMethod,
      paymentStatus: "Pending",
      orderStatus: "Pending",
      isPaid: false,
    });

    console.log("Saving order to database...");
    await newOrder.save();
    console.log("Order saved successfully:", newOrder._id);

    // Populate the product details for the response
    await newOrder.populate('orderItems.product');

    console.log("Updating product stock...");
    // Update stock and sold in product model
    for (const item of cart.items) {
      console.log("Updating stock for product:", item.product);
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity,
          sold: item.quantity,
        },
      });
    }

    console.log("Clearing cart...");
    // Clear cart after order placed
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    await cart.save();

    console.log("Order placement successful, sending response...");
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("=== ERROR in placeOrder ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
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
    console.log("getUserOrders called");
    console.log("req.userId:", req.userId);
    console.log("req.headers:", req.headers);

    const userId = req.userId; // ✅ from authUser middleware

    if (!userId) {
      console.log("No userId found");
      return res.status(400).json({
        success: false,
        message: "User ID not found in request",
      });
    }

    console.log("Searching for orders with userId:", userId);

    // Find orders and populate product details
    const orders = await orderModel.find({ user: userId })
      .populate('orderItems.product')
      .sort({ createdAt: -1 });

    console.log("Found orders:", orders.length);
    
    // Check which products have been reviewed by this user
    const ordersWithReviewStatus = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await Promise.all(
          order.orderItems.map(async (item) => {
            // Check if this user has reviewed this product from this specific order
            const product = await Product.findById(item.product._id);
            const userReview = product?.reviews?.find(
              review => review.user.toString() === userId && 
                       review.order && 
                       review.order.toString() === order._id.toString()
            );
            
            return {
              ...item.toObject(),
              hasReviewed: !!userReview,
              userReview: userReview || null
            };
          })
        );
        
        return {
          ...order.toObject(),
          orderItems,
          // Check if all products in this order have been reviewed
          allItemsReviewed: orderItems.every(item => item.hasReviewed)
        };
      })
    );

    res.json({
      success: true,
      orders: ordersWithReviewStatus,
    });
  } catch (error) {
    console.error("Error in getUserOrders:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};


// get single order admin only
const getSingleOrder = async (req, res) => {};

// get all orders admin only
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({})
      .populate('user', 'name email')
      .populate('orderItems.product')
      .sort({ createdAt: -1 });
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
    const orders = await orderModel.find({})
      .populate("user", "name")
      .populate("orderItems.product", "name image");
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

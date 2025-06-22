import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  shippingAddress: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{6}$/.test(v); // Validate Indian pincode format
        },
        message: (props) => `${props.value} is not a valid pincode!`,
      },
    },
    country: {
      type: String,
      default: "India",
    },
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["Cash on Delivery", "Online Payment"],
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  trackingNumber: {
    type: String,
    default: null,
  },
  timestamps: true,
});

const orderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

export default orderModel;

import mongoose from "mongoose";

const returnRequestSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  variant: {
    size: { type: String, required: true },
    color: { type: String, required: true }
  },
  reason: {
    type: String,
    required: true,
    enum: [
      "Wrong item received",
      "Item damaged",
      "Size/fit issue",
      "Quality issue",
      "Changed mind",
      "Other"
    ]
  },
  comments: {
    type: String,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Processed"],
    default: "Pending"
  },
  refundMethod: {
    type: String,
    enum: ["Store Credit", "Bank Transfer", "Original Payment Method"],
    default: "Store Credit"
  },
  images: {
    type: [String], 
    default: []
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: Date
}, { timestamps: true });

const ReturnRequest = mongoose.models.ReturnRequest || mongoose.model("ReturnRequest", returnRequestSchema);

export default ReturnRequest;
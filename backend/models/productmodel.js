import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ["T-shirts", "Shirts", "Jeans", "Shorts", "Jumpsuits", "Dresses"],
  },
  subcategory: {
    type: String,
    required: true,
    enum: ["Casual", "Formal", "Sportswear", "Partywear"],
  },
  color: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: Array,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  sizes: {
  type: [String],
  enum: ["XS", "S", "M", "L", "XL", "XXL"],
  required: true
},
  ratings: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      comment: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
      },
      rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  sold: {
    type: Number,
    default: 0,
    min: 0,
  },

});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;

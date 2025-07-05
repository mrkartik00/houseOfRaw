import validator from "validator";
import JsonWebToken from "jsonwebtoken";
import User from "../models/usermodel.js";
import jwt from "jsonwebtoken";
import productModel from "../models/productmodel.js";

// Create JWT token function
const createToken = (id) => {
  return JsonWebToken.sign({ id }, process.env.JWT_SECRET, {});
};

// Register a new user Route
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    // Validate input format
    if (!validator.isEmail(email)) {
      res.json({
        success: false,
        message: "Invalid email format",
      });
    }
    if (!validator.isMobilePhone(phone, "any")) {
      res.json({
        success: false,
        message: "Invalid phone number format",
      });
    }
    if (!validator.isLength(password, { min: 8 })) {
      res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // user exists
    const existingUser = await User.findOne({
      $or: [{ email: email }, { phone: phone }],
    });
    if (existingUser) {
      res.json({
        success: false,
        message: "User with this email or phone already exists",
      });
    }
    // Create new user
    const newUser = new User({
      name,
      email,
      password, // hashed using prehook
      phone,
    });
    await newUser.save();
    // Create JWT token
    const token = createToken(newUser._id);
    res.json({
      success: true,
      token,
    });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error();
    res.json({
      success: false,
      message: "Error registering user",
    });
  }
};

// Login a user Route
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = createToken(user._id);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Error logging in user",
    });
  }
};


// Logout a user Route
const logoutUser = async (req, res) => {
  try {
    // On frontend: simply remove token from localStorage/cookies.
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging out",
    });
  }
};


const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user details",
    });
  }
};
// Update user details


const updateUserDetails = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (phone && !validator.isMobilePhone(phone, "any")) {
      return res.status(400).json({ success: false, message: "Invalid phone number" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      message: "User details updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user details error:", error);
    res.status(500).json({ success: false, message: "Error updating user details" });
  }
};


// Update user password
const updateUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Both passwords are required" });
    }

    const user = await User.findById(req.userId).select("+password"); // ✅ Fix is here

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Old password is incorrect" });
    }

    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({ success: false, message: "Error updating password" });
  }
};

// Delete user account
const deleteUserAccount = async (req, res) => {};

//admin login


const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email+password,process.env.JWT_SECRET)
      return res.json({
        success: true,
        token,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Error logging in admin",
    });
  }
};


// Toggle wishlist: add if not present, remove if already there
const toggleWishlist = async (req, res) => {
  try {
    const userId = req.userId; // Using req.userId set by auth middleware
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    const productExists = await productModel.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const index = user.wishlist.indexOf(productId);
    if (index > -1) {
      // Already in wishlist → remove
      user.wishlist.splice(index, 1);
    } else {
      // Not in wishlist → add
      user.wishlist.push(productId);
    }

    await user.save();

    return res.status(200).json({
      message: index > -1 ? "Removed from wishlist" : "Added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Wishlist toggle error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('wishlist');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ success: false, message: "Failed to fetch wishlist" });
  }
};

// Add shipping address
const addShippingAddress = async (req, res) => {
  try {
    const { firstName, lastName, address, city, state, pincode, country, phone } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !address || !city || !state || !pincode || !country || !phone) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required"
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Create address object matching the schema
    const newAddress = {
      fullName: `${firstName} ${lastName}`,
      mobile: phone,
      street: address,
      city,
      state,
      pincode,
      country
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Shipping address added successfully",
      address: newAddress
    });
  } catch (error) {
    console.error("Error adding shipping address:", error);
    res.status(500).json({ success: false, message: "Failed to add shipping address" });
  }
};

// Get user addresses
const getUserAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      addresses: user.addresses
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ success: false, message: "Failed to fetch addresses" });
  }
};

// Update shipping address
const updateShippingAddress = async (req, res) => {
  try {
    const { addressIndex } = req.params;
    const { firstName, lastName, address, city, state, pincode, country, phone } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (addressIndex >= user.addresses.length) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    // Update address
    user.addresses[addressIndex] = {
      fullName: `${firstName} ${lastName}`,
      mobile: phone,
      street: address,
      city,
      state,
      pincode,
      country
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Shipping address updated successfully",
      address: user.addresses[addressIndex]
    });
  } catch (error) {
    console.error("Error updating shipping address:", error);
    res.status(500).json({ success: false, message: "Failed to update shipping address" });
  }
};

// Delete shipping address
const deleteShippingAddress = async (req, res) => {
  try {
    const { addressIndex } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (addressIndex >= user.addresses.length) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    user.addresses.splice(addressIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Shipping address deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting shipping address:", error);
    res.status(500).json({ success: false, message: "Failed to delete shipping address" });
  }
};


export {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  updateUserDetails,
  updateUserPassword,
  deleteUserAccount,
  adminLogin,
  toggleWishlist,
  getWishlist,
  addShippingAddress,
  getUserAddresses,
  updateShippingAddress,
  deleteShippingAddress,
};

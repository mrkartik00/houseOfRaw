import validator from "validator";
import JsonWebToken from "jsonwebtoken";
import User from "../models/usermodel.js";
import jwt from "jsonwebtoken";

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

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  updateUserDetails,
  updateUserPassword,
  deleteUserAccount,
  adminLogin,
};

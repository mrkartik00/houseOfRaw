import validator from "validator";
import JsonWebToken from "jsonwebtoken";
import User from "../models/usermodel.js";

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
    const{email, password} = req.body;
    const user = await User.findOne({
      email: email,
    });
    if(!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Check password
    const isMatch = await user.matchPassword(password);
    if(isMatch) {
      // Create JWT token
      const token = createToken(user._id);

      res.json({
        success: true,
        token
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error logging in user",
    });
  }
};

// Logout a user Route
const logoutUser = async (req, res) => {};
// Get user details
const getUserDetails = async (req, res) => {};
// Update user details
const updateUserDetails = async (req, res) => {};
// Update user password
const updateUserPassword = async (req, res) => {};
// Delete user account
const deleteUserAccount = async (req, res) => {};

//admin login
const adminLogin = async (req, res) => {};

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

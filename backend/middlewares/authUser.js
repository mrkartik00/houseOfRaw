import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.headers;
  
  console.log("Auth middleware - token received:", token ? "Token present" : "No token");

  if (!token) {
    return res.json({
      success: false,
      message: "Token not found, please log in again.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    console.log("Auth middleware - decoded userId:", req.userId);
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.json({
      success: false,
      message: "Invalid token, please log in again.",
    });
  }
};

export default authUser;

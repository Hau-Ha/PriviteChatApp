import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes, authenticate using access token for user
// @ts-ignore
export const protectedRoute = async (req, res, next) => {
  try {
    // get token from headers
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token missing" });
    }
    //comfirm token correct
    jwt.verify(
      token,
      // @ts-ignore
      process.env.ACCESS_TOKEN_SECRET_KEY,
      async (err, decodedUser) => {
        if (err) {
          return res.status(403).json({ message: "Invalid access token" });
        }
        //find user from token
        // @ts-ignore
        const user = await User.findById(decodedUser.userId).select(
          "-hashedPassword"
        );
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        req.user = user; // attach user info to request object
        next(); // proceed to next middleware/controller
      }
    );
  } catch (error) {
    console.error("Error in protected route middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

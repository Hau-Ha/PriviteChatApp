import jwt from "jsonwebtoken";
import User from "../models/User.js";

// @ts-ignore
export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Unauthorized - Token not provided"));
    }

    // @ts-ignore
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    if (!decoded) {
      return next(new Error("Unauthorized - Token not valid or expired"));
    }

    // @ts-ignore
    const user = await User.findById(decoded.userId).select("-hashedPassword");

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;

    next();
  } catch (error) {
    console.error("Erro when verify JWT trong socketMiddleware", error);
    next(new Error("Unauthorized"));
  }
};

import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m"; // 15 minutes
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days in seconds

// @ts-ignore
export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const duplicate = await User.findOne({ $or: [{ username }, { email }] });

    if (duplicate) {
      return res
        .status(409)
        .json({ message: "Username or email already in use" });
    }

    // bcrypt password

    const hashedPassword = await bcrypt.hash(password, 10); // salt rounds = 10

    //create new user
    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    //return success response
    return res.status(204).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @ts-ignore
export const signIn = async (req, res) => {
  try {
    // take inputs
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // take hashed password from db to compare with password input
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ message: "username or passrord not correct" });
    }

    //check password with bcrypt
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "username or passrord not correct" });
    }

    //if correct , create access token with jwt
    const accessToken = jwt.sign(
      { userId: user._id },
      // @ts-ignore
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    // create refresh token with jwt
    const refreshToken = crypto.randomBytes(64).toString("hex");

    //create new session to store refresh token
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
    //return refesh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });
    //return access token in response
    return res.status(200).json({ message: "Sign in successful", accessToken });
  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @ts-ignore
export const signOut = async (req, res) => {
  try {
    // get refresh token from cookie
    const token = req.cookies?.refreshToken;

    //delete refresh token from Seession collection
    if (token) {
      await Session.findOneAndDelete({ refreshToken: token });
      //clear cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.status(204).json({ message: "Sign out successful" });
    }
  } catch (error) {
    console.error("Error during sign out:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

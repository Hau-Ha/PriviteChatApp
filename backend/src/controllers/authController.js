import bcrypt from "bcrypt";
import User from "../models/User.js";

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

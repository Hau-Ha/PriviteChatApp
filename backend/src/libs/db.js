import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_CONNECTIONSTRING;

    if (!uri) {
      throw new Error("Missing MONGODB_CONNECTIONSTRING in .env");
    }

    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

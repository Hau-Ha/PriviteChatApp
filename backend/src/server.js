import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

//middlewares
app.use(express.json());

//Public routes
app.use("/api/auth", authRoute);
//private routes

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server start from port ${PORT}`);
  });
});

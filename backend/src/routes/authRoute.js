import express from "express";
import { signUp } from "../controllers/authController.js";

const router = express.Router();

// Define auth routes here
router.post("/signup", signUp);

export default router;

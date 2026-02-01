import express from "express";
import { signUp, signIn, signOut } from "../controllers/authController.js";
import { sign } from "crypto";

const router = express.Router();

// Define auth routes here
router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/signout", signOut);
export default router;

import express from "express";
import {
  signUp,
  signIn,
  signOut,
  refreshToken,
} from "../controllers/authController.js";

const router = express.Router();

// Define auth routes here
router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/signout", signOut);

router.post("/refresh", refreshToken);
export default router;

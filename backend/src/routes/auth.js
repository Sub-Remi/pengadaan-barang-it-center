import express from "express";
import { login } from "../controller/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/login", login);

// Protected routes
router.get("/profile", authenticate);
router.put("/change-password", authenticate);


export default router;
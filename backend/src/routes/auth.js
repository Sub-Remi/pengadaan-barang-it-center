import express from "express";
import { login, getCurrentUser } from "../controller/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/login/login", login);
router.get("/me", authenticate, getCurrentUser); // TAMBAHKAN INI
// Protected routes
router.get("/profile", authenticate);
router.put("/change-password", authenticate);


export default router;
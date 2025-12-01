import express from "express";
import {
  getAllKategoriDropdown,
  getAllKategori,
  createKategori,
  deleteKategori
} from "../controller/kategoriController.js";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/roleAuth.js";

const router = express.Router();

// All routes require admin role
router.use(authenticate, requireAdmin);

// Get all kategori untuk dropdown
router.get("/dropdown", getAllKategoriDropdown);

// Get all kategori dengan pagination
router.get("/", getAllKategori);

// Create new kategori
router.post("/", createKategori);

// Delete kategori
router.delete("/:id", deleteKategori);

export default router;
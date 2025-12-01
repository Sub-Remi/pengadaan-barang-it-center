import express from "express";
import {
  getAllSatuanDropdown,
  getAllSatuan,
  createSatuan,
  deleteSatuan
} from "../controller/satuanController.js";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/roleAuth.js";

const router = express.Router();

// All routes require admin role
router.use(authenticate, requireAdmin);

// Get all satuan untuk dropdown
router.get("/dropdown", getAllSatuanDropdown);

// Get all satuan dengan pagination
router.get("/", getAllSatuan);

// Create new satuan
router.post("/", createSatuan);

// Delete satuan
router.delete("/:id", deleteSatuan);

export default router;
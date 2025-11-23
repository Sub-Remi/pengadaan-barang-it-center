import express from "express";
import {
  getDokumenForValidation,
  getValidatedDokumen,
  getDokumenDetailForValidation,
  validateDokumen,
  getValidatorStats,
  getPermintaanWithPemesanan,
} from "../controller/validatorController.js";

import { authenticate } from "../middleware/auth.js";
import { requireValidator } from "../middleware/roleAuth.js";

const router = express.Router();

// ==================== DASHBOARD & STATS ====================

// Get validator dashboard statistics
router.get("/stats", authenticate, requireValidator, getValidatorStats);

// ==================== VIEW PERMINTAAN ====================

// Get permintaan dengan barang dalam pemesanan
router.get(
  "/permintaan",
  authenticate,
  requireValidator,
  getPermintaanWithPemesanan
);

// ==================== DOKUMEN VALIDATION ====================

// Get dokumen yang perlu divalidasi
router.get(
  "/dokumen/pending",
  authenticate,
  requireValidator,
  getDokumenForValidation
);

// Get riwayat dokumen yang sudah divalidasi
router.get(
  "/dokumen/validated",
  authenticate,
  requireValidator,
  getValidatedDokumen
);

// Get detail dokumen untuk validasi
router.get(
  "/dokumen/:id",
  authenticate,
  requireValidator,
  getDokumenDetailForValidation
);

// Validasi dokumen (approve/reject)
router.put(
  "/dokumen/:id/validate",
  authenticate,
  requireValidator,
  validateDokumen
);

export default router;

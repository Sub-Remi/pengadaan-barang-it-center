import express from "express";
import {
  getDokumenForValidation,
  getValidatedDokumen,
  getDokumenDetailForValidation,
  validateDokumen,
  getValidatorStats,
  getPermintaanWithPemesanan,
  updatePemesananStatus,
  getPemesananForValidator,
} from "../controller/validatorController.js";

import {
  getAllPemesananForValidator,
  getPemesananDetail,
} from "../controller/pemesananController.js";

import { authenticate } from "../middleware/auth.js";
import { requireValidator } from "../middleware/roleAuth.js";
import { get } from "lodash-es";

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
  getPermintaanWithPemesanan,
  getPemesananForValidator
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

// ===== PEMESANAN VALIDATION =====
router.get(
  "/pemesanan",
  authenticate,
  requireValidator,
  getAllPemesananForValidator
);
router.get(
  "/pemesanan/:id",
  authenticate,
  requireValidator,
  getPemesananDetail
);

// Tambahkan route untuk update status pemesanan
router.put(
  "/pemesanan/:id/status",
  authenticate,
  requireValidator,
  updatePemesananStatus
);

export default router;

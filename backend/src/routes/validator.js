import express from "express";
import {
  getDokumenForValidation,
  getValidatedDokumen,
  getDokumenDetailForValidation,
  validateDokumen,
  getValidatorStats,
  getPermintaanWithPemesanan,
} from "../controller/validatorController.js";

import {
  getAllPemesananForValidator,
  getPemesananDetail,
} from "../controller/pemesananController.js";

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

// Temporary endpoint for validator pemesanan
router.get("/pemesanan", authenticate, requireValidator, async (req, res) => {
  try {
    console.log("📋 Validator getting pemesanan");

    // Temporary data
    const data = [];

    res.json({
      message: "Daftar pemesanan untuk validasi berhasil diambil.",
      data: data,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      },
    });
  } catch (error) {
    console.error("💥 Error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

export default router;

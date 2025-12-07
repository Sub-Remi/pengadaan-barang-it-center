import express from "express";
import kategoriRouter from "./kategori.js";
import satuanRouter from "./satuan.js";
import {
  getAllPermintaan,
  getPermintaanDetail,
  updatePermintaanStatus,
  updateBarangStatus,
  createPenerimaanBarang,
} from "../controller/adminController.js";
import {
  getAllStok,
  getStokDetail,
  createStok,
  updateStok,
  deleteStok,
  tambahStok,
  getAllBarang,
  getBarangDropdown,
} from "../controller/stokController.js";

import {
  getAllDivisi,
  getDivisiDropdown,
  getDivisiDetail,
  createDivisi,
  updateDivisi,
  deleteDivisi,
  getDivisiStats,
} from "../controller/divisiController.js";

import {
  getAllUsers,
  getUserDetail,
  createUser,
  updateUser,
  updateUserPassword,
  resetUserPassword,
  deleteUser,
  getUserStats,
} from "../controller/userController.js";

import {
  uploadDokumenPembelian,
  getDokumenByBarangPermintaan,
  getDokumenDetail,
  deleteDokumen,
  downloadDokumen,
  getDokumenStats,
} from "../controller/dokumenController.js";

import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/roleAuth.js";
import {
  uploadBuktiPenerimaan,
  uploadDokumenPembelian as uploadDokumenMiddleware,
  handleUploadError,
} from "../middleware/upload.js";

const router = express.Router();

// All routes require admin role
router.use(authenticate, requireAdmin);

// ===== PERMINTAAN MANAGEMENT =====
router.get("/permintaan", getAllPermintaan);
router.get("/permintaan/:id", getPermintaanDetail);
router.put("/permintaan/:id/status", updatePermintaanStatus);
router.put("/barang/:id/status", updateBarangStatus);

// ===== PENERIMAAN BARANG =====
router.post(
  "/penerimaan-barang",
  uploadBuktiPenerimaan.single("foto_bukti"),
  createPenerimaanBarang
);

// ===== STOK MANAGEMENT =====
router.get("/stok", getAllStok);
router.get("/stok/:id", getStokDetail);
router.post("/stok", createStok);
router.put("/stok/:id", updateStok);
router.delete("/stok/:id", deleteStok);

// ===== DIVISI MANAGEMENT =====
// Get all divisi dengan pagination
router.get("/divisi", authenticate, requireAdmin, getAllDivisi);

// Get divisi untuk dropdown
router.get("/divisi/dropdown", authenticate, requireAdmin, getDivisiDropdown);

// Get divisi statistics
router.get("/divisi/stats", authenticate, requireAdmin, getDivisiStats);

// Get divisi detail
router.get("/divisi/:id", authenticate, requireAdmin, getDivisiDetail);

// Create new divisi
router.post("/divisi", authenticate, requireAdmin, createDivisi);

// Update divisi
router.put("/divisi/:id", authenticate, requireAdmin, updateDivisi);

// Delete divisi
router.delete("/divisi/:id", authenticate, requireAdmin, deleteDivisi);

// ==================== ROUTES USER MANAGEMENT ====================

// Get all users dengan pagination dan filter
router.get("/users", authenticate, requireAdmin, getAllUsers);

// Get user statistics
router.get("/users/stats", authenticate, requireAdmin, getUserStats);

// Get user detail
router.get("/users/:id", authenticate, requireAdmin, getUserDetail);

// Create new user
router.post("/users", authenticate, requireAdmin, createUser);

// Update user
router.put("/users/:id", authenticate, requireAdmin, updateUser);

// Delete user
router.delete("/users/:id", authenticate, requireAdmin, deleteUser);

// Update user password
router.put(
  "/users/:id/password",
  authenticate,
  requireAdmin,
  updateUserPassword
);

// Reset user password to default
router.post(
  "/users/:id/reset-password",
  authenticate,
  requireAdmin,
  resetUserPassword
);

// ==================== ROUTES DOKUMEN PEMBELIAN ====================

// Upload dokumen pembelian (PO, Nota, dll) - SIMPLIFIED
router.post(
  "/dokumen-pembelian",
  authenticate,
  requireAdmin,
  uploadDokumenMiddleware.single("file_dokumen"),
  handleUploadError,
  uploadDokumenPembelian
);

// Get dokumen by barang_permintaan_id
router.get(
  "/dokumen/barang/:barang_permintaan_id",
  authenticate,
  requireAdmin,
  getDokumenByBarangPermintaan
);

// Get dokumen statistics
router.get("/dokumen/stats", authenticate, requireAdmin, getDokumenStats);

// Get dokumen detail
router.get("/dokumen/:id", authenticate, requireAdmin, getDokumenDetail);

// Delete dokumen
router.delete("/dokumen/:id", authenticate, requireAdmin, deleteDokumen);

// Download dokumen
router.get(
  "/dokumen/:id/download",
  authenticate,
  requireAdmin,
  downloadDokumen
);

// ===== KATEGORI BARANG =====
router.use("/kategori", kategoriRouter);

// ===== SATUAN BARANG =====
router.use("/satuan", satuanRouter);

// ===== STOK BARANG =====
// Update existing routes
router.get("/stok", authenticate, requireAdmin, getAllStok);
router.get("/stok/:id", authenticate, requireAdmin, getStokDetail);
router.post("/stok", authenticate, requireAdmin, createStok);
router.put("/stok/:id", authenticate, requireAdmin, updateStok);
router.put("/stok/:id/tambah", authenticate, requireAdmin, tambahStok);
router.delete("/stok/:id", authenticate, requireAdmin, deleteStok);

// Di file admin.js, tambahkan routes untuk Data Barang:

// ===== DATA BARANG =====
// Get all barang untuk halaman Data Barang
router.get("/barang", authenticate, requireAdmin, getAllBarang);

// Get barang untuk dropdown
router.get("/barang/dropdown", authenticate, requireAdmin, getBarangDropdown);

// Get detail barang
router.get("/barang/:id", authenticate, requireAdmin, getStokDetail); // Reuse dari stokController

// Create barang (dari halaman Data Barang)
router.post("/barang", authenticate, requireAdmin, createStok); // Reuse dari stokController

// Update barang (dari halaman Data Barang)
router.put("/barang/:id", authenticate, requireAdmin, updateStok); // Reuse dari stokController

// Delete barang
router.delete("/barang/:id", authenticate, requireAdmin, deleteStok); // Reuse dari stokController

export default router;

import express from "express";
import dbPool from "../config/database.js";
import {
  getAllKategoriDropdown,
  getAllKategori,
  createKategori,
  deleteKategori,
} from "../controller/kategoriController.js";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/roleAuth.js";

const router = express.Router();

// ✅ ROUTE PUBLIK - TANPA AUTHENTIKASI
// Get all kategori barang (untuk dropdown pemohon)
router.get("/public", async (req, res) => {
  try {
    const [rows] = await dbPool.execute(
      "SELECT * FROM kategori_barang ORDER BY nama_kategori"
    );
    res.json({
      message: "Kategori barang berhasil diambil",
      data: rows,
    });
  } catch (error) {
    console.error("❌ Get kategori error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// Search kategori (untuk dropdown pemohon)
router.get("/public/search", async (req, res) => {
  try {
    const { q } = req.query;
    const query = `
      SELECT * FROM kategori_barang 
      WHERE nama_kategori LIKE ? 
      ORDER BY nama_kategori
    `;
    const [rows] = await dbPool.execute(query, [`%${q || ""}%`]);
    res.json({
      message: "Kategori berhasil dicari",
      data: rows,
    });
  } catch (error) {
    console.error("❌ Search kategori error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// ========== ROUTE ADMIN ONLY ==========
router.use(authenticate, requireAdmin);

// Get all kategori untuk dropdown (admin)
router.get("/dropdown", getAllKategoriDropdown);

// Get all kategori dengan pagination (admin)
router.get("/", getAllKategori);

// Create new kategori (admin)
router.post("/", createKategori);

// Delete kategori (admin)
router.delete("/:id", deleteKategori);

export default router;

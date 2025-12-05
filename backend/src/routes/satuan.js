import express from "express";
import dbPool from "../config/database.js";
import {
  getAllSatuanDropdown,
  getAllSatuan,
  createSatuan,
  deleteSatuan,
} from "../controller/satuanController.js";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/roleAuth.js";

const router = express.Router();

// ✅ ROUTE PUBLIK - TANPA AUTHENTIKASI
// Get all satuan barang (untuk dropdown pemohon)
router.get("/public", async (req, res) => {
  try {
    const [rows] = await dbPool.execute(
      "SELECT * FROM satuan_barang ORDER BY nama_satuan"
    );
    res.json({
      message: "Satuan barang berhasil diambil",
      data: rows,
    });
  } catch (error) {
    console.error("❌ Get satuan error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// Search satuan (untuk dropdown pemohon)
router.get("/public/search", async (req, res) => {
  try {
    const { q } = req.query;
    const query = `
      SELECT * FROM satuan_barang 
      WHERE nama_satuan LIKE ? 
      ORDER BY nama_satuan
    `;
    const [rows] = await dbPool.execute(query, [`%${q || ""}%`]);
    res.json({
      message: "Satuan berhasil dicari",
      data: rows,
    });
  } catch (error) {
    console.error("❌ Search satuan error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// ========== ROUTE ADMIN ONLY ==========
router.use(authenticate, requireAdmin);

// Get all satuan untuk dropdown (admin)
router.get("/dropdown", getAllSatuanDropdown);

// Get all satuan dengan pagination (admin)
router.get("/", getAllSatuan);

// Create new satuan (admin)
router.post("/", createSatuan);

// Delete satuan (admin)
router.delete("/:id", deleteSatuan);

export default router;

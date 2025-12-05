import express from "express";
import dbPool from "../config/database.js";

const router = express.Router();

// Get all stok barang untuk dropdown
router.get("/dropdown", async (req, res) => {
  try {
    const { q } = req.query;

    let query = `
      SELECT 
        sb.*,
        kb.nama_kategori,
        sbu.nama_satuan,
        sb.stok as stok_available
      FROM stok_barang sb
      JOIN kategori_barang kb ON sb.kategori_barang_id = kb.id
      JOIN satuan_barang sbu ON sb.satuan_barang_id = sbu.id
    `;

    const params = [];

    if (q) {
      query += ` WHERE sb.nama_barang LIKE ? OR sb.kode_barang LIKE ?`;
      params.push(`%${q}%`, `%${q}%`);
    }

    query += ` ORDER BY sb.nama_barang`;

    const [rows] = await dbPool.execute(query, params);

    res.json({
      message: "Stok barang berhasil diambil",
      data: rows,
    });
  } catch (error) {
    console.error("❌ Get stok dropdown error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// Get stok barang by kategori
router.get("/by-kategori/:kategori_id", async (req, res) => {
  try {
    const { kategori_id } = req.params;
    const { q } = req.query;

    let query = `
      SELECT 
        sb.*,
        kb.nama_kategori,
        sbu.nama_satuan,
        sb.stok as stok_available
      FROM stok_barang sb
      JOIN kategori_barang kb ON sb.kategori_barang_id = kb.id
      JOIN satuan_barang sbu ON sb.satuan_barang_id = sbu.id
      WHERE sb.kategori_barang_id = ?
    `;

    const params = [kategori_id];

    if (q) {
      query += ` AND (sb.nama_barang LIKE ? OR sb.kode_barang LIKE ?)`;
      params.push(`%${q}%`, `%${q}%`);
    }

    query += ` ORDER BY sb.nama_barang`;

    const [rows] = await dbPool.execute(query, params);

    res.json({
      message: "Stok barang by kategori berhasil diambil",
      data: rows,
    });
  } catch (error) {
    console.error("❌ Get stok by kategori error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

export default router;

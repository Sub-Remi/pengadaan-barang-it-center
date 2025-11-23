import StokBarang from "../models/stok_barang.js";
import dbPool from "../config/database.js";

// Get all stok dengan pagination
export const getAllStok = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    console.log("📦 Admin getting all stok, page:", page, "search:", search);

    const result = await StokBarang.findAllWithPagination(page, limit, search);

    res.json({
      message: "Daftar stok barang berhasil diambil.",
      data: result.data,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: result.limit,
      },
    });
  } catch (error) {
    console.error("💥 Get all stok error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Get stok detail
export const getStokDetail = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔍 Getting stok detail:", id);

    const stok = await StokBarang.findById(id);

    if (!stok) {
      return res.status(404).json({ error: "Stok barang tidak ditemukan." });
    }

    res.json({
      message: "Detail stok barang berhasil diambil.",
      data: stok,
    });
  } catch (error) {
    console.error("💥 Get stok detail error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Create new stok
export const createStok = async (req, res) => {
  try {
    const {
      kode_barang,
      kategori_barang,
      nama_barang,
      spesifikasi,
      satuan,
      stok,
      stok_minimum,
    } = req.body;

    console.log("🆕 Creating new stok:", { kode_barang, nama_barang });

    // Validasi input
    if (!kode_barang || !kategori_barang || !nama_barang || !satuan) {
      return res.status(400).json({
        error: "Kode, kategori, nama barang, dan satuan harus diisi.",
      });
    }

    // Cek apakah kode barang sudah ada
    const existingStok = await StokBarang.findByKodeBarang(kode_barang);
    if (existingStok) {
      return res.status(400).json({ error: "Kode barang sudah digunakan." });
    }

    const stokId = await StokBarang.create({
      kode_barang,
      kategori_barang,
      nama_barang,
      spesifikasi: spesifikasi || "",
      satuan,
      stok: parseInt(stok) || 0,
      stok_minimum: parseInt(stok_minimum) || 0,
    });

    console.log("✅ Stok created with ID:", stokId);

    res.status(201).json({
      message: "Stok barang berhasil dibuat.",
      data: { id: stokId },
    });
  } catch (error) {
    console.error("💥 Create stok error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Update stok
export const updateStok = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      kategori_barang,
      nama_barang,
      spesifikasi,
      satuan,
      stok,
      stok_minimum,
    } = req.body;

    console.log("✏️ Updating stok:", id);

    // Validasi input
    if (!kategori_barang || !nama_barang || !satuan) {
      return res
        .status(400)
        .json({ error: "Kategori, nama barang, dan satuan harus diisi." });
    }

    const affectedRows = await StokBarang.update(id, {
      kategori_barang,
      nama_barang,
      spesifikasi: spesifikasi || "",
      satuan,
      stok: parseInt(stok) || 0,
      stok_minimum: parseInt(stok_minimum) || 0,
    });

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Stok barang tidak ditemukan." });
    }

    res.json({ message: "Stok barang berhasil diupdate." });
  } catch (error) {
    console.error("💥 Update stok error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Delete stok
export const deleteStok = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🗑️ Deleting stok:", id);

    const affectedRows = await StokBarang.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Stok barang tidak ditemukan." });
    }

    res.json({ message: "Stok barang berhasil dihapus." });
  } catch (error) {
    console.error("💥 Delete stok error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Add this function to StokBarang model
StokBarang.findByKodeBarang = async (kode_barang) => {
  const query = "SELECT * FROM stok_barang WHERE kode_barang = ?";
  const [rows] = await dbPool.execute(query, [kode_barang]);
  return rows[0];
};

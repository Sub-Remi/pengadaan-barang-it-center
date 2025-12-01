import StokBarang from "../models/stok_barang.js";
import KategoriBarang from "../models/kategori_barang.js";
import SatuanBarang from "../models/satuan_barang.js";

// Get all stok dengan join kategori dan satuan
export const getAllStok = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const kategori_id = req.query.kategori_id || "";
    const satuan_id = req.query.satuan_id || "";
    
    const result = await StokBarang.findAllWithPagination(
      page, limit, search, kategori_id, satuan_id
    );
    
    // Get all kategori dan satuan untuk filter dropdown
    const [allKategori, allSatuan] = await Promise.all([
      KategoriBarang.findAll(),
      SatuanBarang.findAll()
    ]);
    
    res.json({
      success: true,
      message: "Daftar stok barang berhasil diambil.",
      data: result.data,
      filters: {
        kategori: allKategori,
        satuan: allSatuan
      },
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: result.limit
      }
    });
  } catch (error) {
    console.error("💥 Get all stok error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server."
    });
  }
};

// Get detail stok
export const getStokDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    const stok = await StokBarang.findById(id);
    
    if (!stok) {
      return res.status(404).json({
        success: false,
        error: "Stok barang tidak ditemukan."
      });
    }
    
    res.json({
      success: true,
      message: "Detail stok barang berhasil diambil.",
      data: stok
    });
  } catch (error) {
    console.error("💥 Get stok detail error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server."
    });
  }
};

// Create new stok
export const createStok = async (req, res) => {
  try {
    const {
      kategori_barang_id,
      nama_barang,
      spesifikasi,
      satuan_barang_id,
      stok,
      stok_minimum
    } = req.body;
    
    // Validasi input
    if (!kategori_barang_id || !nama_barang || !satuan_barang_id) {
      return res.status(400).json({
        success: false,
        error: "Kategori, nama barang, dan satuan harus diisi."
      });
    }
    
    // Cek apakah kategori dan satuan valid
    const [kategori, satuan] = await Promise.all([
      KategoriBarang.findById(kategori_barang_id),
      SatuanBarang.findById(satuan_barang_id)
    ]);
    
    if (!kategori) {
      return res.status(400).json({
        success: false,
        error: "Kategori tidak ditemukan."
      });
    }
    
    if (!satuan) {
      return res.status(400).json({
        success: false,
        error: "Satuan tidak ditemukan."
      });
    }
    
    // Create stok
    const stokId = await StokBarang.create({
      kategori_barang_id,
      nama_barang: nama_barang.trim(),
      spesifikasi: spesifikasi?.trim() || "",
      satuan_barang_id,
      stok: parseInt(stok) || 0,
      stok_minimum: parseInt(stok_minimum) || 0
    });
    
    res.status(201).json({
      success: true,
      message: "Stok barang berhasil ditambahkan.",
      data: { id: stokId }
    });
  } catch (error) {
    console.error("💥 Create stok error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server."
    });
  }
};

// Update stok (tidak termasuk kode_barang dan stok)
export const updateStok = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      kategori_barang_id,
      nama_barang,
      spesifikasi,
      satuan_barang_id,
      stok_minimum
    } = req.body;
    
    // Validasi input
    if (!kategori_barang_id || !nama_barang || !satuan_barang_id) {
      return res.status(400).json({
        success: false,
        error: "Kategori, nama barang, dan satuan harus diisi."
      });
    }
    
    // Cek apakah stok ada
    const existingStok = await StokBarang.findById(id);
    if (!existingStok) {
      return res.status(404).json({
        success: false,
        error: "Stok barang tidak ditemukan."
      });
    }
    
    // Cek apakah kategori dan satuan valid
    const [kategori, satuan] = await Promise.all([
      KategoriBarang.findById(kategori_barang_id),
      SatuanBarang.findById(satuan_barang_id)
    ]);
    
    if (!kategori) {
      return res.status(400).json({
        success: false,
        error: "Kategori tidak ditemukan."
      });
    }
    
    if (!satuan) {
      return res.status(400).json({
        success: false,
        error: "Satuan tidak ditemukan."
      });
    }
    
    // Update stok
    const affectedRows = await StokBarang.update(id, {
      kategori_barang_id,
      nama_barang: nama_barang.trim(),
      spesifikasi: spesifikasi?.trim() || "",
      satuan_barang_id,
      stok_minimum: parseInt(stok_minimum) || 0
    });
    
    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        error: "Gagal mengupdate stok barang."
      });
    }
    
    res.json({
      success: true,
      message: "Stok barang berhasil diupdate."
    });
  } catch (error) {
    console.error("💥 Update stok error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server."
    });
  }
};

// Tambah stok quantity
export const tambahStok = async (req, res) => {
  try {
    const { id } = req.params;
    const { tambah_stok } = req.body;
    
    if (!tambah_stok || tambah_stok <= 0) {
      return res.status(400).json({
        success: false,
        error: "Jumlah stok yang ditambahkan harus lebih dari 0."
      });
    }
    
    const result = await StokBarang.updateStokQuantity(id, tambah_stok);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "Stok barang tidak ditemukan."
      });
    }
    
    res.json({
      success: true,
      message: `Stok berhasil ditambahkan ${tambah_stok} unit.`,
      data: { new_stok: result.newStok }
    });
  } catch (error) {
    console.error("💥 Tambah stok error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Terjadi kesalahan server."
    });
  }
};

// Delete stok
export const deleteStok = async (req, res) => {
  try {
    const { id } = req.params;
    
    const affectedRows = await StokBarang.delete(id);
    
    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "Stok barang tidak ditemukan."
      });
    }
    
    res.json({
      success: true,
      message: "Stok barang berhasil dihapus."
    });
  } catch (error) {
    console.error("💥 Delete stok error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server."
    });
  }
};
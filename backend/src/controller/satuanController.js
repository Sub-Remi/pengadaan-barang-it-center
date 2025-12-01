import SatuanBarang from "../models/satuan_barang.js";

// Get all satuan untuk dropdown
export const getAllSatuanDropdown = async (req, res) => {
  try {
    const satuanList = await SatuanBarang.findAll();
    res.json({
      success: true,
      message: "Daftar satuan berhasil diambil.",
      data: satuanList
    });
  } catch (error) {
    console.error("💥 Get satuan dropdown error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server."
    });
  }
};

// Get all satuan dengan pagination untuk tabel
export const getAllSatuan = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    
    const result = await SatuanBarang.findAllWithPagination(page, limit, search);
    
    res.json({
      success: true,
      message: "Daftar satuan berhasil diambil.",
      data: result.data,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: result.limit
      }
    });
  } catch (error) {
    console.error("💥 Get all satuan error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server."
    });
  }
};

// Create new satuan
export const createSatuan = async (req, res) => {
  try {
    const { nama_satuan } = req.body;
    
    if (!nama_satuan || nama_satuan.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Nama satuan harus diisi."
      });
    }
    
    // Cek apakah nama satuan sudah ada
    const existingSatuan = await SatuanBarang.findByNama(nama_satuan.trim());
    if (existingSatuan) {
      return res.status(400).json({
        success: false,
        error: "Nama satuan sudah terdaftar."
      });
    }
    
    const satuanId = await SatuanBarang.create(nama_satuan.trim());
    
    res.status(201).json({
      success: true,
      message: "Satuan berhasil ditambahkan.",
      data: { id: satuanId, nama_satuan: nama_satuan.trim() }
    });
  } catch (error) {
    console.error("💥 Create satuan error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server."
    });
  }
};

// Delete satuan
export const deleteSatuan = async (req, res) => {
  try {
    const { id } = req.params;
    
    const affectedRows = await SatuanBarang.delete(id);
    
    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "Satuan tidak ditemukan."
      });
    }
    
    res.json({
      success: true,
      message: "Satuan berhasil dihapus."
    });
  } catch (error) {
    console.error("💥 Delete satuan error:", error);
    
    if (error.message.includes("masih digunakan")) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server."
    });
  }
};
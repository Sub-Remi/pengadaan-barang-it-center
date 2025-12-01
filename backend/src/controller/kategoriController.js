import KategoriBarang from "../models/kategori_barang.js";

// Get all kategori untuk dropdown
export const getAllKategoriDropdown = async (req, res) => {
  try {
    const kategoriList = await KategoriBarang.findAll();
    res.json({
      success: true,
      message: "Daftar kategori berhasil diambil.",
      data: kategoriList
    });
  } catch (error) {
    console.error("💥 Get kategori dropdown error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server."
    });
  }
};

// Get all kategori dengan pagination untuk tabel
export const getAllKategori = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    
    const result = await KategoriBarang.findAllWithPagination(page, limit, search);
    
    res.json({
      success: true,
      message: "Daftar kategori berhasil diambil.",
      data: result.data,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: result.limit
      }
    });
  } catch (error) {
    console.error("💥 Get all kategori error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server."
    });
  }
};

// Create new kategori
export const createKategori = async (req, res) => {
  try {
    const { nama_kategori } = req.body;
    
    if (!nama_kategori || nama_kategori.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Nama kategori harus diisi."
      });
    }
    
    // Cek apakah nama kategori sudah ada
    const existingKategori = await KategoriBarang.findByNama(nama_kategori.trim());
    if (existingKategori) {
      return res.status(400).json({
        success: false,
        error: "Nama kategori sudah terdaftar."
      });
    }
    
    const kategoriId = await KategoriBarang.create(nama_kategori.trim());
    
    res.status(201).json({
      success: true,
      message: "Kategori berhasil ditambahkan.",
      data: { id: kategoriId, nama_kategori: nama_kategori.trim() }
    });
  } catch (error) {
    console.error("💥 Create kategori error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server."
    });
  }
};

// Delete kategori
export const deleteKategori = async (req, res) => {
  try {
    const { id } = req.params;
    
    const affectedRows = await KategoriBarang.delete(id);
    
    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "Kategori tidak ditemukan."
      });
    }
    
    res.json({
      success: true,
      message: "Kategori berhasil dihapus."
    });
  } catch (error) {
    console.error("💥 Delete kategori error:", error);
    
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
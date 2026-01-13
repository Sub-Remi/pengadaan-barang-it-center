import Permintaan from "../models/permintaan.js";
import BarangPermintaan from "../models/barang_permintaan.js";
import StokBarang from "../models/stok_barang.js";
import PenerimaanBarang from "../models/penerimaan_barang.js";
import dbPool from "../config/database.js";

// Get all permintaan dengan filter untuk admin
export const getAllPermintaan = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "terbaru"; // Tambah parameter sort
    const status = req.query.status;

    // Filters
    const filters = {
      status: req.query.status,
      divisi_id: req.query.divisi_id,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      search: req.query.search,
      status: req.query.status,
    };

    console.log("📋 Admin getting all permintaan with filters:", {
      ...filters,
      sort,
    });

    // Kirim parameter sort ke model
    const result = await Permintaan.findAllWithFilters(
      filters,
      page,
      limit,
      sort
    );

    res.json({
      message: "Daftar permintaan berhasil diambil.",
      data: result.data,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: result.limit,
      },
    });
  } catch (error) {
    console.error("💥 Get all permintaan error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Get detail permintaan untuk admin
export const getPermintaanDetail = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔍 Admin getting permintaan detail:", id);

    // Get permintaan detail
    const query = `
      SELECT p.*, u.nama_lengkap, u.email, d.nama_divisi 
      FROM permintaan p 
      JOIN users u ON p.user_id = u.id 
      JOIN divisi d ON u.divisi_id = d.id 
      WHERE p.id = ?
    `;

    const [permintaanRows] = await dbPool.execute(query, [id]);
    const permintaan = permintaanRows[0];

    if (!permintaan) {
      return res.status(404).json({ error: "Permintaan tidak ditemukan." });
    }

    // Get barang-barang dalam permintaan
    const barangList = await BarangPermintaan.findByPermintaanId(id);

    res.json({
      message: "Detail permintaan berhasil diambil.",
      data: {
        ...permintaan,
        barang: barangList,
      },
    });
  } catch (error) {
    console.error("💥 Get permintaan detail error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Update status permintaan
export const updatePermintaanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("🔄 Admin updating permintaan status:", { id, status });

    if (!status) {
      return res.status(400).json({ error: "Status harus diisi." });
    }

    const validStatuses = ["menunggu", "diproses", "selesai", "ditolak"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Status tidak valid." });
    }

    const affectedRows = await Permintaan.updateStatus(id, status);

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Permintaan tidak ditemukan." });
    }

    res.json({
      message: `Status permintaan berhasil diubah menjadi ${status}.`,
    });
  } catch (error) {
    console.error("💥 Update permintaan status error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

export const updateBarangStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan_admin } = req.body;
    const userId = req.user.id;

    console.log("🔄 Admin updating barang status:", {
      id,
      status,
      catatan_admin,
      userId,
    });

    if (!status) {
      return res.status(400).json({ error: "Status harus diisi." });
    }

    const validStatuses = [
      "menunggu validasi",
      "diproses",
      "dalam pemesanan",
      "selesai",
      "ditolak",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Status tidak valid." });
    }

    // Untuk status 'ditolak', wajib catatan
    if (
      status === "ditolak" &&
      (!catatan_admin || catatan_admin.trim() === "")
    ) {
      return res.status(400).json({
        error: "Harap berikan catatan penolakan.",
      });
    }

    // Gunakan fungsi baru yang menangani stok dan status permintaan
    const result = await BarangPermintaan.updateStatusWithStok(
      id,
      status,
      catatan_admin,
      userId
    );

    // Langsung return response tanpa mengambil data lagi
    res.json({
      message: `Status barang berhasil diubah menjadi ${status}.`,
      data: {
        barang_id: id,
        new_status: status,
        permintaan_status: result.permintaanStatus || "diproses",
        stok_updated: status === "selesai",
      },
    });
  } catch (error) {
    console.error("💥 Update barang status error:", error);

    // Tampilkan error detail untuk debugging
    console.error("Error stack:", error.stack);

    res.status(500).json({
      error: "Terjadi kesalahan server.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Buat form penerimaan barang
export const createPenerimaanBarang = async (req, res) => {
  try {
    // DEBUG: Lihat seluruh request body dan file
    console.log("📦 Full request body:", req.body);
    console.log("📦 Request file:", req.file);
    console.log("📦 All request fields:", Object.keys(req.body));
    const {
      barang_permintaan_id,
      tanggal_penerimaan,
      penerima,
      nama_barang,
      spesifikasi,
      jumlah_dipesan,
      jumlah_diterima,
      diperiksa_oleh,
      tanggal_pemeriksaan,
    } = req.body;

    const foto_bukti = req.file ? req.file.path : null;

    console.log("📦 Admin creating penerimaan barang:", {
      barang_permintaan_id,
      tanggal_penerimaan,
      penerima,
      nama_barang,
      spesifikasi,
      jumlah_dipesan,
      jumlah_diterima,
      diperiksa_oleh,
      tanggal_pemeriksaan,
      foto_bukti,
    });

    // Validasi input
    if (
      !barang_permintaan_id ||
      !tanggal_penerimaan ||
      !penerima ||
      !nama_barang ||
      !jumlah_dipesan ||
      !jumlah_diterima ||
      !diperiksa_oleh ||
      !tanggal_pemeriksaan
    ) {
      console.log("❌ Missing required fields:", {
        barang_permintaan_id: !!barang_permintaan_id,
        tanggal_penerimaan: !!tanggal_penerimaan,
        penerima: !!penerima,
        nama_barang: !!nama_barang,
        jumlah_dipesan: !!jumlah_dipesan,
        jumlah_diterima: !!jumlah_diterima,
        diperiksa_oleh: !!diperiksa_oleh,
        tanggal_pemeriksaan: !!tanggal_pemeriksaan,
      });
      return res
        .status(400)
        .json({ error: "Semua field harus diisi kecuali foto bukti." });
    }

    // Cek apakah barang permintaan ada
    const barang = await BarangPermintaan.findById(barang_permintaan_id);
    if (!barang) {
      return res
        .status(404)
        .json({ error: "Barang permintaan tidak ditemukan." });
    }

    // Buat penerimaan barang
    const penerimaanId = await PenerimaanBarang.create({
      barang_permintaan_id,
      tanggal_penerimaan,
      penerima,
      nama_barang,
      spesifikasi: spesifikasi || barang.spesifikasi,
      jumlah_dipesan,
      jumlah_diterima,
      diperiksa_oleh,
      tanggal_pemeriksaan,
      foto_bukti,
    });

    // Update barang permintaan sebagai sudah diterima
    await BarangPermintaan.markAsReceived(barang_permintaan_id, penerimaanId);

    // Update stok jika barang ada di stok
    const stokBarang = await StokBarang.findByNamaAndSpesifikasi(
      nama_barang,
      spesifikasi
    );
    if (stokBarang) {
      const newStok = stokBarang.stok + parseInt(jumlah_diterima);
      await StokBarang.updateStokQuantity(stokBarang.id, newStok);
    }

    console.log("✅ Penerimaan barang created with ID:", penerimaanId);

    res.status(201).json({
      message: "Form penerimaan barang berhasil dibuat.",
      data: { id: penerimaanId },
    });
  } catch (error) {
    console.error("💥 Create penerimaan barang error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// We need to add this function to StokBarang model
// Add this to src/models/stok_barang.js
StokBarang.findByNamaAndSpesifikasi = async (nama_barang, spesifikasi) => {
  const query =
    "SELECT * FROM stok_barang WHERE nama_barang = ? AND spesifikasi = ?";
  const [rows] = await dbPool.execute(query, [nama_barang, spesifikasi]);
  return rows[0];
};

// Contoh controller di backend
const getDashboardStats = async (req, res) => {
  try {
    const [
      permintaanBaru,
      permintaanDiproses,
      totalBarang,
      totalPemesanan,
      totalDivisi,
      totalUser
    ] = await Promise.all([
      Permintaan.count({ where: { status: 'menunggu' } }),
      Permintaan.count({ where: { status: 'diproses' } }),
      Barang.count(),
      Pemesanan.count(),
      Divisi.count(),
      User.count()
    ]);

    res.json({
      success: true,
      data: {
        permintaanBaru,
        permintaanDiproses,
        totalBarang,
        totalPemesanan,
        totalDivisi,
        totalUser
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Endpoint: GET /api/finance/dashboard/stats
const getFinanceDashboardStats = async (req, res) => {
  try {
    const [
      totalPemesanan,
      pemesananDiproses,
      pemesananSelesai,
      pemesananDitolak
    ] = await Promise.all([
      Pemesanan.count(),
      Pemesanan.count({ where: { status: 'diproses' } }),
      Pemesanan.count({ where: { status: 'selesai' } }),
      Pemesanan.count({ where: { status: 'ditolak' } })
    ]);

    res.json({
      success: true,
      data: {
        totalPemesanan,
        pemesananDiproses,
        pemesananSelesai,
        pemesananDitolak
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// adminController.js - Pastikan getRiwayatPermintaan sudah benar
export const getRiwayatPermintaan = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "terbaru";

    // Filters untuk riwayat
    const filters = {
      divisi_id: req.query.divisi_id,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      search: req.query.search,
      status: req.query.status,
    };

    console.log("📋 Admin getting riwayat permintaan with filters:", {
      ...filters,
      sort,
      page,
      limit
    });

    // Gunakan fungsi khusus untuk riwayat
    const result = await Permintaan.findAllRiwayatWithFilters(
      filters,
      page,
      limit,
      sort
    );

    console.log("📊 Riwayat result:", {
      total: result.total,
      total: result.total,
      dataLength: result.data.length,
      sample: result.data.length > 0 ? {
        id: result.data[0].id,
        nomor_permintaan: result.data[0].nomor_permintaan,
        status: result.data[0].status,
        // Untuk debug, tampilkan beberapa data pertama
        firstThreeStatuses: result.data.slice(0, 3).map(item => item.status)
      } : 'No data'
    });

    res.json({
      message: "Daftar riwayat permintaan berhasil diambil.",
      data: result.data,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: result.limit,
      },
    });
  } catch (error) {
    console.error("💥 Get riwayat permintaan error:", error);
    res.status(500).json({ 
      error: "Terjadi kesalahan server.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default {
  getAllPermintaan,
  getPermintaanDetail,
  updatePermintaanStatus,
  updateBarangStatus,
  createPenerimaanBarang,
  getRiwayatPermintaan,
};

import Pemesanan from "../models/pemesanan.js";
import BarangPermintaan from "../models/barang_permintaan.js";
import DokumenPembelian from "../models/dokumen_pembelian.js";
import dbPool from "../config/database.js";

// Create pemesanan (when admin clicks "Ajukan Pembelian")
export const createPemesanan = async (req, res) => {
  try {
    const {
      barang_permintaan_id,
      tanggal_pemesanan,
      estimasi_selesai,
      catatan,
    } = req.body;
    const admin_id = req.user.id;

    console.log("🛒 Creating pemesanan:", {
      barang_permintaan_id,
      admin_id,
      tanggal_pemesanan,
    });

    // Validasi input
    if (!barang_permintaan_id || !tanggal_pemesanan) {
      return res.status(400).json({
        error: "barang_permintaan_id dan tanggal_pemesanan harus diisi",
      });
    }

    // Cek apakah barang sudah ada di pemesanan
    try {
      const existingPemesanan = await Pemesanan.findByBarangPermintaanId(
        barang_permintaan_id
      );
      if (existingPemesanan) {
        return res.status(400).json({
          error: "Barang ini sudah diajukan untuk pembelian sebelumnya.",
        });
      }
    } catch (error) {
      console.log(
        "⚠️ Error checking existing pemesanan, mungkin tabel belum ada:",
        error.message
      );
      // Lanjutkan karena mungkin tabel belum ada
    }

    // Buat record pemesanan
    const pemesananId = await Pemesanan.create({
      barang_permintaan_id,
      admin_id,
      tanggal_pemesanan,
      estimasi_selesai,
      catatan,
    });

    // Update status barang menjadi "dalam pemesanan"
    await BarangPermintaan.updateStatus(
      barang_permintaan_id,
      "dalam pemesanan"
    );

    res.status(201).json({
      message: "Pemesanan berhasil diajukan.",
      data: {
        id: pemesananId,
        status: "dalam pemesanan",
      },
    });
  } catch (error) {
    console.error("💥 Create pemesanan error:", error);

    // Berikan pesan error yang lebih informatif
    let errorMessage = "Terjadi kesalahan server.";
    if (error.code === "ER_NO_SUCH_TABLE") {
      errorMessage =
        "Tabel database belum dibuat. Silakan hubungi administrator.";
    } else if (error.code === "ER_PARSE_ERROR") {
      errorMessage = "Error syntax SQL. Silakan perbaiki query.";
    }

    res.status(500).json({
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get all pemesanan for admin
export const getAllPemesananForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = {
      status: req.query.status || "",
      start_date: req.query.start_date || "",
      end_date: req.query.end_date || "",
      search: req.query.search || "",
    };

    console.log("📋 Admin getting all pemesanan:", filters);

    const result = await Pemesanan.findAllForAdmin(page, limit, filters);

    res.json({
      message: "Daftar pemesanan berhasil diambil.",
      data: result.data,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: result.limit,
      },
    });
  } catch (error) {
    console.error("💥 Get pemesanan for admin error:", error);
    res.status(500).json({
      error: "Terjadi kesalahan server.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get all pemesanan for validator (with pending documents)
export const getAllPemesananForValidator = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = {
      jenis_dokumen: req.query.jenis_dokumen || "",
      start_date: req.query.start_date || "",
      end_date: req.query.end_date || "",
      search: req.query.search || "",
    };

    console.log("📋 Validator getting pemesanan with filters:", filters);

    const result = await Pemesanan.findAllForValidator(page, limit, filters);

    res.json({
      message: "Daftar pemesanan untuk validasi berhasil diambil.",
      data: result.data,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: result.limit,
      },
    });
  } catch (error) {
    console.error("💥 Get pemesanan for validator error:", error);
    res.status(500).json({
      error: "Terjadi kesalahan server.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get detail pemesanan dengan data lengkap
export const getPemesananDetail = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔍 Getting pemesanan detail:", id);

    const pemesanan = await Pemesanan.findById(id);
    if (!pemesanan) {
      return res.status(404).json({ error: "Pemesanan tidak ditemukan." });
    }

    // Get barang detail
    const barangQuery = `
      SELECT bp.*, kb.nama_kategori, sbu.nama_satuan
      FROM barang_permintaan bp
      LEFT JOIN stok_barang sb ON bp.stok_barang_id = sb.id
      LEFT JOIN kategori_barang kb ON sb.kategori_barang_id = kb.id
      LEFT JOIN satuan_barang sbu ON sb.satuan_barang_id = sbu.id
      WHERE bp.id = ?
    `;
    const [barangRows] = await dbPool.execute(barangQuery, [
      pemesanan.barang_permintaan_id,
    ]);
    const barang = barangRows[0];

    // Get dokumen terkait
    const dokumenList = await DokumenPembelian.findByBarangPermintaanId(
      pemesanan.barang_permintaan_id
    );

    // Get info permintaan
    const permintaanQuery = `
      SELECT p.*, u.nama_lengkap, d.nama_divisi
      FROM permintaan p
      JOIN users u ON p.user_id = u.id
      JOIN divisi d ON u.divisi_id = d.id
      WHERE p.id = (
        SELECT permintaan_id FROM barang_permintaan WHERE id = ?
      )
    `;
    const [permintaanRows] = await dbPool.execute(permintaanQuery, [
      pemesanan.barang_permintaan_id,
    ]);
    const permintaan = permintaanRows[0];

    res.json({
      message: "Detail pemesanan berhasil diambil.",
      data: {
        ...pemesanan,
        barang: barang,
        permintaan: permintaan,
        dokumen: dokumenList,
      },
    });
  } catch (error) {
    console.error("💥 Get pemesanan detail error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

import Pemesanan from "../models/pemesanan.js";
import BarangPermintaan from "../models/barang_permintaan.js";
import DokumenPembelian from "../models/dokumen_pembelian.js";
import dbPool from "../config/database.js"; // TAMBAHKAN INI

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

// Di file: src/controller/pemesananController.js - perbaiki query getPemesananDetail
export const getPemesananDetail = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔍 Getting pemesanan detail for admin:", id);

    // Query yang DIPERBAIKI - tambahkan LEFT JOIN ke satuan_barang
    const query = `
      SELECT 
        p.*,
        bp.nama_barang,
        bp.kategori_barang,
        bp.jumlah,
        bp.keterangan,
        bp.status as barang_status,
        bp.catatan_validator as barang_catatan_validator,
        perm.nomor_permintaan,
        u.nama_lengkap as pemohon_nama,
        d.nama_divisi,
        sb.satuan_barang_id, -- Ambil ID satuan dari stok_barang
        sbu.nama_satuan,     -- Ambil nama satuan dari satuan_barang
        kb.nama_kategori as kategori_nama
      FROM pemesanan p
      JOIN barang_permintaan bp ON p.barang_permintaan_id = bp.id
      JOIN permintaan perm ON bp.permintaan_id = perm.id
      JOIN users u ON perm.user_id = u.id
      JOIN divisi d ON u.divisi_id = d.id
      LEFT JOIN stok_barang sb ON bp.stok_barang_id = sb.id
      LEFT JOIN kategori_barang kb ON sb.kategori_barang_id = kb.id
      LEFT JOIN satuan_barang sbu ON sb.satuan_barang_id = sbu.id  -- TAMBAHKAN INI
      WHERE p.id = ?
    `;

    const [pemesananRows] = await dbPool.execute(query, [id]);

    if (pemesananRows.length === 0) {
      return res.status(404).json({ error: "Pemesanan tidak ditemukan." });
    }

    const pemesanan = pemesananRows[0];

    // Ambil dokumen terkait pemesanan ini dengan catatan validator
    const dokumenQuery = `
      SELECT 
        dp.*,
        u.nama_lengkap as uploader_name,
        uv.nama_lengkap as validator_name
      FROM dokumen_pembelian dp
      LEFT JOIN users u ON dp.uploaded_by = u.id
      LEFT JOIN users uv ON dp.validated_by = uv.id
      WHERE dp.barang_permintaan_id = ?
      ORDER BY dp.jenis_dokumen, dp.created_at DESC
    `;

    const [dokumenRows] = await dbPool.execute(dokumenQuery, [
      pemesanan.barang_permintaan_id,
    ]);

    // Cek apakah ada dokumen yang ditolak
    const dokumenDitolak = dokumenRows.filter((d) => d.is_valid === 0);

    // Format response
    const response = {
      message: "Detail pemesanan berhasil diambil.",
      data: {
        ...pemesanan,
        dokumen: dokumenRows,
        jumlah_dokumen: dokumenRows.length,
        jumlah_dokumen_ditolak: dokumenDitolak.length,
        catatan_penolakan:
          dokumenDitolak.length > 0
            ? dokumenDitolak.map((d) => ({
                jenis_dokumen: d.jenis_dokumen,
                catatan: d.catatan_validator,
                validator: d.validator_name,
                tanggal: d.validated_at,
              }))
            : [],
        // Tambahkan data tambahan untuk frontend
        barang: {
          nama_barang: pemesanan.nama_barang,
          kategori_barang: pemesanan.kategori_barang || pemesanan.kategori_nama,
          jumlah: pemesanan.jumlah,
          keterangan: pemesanan.keterangan,
          nama_satuan: pemesanan.nama_satuan || "Unit", // default jika null
          status: pemesanan.barang_status,
        },
      },
    };

    res.json(response);
  } catch (error) {
    console.error("💥 Get pemesanan detail error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

import Permintaan from "../models/permintaan.js";
import BarangPermintaan from "../models/barang_permintaan.js";
import dbPool from "../config/database.js";

export const createPermintaan = async (req, res) => {
  try {
    const { tanggal_kebutuhan, catatan } = req.body;
    const user_id = req.user.id;

    console.log("📝 Creating new permintaan for user:", user_id);

    // Validasi input
    if (!tanggal_kebutuhan) {
      return res.status(400).json({ error: "Tanggal kebutuhan harus diisi." });
    }

    // Buat permintaan baru
    const permintaanId = await Permintaan.create({
      user_id,
      tanggal_kebutuhan,
      catatan: catatan || "",
    });

    console.log("✅ Permintaan created with ID:", permintaanId);

    res.status(201).json({
      message: "Permintaan berhasil dibuat sebagai draft.",
      data: { id: permintaanId },
    });
  } catch (error) {
    console.error("💥 Create permintaan error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

export const getPermintaanByUser = async (req, res) => {
  try {
    const user_id = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    // Filters dari query parameters
    const filters = {
      status: req.query.status || "",
      search: req.query.search || "",
      start_date: req.query.start_date || "",
      end_date: req.query.end_date || "",
    };

    console.log("📋 Getting permintaan dengan filter:", {
      user_id,
      page,
      limit,
      filters,
    });

    // Validasi parameter
    if (page < 1) {
      return res.status(400).json({ error: "Page harus lebih dari 0" });
    }
    if (limit < 1) {
      return res.status(400).json({ error: "Limit harus lebih dari 0" });
    }

    const result = await Permintaan.findByUserIdWithPagination(
      user_id,
      page,
      limit,
      filters
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
      filters: filters, // Kirim kembali filter yang digunakan
    });
  } catch (error) {
    console.error("💥 Get permintaan by user error:", error);
    res.status(500).json({
      error: "Terjadi kesalahan server.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Fungsi baru: Get count by status untuk dashboard
export const getPermintaanCountByStatus = async (req, res) => {
  try {
    const user_id = req.user.id;

    console.log("📊 Getting permintaan count by status for user:", user_id);

    const counts = await Permintaan.getCountByStatus(user_id);

    res.json({
      message: "Count permintaan berhasil diambil.",
      data: counts,
    });
  } catch (error) {
    console.error("💥 Get permintaan count error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Fungsi baru: Get permintaan yang memiliki status update (untuk notifikasi)
export const getPermintaanWithStatusUpdate = async (req, res) => {
  try {
    const user_id = req.user.id;
    const lastChecked = req.query.last_checked || new Date(0).toISOString(); // Timestamp terakhir cek

    console.log("🔔 Getting permintaan dengan status update:", {
      user_id,
      lastChecked,
    });

    const query = `
      SELECT p.*, u.nama_lengkap, d.nama_divisi 
      FROM permintaan p 
      JOIN users u ON p.user_id = u.id 
      JOIN divisi d ON u.divisi_id = d.id 
      WHERE p.user_id = ? AND p.updated_at > ?
      ORDER BY p.updated_at DESC
    `;

    const [rows] = await dbPool.execute(query, [user_id, lastChecked]);

    res.json({
      message: "Permintaan dengan status update berhasil diambil.",
      data: rows,
      last_checked: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Get permintaan with status update error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

export const getPermintaanDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    console.log("🔍 Getting permintaan detail:", { id, user_id, page });

    // Cek apakah permintaan milik user
    const permintaan = await Permintaan.findByIdAndUserId(id, user_id);
    if (!permintaan) {
      return res.status(404).json({ error: "Permintaan tidak ditemukan." });
    }

    // Ambil barang-barang dalam permintaan dengan pagination
    const barangResult =
      await BarangPermintaan.findByPermintaanIdWithPagination(id, page, limit);

    // LOG untuk debug
    console.log("📊 Permintaan data:", permintaan);
    console.log("📦 Barang result:", barangResult);

    // Tambahkan JOIN untuk mendapatkan data stok jika ada
    const barangWithStok = await Promise.all(
      barangResult.data.map(async (barang) => {
        if (barang.stok_barang_id) {
          try {
            const stokQuery = `
              SELECT 
                sb.*,
                kb.nama_kategori,
                sbu.nama_satuan
              FROM stok_barang sb
              LEFT JOIN kategori_barang kb ON sb.kategori_barang_id = kb.id
              LEFT JOIN satuan_barang sbu ON sb.satuan_barang_id = sbu.id
              WHERE sb.id = ?
            `;
            const [stokRows] = await dbPool.execute(stokQuery, [
              barang.stok_barang_id,
            ]);
            if (stokRows.length > 0) {
              return {
                ...barang,
                stok_barang: stokRows[0],
              };
            }
          } catch (error) {
            console.error("Error fetching stok data:", error);
          }
        }
        return barang;
      })
    );

    const response = {
      message: "Detail permintaan berhasil diambil.",
      data: {
        ...permintaan,
        barang: {
          data: barangWithStok,
          pagination: {
            currentPage: barangResult.page,
            totalPages: barangResult.totalPages,
            totalItems: barangResult.total,
            itemsPerPage: barangResult.limit,
          },
        },
      },
    };

    console.log("✅ Final API response:", JSON.stringify(response, null, 2));

    res.json(response);
  } catch (error) {
    console.error("💥 Get permintaan detail error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

export const updatePermintaan = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const { tanggal_kebutuhan, catatan } = req.body;

    console.log("✏️ Updating permintaan:", { id, user_id });

    // Cek apakah permintaan milik user dan status draft
    const permintaan = await Permintaan.findByIdAndUserId(id, user_id);
    if (!permintaan) {
      return res.status(404).json({ error: "Permintaan tidak ditemukan." });
    }

    if (permintaan.status !== "draft") {
      return res.status(400).json({
        error: "Hanya permintaan dengan status draft yang bisa diupdate.",
      });
    }

    // Update permintaan
    const affectedRows = await Permintaan.update(id, {
      tanggal_kebutuhan,
      catatan,
    });

    if (affectedRows === 0) {
      return res.status(400).json({ error: "Gagal mengupdate permintaan." });
    }

    res.json({ message: "Permintaan berhasil diupdate." });
  } catch (error) {
    console.error("💥 Update permintaan error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

export const submitPermintaan = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    console.log("🚀 Submitting permintaan:", { id, user_id });

    // Cek apakah permintaan milik user
    const permintaan = await Permintaan.findByIdAndUserId(id, user_id);
    if (!permintaan) {
      return res.status(404).json({ error: "Permintaan tidak ditemukan." });
    }

    // Cek apakah permintaan sudah memiliki barang
    const barangList = await BarangPermintaan.findByPermintaanId(id);
    if (barangList.length === 0) {
      return res
        .status(400)
        .json({ error: "Tidak bisa submit permintaan tanpa barang." });
    }

    // Ubah status dari draft menjadi menunggu
    const affectedRows = await Permintaan.updateStatus(id, "menunggu");

    if (affectedRows === 0) {
      return res.status(400).json({ error: "Gagal submit permintaan." });
    }

    res.json({
      message: "Permintaan berhasil disubmit dan menunggu verifikasi.",
    });
  } catch (error) {
    console.error("💥 Submit permintaan error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Dalam fungsi addBarangToPermintaan, pastikan menerima stok_barang_id
export const addBarangToPermintaan = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const {
      kategori_barang,
      nama_barang,
      spesifikasi,
      jumlah,
      keterangan,
      stok_barang_id,
    } = req.body;

    console.log("📦 Adding barang to permintaan:", {
      id,
      user_id,
      stok_barang_id,
    });

    // Cek apakah permintaan milik user dan status draft
    const permintaan = await Permintaan.findByIdAndUserId(id, user_id);
    if (!permintaan) {
      return res.status(404).json({ error: "Permintaan tidak ditemukan." });
    }

    if (permintaan.status !== "draft") {
      return res.status(400).json({
        error:
          "Hanya permintaan dengan status draft yang bisa ditambah barang.",
      });
    }

    // Validasi input
    if (!kategori_barang || !nama_barang || !jumlah) {
      return res.status(400).json({
        error: "Kategori, nama barang, dan jumlah harus diisi.",
      });
    }

    // Tambah barang ke permintaan
    const barangId = await BarangPermintaan.create({
      permintaan_id: id,
      kategori_barang,
      nama_barang,
      spesifikasi: spesifikasi || "",
      jumlah,
      keterangan: keterangan || "",
      stok_barang_id: stok_barang_id || null,
    });

    console.log("✅ Barang added with ID:", barangId);

    res.status(201).json({
      message: "Barang berhasil ditambahkan ke permintaan.",
      data: { id: barangId },
      stok_barang_id: stok_barang_id || null,
    });
  } catch (error) {
    console.error("💥 Add barang to permintaan error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Fungsi untuk delete permintaan (draft)
export const deletePermintaan = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    console.log("🗑️ Deleting permintaan:", { id, user_id });

    // Cek apakah permintaan milik user dan status draft
    const permintaan = await Permintaan.findByIdAndUserId(id, user_id);
    if (!permintaan) {
      return res.status(404).json({ error: "Permintaan tidak ditemukan." });
    }

    if (permintaan.status !== "draft") {
      return res.status(400).json({
        error: "Hanya permintaan dengan status draft yang bisa dihapus.",
      });
    }

    // Hapus permintaan (akan cascade delete barang_permintaan karena ON DELETE CASCADE)
    const query = "DELETE FROM permintaan WHERE id = ? AND user_id = ?";
    const [result] = await dbPool.execute(query, [id, user_id]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Gagal menghapus permintaan." });
    }

    res.json({ message: "Permintaan berhasil dihapus." });
  } catch (error) {
    console.error("💥 Delete permintaan error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Fungsi untuk update permintaan (draft)
export const updateDraftPermintaan = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const { tanggal_kebutuhan, catatan } = req.body;

    console.log("✏️ Updating draft permintaan:", { id, user_id });

    // Cek apakah permintaan milik user dan status draft
    const permintaan = await Permintaan.findByIdAndUserId(id, user_id);
    if (!permintaan) {
      return res.status(404).json({ error: "Permintaan tidak ditemukan." });
    }

    if (permintaan.status !== "draft") {
      return res.status(400).json({
        error: "Hanya permintaan dengan status draft yang bisa diupdate.",
      });
    }

    // Update permintaan
    const affectedRows = await Permintaan.update(id, {
      tanggal_kebutuhan,
      catatan,
    });

    if (affectedRows === 0) {
      return res.status(400).json({ error: "Gagal mengupdate permintaan." });
    }

    res.json({ message: "Permintaan berhasil diupdate." });
  } catch (error) {
    console.error("💥 Update draft permintaan error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Get draft permintaan (untuk halaman draft)
export const getDraftPermintaan = async (req, res) => {
  try {
    const user_id = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    // Filters untuk draft
    const filters = {
      search: req.query.search || "",
      start_date: req.query.start_date || "",
      end_date: req.query.end_date || "",
    };

    console.log("📝 Getting draft permintaan dengan filter:", {
      user_id,
      page,
      limit,
      filters,
    });

    // Validasi parameter
    if (page < 1) {
      return res.status(400).json({ error: "Page harus lebih dari 0" });
    }
    if (limit < 1) {
      return res.status(400).json({ error: "Limit harus lebih dari 0" });
    }

    // Gunakan fungsi khusus untuk draft
    const result = await Permintaan.findDraftByUserIdWithPagination(
      user_id,
      page,
      limit,
      filters
    );

    res.json({
      message: "Daftar draft permintaan berhasil diambil.",
      data: result.data,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: result.limit,
      },
      filters: filters,
    });
  } catch (error) {
    console.error("💥 Get draft permintaan error:", error);
    res.status(500).json({
      error: "Terjadi kesalahan server.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

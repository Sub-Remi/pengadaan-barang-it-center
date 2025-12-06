import BarangPermintaan from "../models/barang_permintaan.js";
import Permintaan from "../models/permintaan.js";

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

    console.log("📦 Adding barang to permintaan:", { id, user_id });

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
      return res
        .status(400)
        .json({ error: "Kategori, nama barang, dan jumlah harus diisi." });
    }

    // Tambah barang ke permintaan
    const barangId = await BarangPermintaan.create({
      permintaan_id: id,
      kategori_barang,
      nama_barang,
      spesifikasi: spesifikasi || "",
      jumlah,
      keterangan: keterangan || "",
      stok_barang_id: stok_barang_id, // Link ke stok jika berhasil
    });

    console.log("✅ Barang added with ID:", barangId);

    res.status(201).json({
      message: "Barang berhasil ditambahkan ke permintaan.",
      data: { id: barangId },
      stok_barang_id: stok_barang_id,
      stok_created: stok_barang_id ? true : false,
    });
  } catch (error) {
    console.error("💥 Add barang to permintaan error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

export const updateBarangInPermintaan = async (req, res) => {
  try {
    const { id, barangId } = req.params;
    const user_id = req.user.id;
    const { kategori_barang, nama_barang, spesifikasi, jumlah, keterangan } =
      req.body;

    console.log("✏️ Updating barang in permintaan:", { id, barangId, user_id });

    // Cek apakah permintaan milik user dan status draft
    const permintaan = await Permintaan.findByIdAndUserId(id, user_id);
    if (!permintaan) {
      return res.status(404).json({ error: "Permintaan tidak ditemukan." });
    }

    if (permintaan.status !== "draft") {
      return res.status(400).json({
        error:
          "Hanya permintaan dengan status draft yang bisa diupdate barangnya.",
      });
    }

    // Cek apakah barang ada dalam permintaan
    const barang = await BarangPermintaan.findByIdAndPermintaanId(barangId, id);
    if (!barang) {
      return res
        .status(404)
        .json({ error: "Barang tidak ditemukan dalam permintaan." });
    }

    // Update barang
    const affectedRows = await BarangPermintaan.update(barangId, {
      kategori_barang,
      nama_barang,
      spesifikasi,
      jumlah,
      keterangan,
    });

    if (affectedRows === 0) {
      return res.status(400).json({ error: "Gagal mengupdate barang." });
    }

    res.json({ message: "Barang berhasil diupdate." });
  } catch (error) {
    console.error("💥 Update barang in permintaan error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Di barangPermintaanController.js, tambahkan:
export const deleteAllBarangFromPermintaan = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    console.log("🗑️ Deleting all barang from permintaan:", { id, user_id });

    // Cek apakah permintaan milik user dan status draft
    const permintaan = await Permintaan.findByIdAndUserId(id, user_id);
    if (!permintaan) {
      return res.status(404).json({ error: "Permintaan tidak ditemukan." });
    }

    if (permintaan.status !== "draft") {
      return res.status(400).json({
        error: "Hanya permintaan dengan status draft yang bisa dihapus barangnya.",
      });
    }

    // Hapus semua barang dari permintaan
    const affectedRows = await BarangPermintaan.deleteAllByPermintaanId(id);

    res.json({ 
      message: "Semua barang berhasil dihapus dari permintaan.",
      affectedRows
    });
  } catch (error) {
    console.error("💥 Delete all barang from permintaan error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

export const deleteBarangFromPermintaan = async (req, res) => {
  try {
    const { id, barangId } = req.params;
    const user_id = req.user.id;

    console.log("🗑️ Deleting barang from permintaan:", {
      id,
      barangId,
      user_id,
    });

    // Cek apakah permintaan milik user dan status draft
    const permintaan = await Permintaan.findByIdAndUserId(id, user_id);
    if (!permintaan) {
      return res.status(404).json({ error: "Permintaan tidak ditemukan." });
    }

    if (permintaan.status !== "draft") {
      return res.status(400).json({
        error:
          "Hanya permintaan dengan status draft yang bisa dihapus barangnya.",
      });
    }

    // Cek apakah barang ada dalam permintaan
    const barang = await BarangPermintaan.findByIdAndPermintaanId(barangId, id);
    if (!barang) {
      return res
        .status(404)
        .json({ error: "Barang tidak ditemukan dalam permintaan." });
    }

    // Hapus barang
    const affectedRows = await BarangPermintaan.delete(barangId);

    if (affectedRows === 0) {
      return res.status(400).json({ error: "Gagal menghapus barang." });
    }

    res.json({ message: "Barang berhasil dihapus." });
  } catch (error) {
    console.error("💥 Delete barang from permintaan error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

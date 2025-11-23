import dbPool from "../config/database.js";

const BarangPermintaan = {
  // Create new barang in permintaan
  create: async (barangData) => {
    const {
      permintaan_id,
      kategori_barang,
      nama_barang,
      spesifikasi,
      jumlah,
      keterangan,
    } = barangData;
    const query = `
      INSERT INTO barang_permintaan 
      (permintaan_id, kategori_barang, nama_barang, spesifikasi, jumlah, keterangan) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await dbPool.execute(query, [
      permintaan_id,
      kategori_barang,
      nama_barang,
      spesifikasi,
      jumlah,
      keterangan,
    ]);
    return result.insertId;
  },

  // Find barang by ID
  findById: async (id) => {
    const query = "SELECT * FROM barang_permintaan WHERE id = ?";
    const [rows] = await dbPool.execute(query, [id]);
    return rows[0];
  },

  // Get all barang by permintaan_id
  findByPermintaanId: async (permintaanId) => {
    const query =
      "SELECT * FROM barang_permintaan WHERE permintaan_id = ? ORDER BY created_at DESC";
    const [rows] = await dbPool.execute(query, [permintaanId]);
    return rows;
  },

  // Get barang by ID and permintaan_id
  findByIdAndPermintaanId: async (id, permintaanId) => {
    const query =
      "SELECT * FROM barang_permintaan WHERE id = ? AND permintaan_id = ?";
    const [rows] = await dbPool.execute(query, [id, permintaanId]);
    return rows[0];
  },

  // Update barang
  update: async (id, barangData) => {
    const { kategori_barang, nama_barang, spesifikasi, jumlah, keterangan } =
      barangData;
    const query = `
      UPDATE barang_permintaan 
      SET kategori_barang = ?, nama_barang = ?, spesifikasi = ?, jumlah = ?, keterangan = ? 
      WHERE id = ?
    `;
    const [result] = await dbPool.execute(query, [
      kategori_barang,
      nama_barang,
      spesifikasi,
      jumlah,
      keterangan,
      id,
    ]);
    return result.affectedRows;
  },

  // Delete barang
  delete: async (id) => {
    const query = "DELETE FROM barang_permintaan WHERE id = ?";
    const [result] = await dbPool.execute(query, [id]);
    return result.affectedRows;
  },

  // Get all barang by permintaan_id dengan pagination - SOLUSI FIX
  findByPermintaanIdWithPagination: async (
    permintaanId,
    page = 1,
    limit = 5
  ) => {
    const offset = (page - 1) * limit;

    // Convert ke number untuk MySQL
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    console.log("📦 Pagination barang params:", {
      permintaanId,
      pageNum,
      limitNum,
      offsetNum,
    });

    // SOLUSI: Gunakan template literal untuk LIMIT dan OFFSET
    const query = `
      SELECT * FROM barang_permintaan 
      WHERE permintaan_id = ? 
      ORDER BY created_at DESC
      LIMIT ${limitNum} OFFSET ${offsetNum}
    `;

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM barang_permintaan 
      WHERE permintaan_id = ?
    `;

    try {
      console.log("🔍 Executing barang query:", query);
      const [rows] = await dbPool.execute(query, [permintaanId]);
      const [countRows] = await dbPool.execute(countQuery, [permintaanId]);

      const total = countRows[0].total;
      const totalPages = Math.ceil(total / limitNum);

      console.log(
        "✅ Barang query successful. Total:",
        total,
        "Total pages:",
        totalPages
      );

      return {
        data: rows,
        total: total,
        page: pageNum,
        limit: limitNum,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error("💥 Barang database query error:", error);
      throw error;
    }
  },

  // Update status barang
  updateStatus: async (id, status, catatan_admin = null) => {
    let query =
      "UPDATE barang_permintaan SET status = ?, updated_at = CURRENT_TIMESTAMP";
    const values = [status];

    if (catatan_admin) {
      query += ", catatan_admin = ?";
      values.push(catatan_admin);
    }

    query += " WHERE id = ?";
    values.push(id);

    const [result] = await dbPool.execute(query, values);
    return result.affectedRows;
  },

  // Mark barang as received
  markAsReceived: async (id, penerimaan_barang_id) => {
    const query = `
      UPDATE barang_permintaan 
      SET sudah_diterima = TRUE, penerimaan_barang_id = ?, status = 'selesai'
      WHERE id = ?
    `;
    const [result] = await dbPool.execute(query, [penerimaan_barang_id, id]);
    return result.affectedRows;
  },

  // Update status barang setelah validasi
  updateStatusAfterValidation: async (id, status) => {
    const query = `
      UPDATE barang_permintaan 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    const [result] = await dbPool.execute(query, [status, id]);
    return result.affectedRows;
  },

  // Cek apakah semua dokumen untuk barang sudah divalidasi
  checkAllDokumenValidated: async (barang_permintaan_id) => {
    const query = `
      SELECT 
        COUNT(*) as total_dokumen,
        SUM(CASE WHEN is_valid = 1 THEN 1 ELSE 0 END) as validated_count,
        SUM(CASE WHEN is_valid = 0 THEN 1 ELSE 0 END) as rejected_count,
        SUM(CASE WHEN is_valid IS NULL THEN 1 ELSE 0 END) as pending_count
      FROM dokumen_pembelian 
      WHERE barang_permintaan_id = ?
    `;
    const [rows] = await dbPool.execute(query, [barang_permintaan_id]);
    return rows[0];
  },
};

export default BarangPermintaan;

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
      stok_barang_id,
    } = barangData;

    const query = `
      INSERT INTO barang_permintaan 
      (permintaan_id, kategori_barang, nama_barang, spesifikasi, jumlah, keterangan, stok_barang_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await dbPool.execute(query, [
      permintaan_id,
      kategori_barang,
      nama_barang,
      spesifikasi,
      jumlah,
      keterangan,
      stok_barang_id,
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
  // Get all barang by permintaan_id dengan pagination - DENGAN JOIN stok_barang
  findByPermintaanIdWithPagination: async (
    permintaanId,
    page = 1,
    limit = 5
  ) => {
    const offset = (page - 1) * limit;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    console.log("📦 Pagination barang params:", {
      permintaanId,
      pageNum,
      limitNum,
      offsetNum,
    });

    // Query dengan LEFT JOIN ke stok_barang
    const query = `
    SELECT 
      bp.*,
      sb.kategori_barang_id as stok_kategori_id,
      sb.nama_barang as stok_nama_barang,
      sb.spesifikasi as stok_spesifikasi,
      sb.satuan_barang_id as stok_satuan_id,
      sb.stok as stok_jumlah,
      sb.stok_minimum as stok_minimum,
      kb.nama_kategori as stok_nama_kategori,
      sbu.nama_satuan as stok_nama_satuan
    FROM barang_permintaan bp
    LEFT JOIN stok_barang sb ON bp.stok_barang_id = sb.id
    LEFT JOIN kategori_barang kb ON sb.kategori_barang_id = kb.id
    LEFT JOIN satuan_barang sbu ON sb.satuan_barang_id = sbu.id
    WHERE bp.permintaan_id = ? 
    ORDER BY bp.created_at DESC
    LIMIT ${limitNum} OFFSET ${offsetNum}
  `;

    const countQuery = `
    SELECT COUNT(*) as total 
    FROM barang_permintaan 
    WHERE permintaan_id = ?
  `;

    try {
      console.log("🔍 Executing barang query dengan JOIN:", query);
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

      // Format data agar lebih mudah di frontend
      const formattedRows = rows.map((row) => {
        const barang = {
          id: row.id,
          permintaan_id: row.permintaan_id,
          kategori_barang: row.kategori_barang,
          nama_barang: row.nama_barang,
          spesifikasi: row.spesifikasi,
          jumlah: row.jumlah,
          keterangan: row.keterangan,
          status: row.status,
          stok_barang_id: row.stok_barang_id,
          stok_available: row.stok_available,
          created_at: row.created_at,
          updated_at: row.updated_at,
        };

        // Jika ada data dari stok_barang
        if (row.stok_barang_id) {
          barang.stok_barang = {
            id: row.stok_barang_id,
            kategori_barang_id: row.stok_kategori_id,
            nama_barang: row.stok_nama_barang,
            spesifikasi: row.stok_spesifikasi,
            satuan_barang_id: row.stok_satuan_id,
            stok: row.stok_jumlah,
            stok_minimum: row.stok_minimum,
            nama_kategori: row.stok_nama_kategori,
            nama_satuan: row.stok_nama_satuan,
          };
        }

        return barang;
      });

      return {
        data: formattedRows,
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

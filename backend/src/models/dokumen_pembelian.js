import dbPool from "../config/database.js";

const DokumenPembelian = {
  // Create new dokumen pembelian - UPDATE dengan kolom baru
  create: async (dokumenData) => {
    const {
      barang_permintaan_id,
      jenis_dokumen,
      file_url,
      original_name,
      file_size,
      uploaded_by,
    } = dokumenData;

    const query = `
      INSERT INTO dokumen_pembelian 
      (barang_permintaan_id, jenis_dokumen, nama_file, file_path, original_name, file_size, uploaded_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await dbPool.execute(query, [
      barang_permintaan_id,
      jenis_dokumen,
      original_name, // sebagai nama_file di database
      file_url, // sebagai file_path di database
      original_name,
      file_size,
      uploaded_by,
    ]);

    return result.insertId;
  },

  // Find by ID - UPDATE dengan kolom validasi
  findById: async (id) => {
    const query = `
      SELECT 
        dp.*,
        bp.nama_barang,
        bp.spesifikasi,
        bp.status as status_barang,
        p.nomor_permintaan,
        u.nama_lengkap as pemohon,
        d.nama_divisi,
        uploader.nama_lengkap as uploader_name,
        validator.nama_lengkap as validator_name
      FROM dokumen_pembelian dp
      JOIN barang_permintaan bp ON dp.barang_permintaan_id = bp.id
      JOIN permintaan p ON bp.permintaan_id = p.id
      JOIN users u ON p.user_id = u.id
      JOIN divisi d ON u.divisi_id = d.id
      LEFT JOIN users uploader ON dp.uploaded_by = uploader.id
      LEFT JOIN users validator ON dp.validated_by = validator.id
      WHERE dp.id = ?
    `;
    const [rows] = await dbPool.execute(query, [id]);
    return rows[0];
  },

  // Find by barang_permintaan_id - UPDATE
  findByBarangPermintaanId: async (barang_permintaan_id) => {
    const query = `
      SELECT 
        dp.*,
        u.nama_lengkap as uploader_name,
        validator.nama_lengkap as validator_name
      FROM dokumen_pembelian dp
      LEFT JOIN users u ON dp.uploaded_by = u.id
      LEFT JOIN users validator ON dp.validated_by = validator.id
      WHERE dp.barang_permintaan_id = ?
      ORDER BY dp.created_at DESC
    `;
    const [rows] = await dbPool.execute(query, [barang_permintaan_id]);
    return rows;
  },

  // Find by permintaan_id - UPDATE
  findByPermintaanId: async (permintaan_id) => {
    const query = `
      SELECT 
        dp.*,
        bp.nama_barang,
        bp.spesifikasi,
        u.nama_lengkap as uploader_name,
        validator.nama_lengkap as validator_name
      FROM dokumen_pembelian dp
      JOIN barang_permintaan bp ON dp.barang_permintaan_id = bp.id
      LEFT JOIN users u ON dp.uploaded_by = u.id
      LEFT JOIN users validator ON dp.validated_by = validator.id
      WHERE bp.permintaan_id = ?
      ORDER BY dp.created_at DESC
    `;
    const [rows] = await dbPool.execute(query, [permintaan_id]);
    return rows;
  },

  // Delete dokumen - UPDATE
  delete: async (id) => {
    // First get file path to delete physical file
    const dokumen = await DokumenPembelian.findById(id);

    const query = "DELETE FROM dokumen_pembelian WHERE id = ?";
    const [result] = await dbPool.execute(query, [id]);

    // Return both affectedRows and file path for cleanup
    return {
      affectedRows: result.affectedRows,
      filePath: dokumen ? dokumen.file_path : null,
    };
  },

  // Get dokumen statistics - UPDATE dengan kolom validasi
  getStats: async () => {
    const query = `
      SELECT 
        jenis_dokumen,
        COUNT(*) as total,
        SUM(CASE WHEN is_valid = true THEN 1 ELSE 0 END) as validated,
        SUM(CASE WHEN is_valid = false THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN is_valid IS NULL THEN 1 ELSE 0 END) as pending
      FROM dokumen_pembelian 
      GROUP BY jenis_dokumen
    `;
    const [rows] = await dbPool.execute(query);
    return rows;
  },

  // ========== METHODS BARU UNTUK VALIDATOR ==========

  // Update validation status by validator
  updateValidation: async (id, is_valid, catatan_validator, validated_by) => {
    const query = `
      UPDATE dokumen_pembelian 
      SET is_valid = ?, catatan_validator = ?, validated_by = ?, validated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    const [result] = await dbPool.execute(query, [
      is_valid,
      catatan_validator,
      validated_by,
      id,
    ]);
    return result.affectedRows;
  },

  // Get dokumen yang perlu divalidasi (for validator)
  findDokumenForValidation: async (page = 1, limit = 10, filters = {}) => {
    const offset = (page - 1) * limit;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    let query = `
      SELECT 
        dp.*,
        bp.nama_barang,
        bp.spesifikasi,
        bp.status as status_barang,
        p.nomor_permintaan,
        p.tanggal_kebutuhan,
        u.nama_lengkap as pemohon,
        d.nama_divisi,
        uploader.nama_lengkap as uploaded_by_name
      FROM dokumen_pembelian dp
      JOIN barang_permintaan bp ON dp.barang_permintaan_id = bp.id
      JOIN permintaan p ON bp.permintaan_id = p.id
      JOIN users u ON p.user_id = u.id
      JOIN divisi d ON u.divisi_id = d.id
      JOIN users uploader ON dp.uploaded_by = uploader.id
      WHERE bp.status = 'dalam pemesanan'
      AND dp.is_valid IS NULL
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM dokumen_pembelian dp
      JOIN barang_permintaan bp ON dp.barang_permintaan_id = bp.id
      WHERE bp.status = 'dalam pemesanan'
      AND dp.is_valid IS NULL
    `;

    const values = [];
    const countValues = [];

    // Filter by jenis dokumen
    if (filters.jenis_dokumen && filters.jenis_dokumen !== "semua") {
      query += " AND dp.jenis_dokumen = ?";
      countQuery += " AND dp.jenis_dokumen = ?";
      values.push(filters.jenis_dokumen);
      countValues.push(filters.jenis_dokumen);
    }

    // Filter by divisi
    if (filters.divisi_id && filters.divisi_id !== "semua") {
      query += " AND u.divisi_id = ?";
      countQuery += " AND u.divisi_id = ?";
      values.push(filters.divisi_id);
      countValues.push(filters.divisi_id);
    }

    // Search by nomor permintaan atau nama barang
    if (filters.search) {
      query += " AND (p.nomor_permintaan LIKE ? OR bp.nama_barang LIKE ?)";
      countQuery += " AND (p.nomor_permintaan LIKE ? OR bp.nama_barang LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm);
      countValues.push(searchTerm, searchTerm);
    }

    query += " ORDER BY dp.created_at DESC";
    query += ` LIMIT ${limitNum} OFFSET ${offsetNum}`;

    try {
      const [rows] = await dbPool.execute(query, values);
      const [countRows] = await dbPool.execute(countQuery, countValues);

      const total = countRows[0].total;
      const totalPages = Math.ceil(total / limitNum);

      return {
        data: rows,
        total: total,
        page: pageNum,
        limit: limitNum,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error("💥 Find dokumen for validation error:", error);
      throw error;
    }
  },

  // Get dokumen yang sudah divalidasi (riwayat)
  findValidatedDokumen: async (page = 1, limit = 10, filters = {}) => {
    const offset = (page - 1) * limit;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    let query = `
      SELECT 
        dp.*,
        bp.nama_barang,
        bp.spesifikasi,
        p.nomor_permintaan,
        u.nama_lengkap as pemohon,
        d.nama_divisi,
        uploader.nama_lengkap as uploaded_by_name,
        validator.nama_lengkap as validator_name
      FROM dokumen_pembelian dp
      JOIN barang_permintaan bp ON dp.barang_permintaan_id = bp.id
      JOIN permintaan p ON bp.permintaan_id = p.id
      JOIN users u ON p.user_id = u.id
      JOIN divisi d ON u.divisi_id = d.id
      JOIN users uploader ON dp.uploaded_by = uploader.id
      LEFT JOIN users validator ON dp.validated_by = validator.id
      WHERE dp.is_valid IS NOT NULL
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM dokumen_pembelian dp
      JOIN barang_permintaan bp ON dp.barang_permintaan_id = bp.id
      WHERE dp.is_valid IS NOT NULL
    `;

    const values = [];
    const countValues = [];

    // Filter by validation status
    if (filters.is_valid && filters.is_valid !== "semua") {
      query += " AND dp.is_valid = ?";
      countQuery += " AND dp.is_valid = ?";
      values.push(filters.is_valid === "true" ? 1 : 0);
      countValues.push(filters.is_valid === "true" ? 1 : 0);
    }

    // Filter by jenis dokumen
    if (filters.jenis_dokumen && filters.jenis_dokumen !== "semua") {
      query += " AND dp.jenis_dokumen = ?";
      countQuery += " AND dp.jenis_dokumen = ?";
      values.push(filters.jenis_dokumen);
      countValues.push(filters.jenis_dokumen);
    }

    // Search by nomor permintaan atau nama barang
    if (filters.search) {
      query += " AND (p.nomor_permintaan LIKE ? OR bp.nama_barang LIKE ?)";
      countQuery += " AND (p.nomor_permintaan LIKE ? OR bp.nama_barang LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm);
      countValues.push(searchTerm, searchTerm);
    }

    query += " ORDER BY dp.validated_at DESC";
    query += ` LIMIT ${limitNum} OFFSET ${offsetNum}`;

    try {
      const [rows] = await dbPool.execute(query, values);
      const [countRows] = await dbPool.execute(countQuery, countValues);

      const total = countRows[0].total;
      const totalPages = Math.ceil(total / limitNum);

      return {
        data: rows,
        total: total,
        page: pageNum,
        limit: limitNum,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error("💥 Find validated dokumen error:", error);
      throw error;
    }
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

export default DokumenPembelian;

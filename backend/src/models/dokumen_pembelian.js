// file: src/models/dokumen_pembelian.js
import dbPool from "../config/database.js";

const DokumenPembelian = {
  // Create dokumen pembelian
  create: async (dokumenData) => {
    const {
      barang_permintaan_id,
      jenis_dokumen,
      nama_file,
      file_path,
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
      nama_file,
      file_path,
      original_name || nama_file,
      file_size,
      uploaded_by,
    ]);

    return result.insertId;
  },

  // Find by barang_permintaan_id
  findByBarangPermintaanId: async (barang_permintaan_id) => {
    const query = `
      SELECT dp.*, u.nama_lengkap as uploader_name
      FROM dokumen_pembelian dp
      LEFT JOIN users u ON dp.uploaded_by = u.id
      WHERE dp.barang_permintaan_id = ?
      ORDER BY dp.created_at DESC
    `;
    const [rows] = await dbPool.execute(query, [barang_permintaan_id]);
    return rows;
  },

  // Find by ID
  findById: async (id) => {
    const query = `
    SELECT dp.*, u.nama_lengkap as uploader_name
    FROM dokumen_pembelian dp
    LEFT JOIN users u ON dp.uploaded_by = u.id
    WHERE dp.id = ?
  `;
    const [rows] = await dbPool.execute(query, [id]);
    return rows[0];
  },

  // Tambahkan fungsi findByBarangAndJenis
  findByBarangAndJenis: async (barang_permintaan_id, jenis_dokumen) => {
    const query = `
    SELECT * FROM dokumen_pembelian 
    WHERE barang_permintaan_id = ? AND jenis_dokumen = ?
    ORDER BY created_at DESC
    LIMIT 1
  `;
    const [rows] = await dbPool.execute(query, [
      barang_permintaan_id,
      jenis_dokumen,
    ]);
    return rows[0];
  },

  // Update validation status - PERBAIKI agar bisa update jika ditolak sebelumnya
  updateValidation: async (id, is_valid, catatan_validator, validated_by) => {
    try {
      console.log("📝 Updating dokumen validation:", {
        id,
        is_valid,
        catatan_validator,
        validated_by,
      });

      // Pastikan is_valid adalah boolean
      const isValidBoolean =
        is_valid === true ||
        is_valid === 1 ||
        is_valid === "true" ||
        is_valid === "1";

      const query = `
      UPDATE dokumen_pembelian 
      SET is_valid = ?, 
          catatan_validator = ?, 
          validated_by = ?, 
          validated_at = NOW()
      WHERE id = ? 
      AND (is_valid IS NULL OR is_valid = 0)  -- Izinkan update jika null atau ditolak (0)
    `;

      const [result] = await dbPool.execute(query, [
        isValidBoolean ? 1 : 0, // Convert to 1/0 for MySQL
        catatan_validator || "",
        validated_by,
        id,
      ]);

      console.log(
        "✅ Dokumen validation updated, affected rows:",
        result.affectedRows
      );

      return result.affectedRows;
    } catch (error) {
      console.error("💥 Update validation error:", error);
      console.error("Error details:", {
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage,
        sql: error.sql,
      });
      throw error;
    }
  },

  // Find dokumen untuk validasi
  findDokumenForValidation: async (page = 1, limit = 10, filters = {}) => {
    const offset = (page - 1) * limit;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    let query = `
      SELECT 
        dp.*,
        bp.nama_barang,
        bp.jumlah,
        perm.nomor_permintaan,
        u.nama_lengkap as pemohon_nama,
        d.nama_divisi
      FROM dokumen_pembelian dp
      JOIN barang_permintaan bp ON dp.barang_permintaan_id = bp.id
      JOIN permintaan perm ON bp.permintaan_id = perm.id
      JOIN users u ON perm.user_id = u.id
      JOIN divisi d ON u.divisi_id = d.id
      WHERE dp.is_valid IS NULL
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM dokumen_pembelian dp
      WHERE dp.is_valid IS NULL
    `;

    const values = [];
    const countValues = [];

    // Filter by jenis dokumen
    if (filters.jenis_dokumen && filters.jenis_dokumen !== "") {
      query += " AND dp.jenis_dokumen = ?";
      countQuery += " AND dp.jenis_dokumen = ?";
      values.push(filters.jenis_dokumen);
      countValues.push(filters.jenis_dokumen);
    }

    // Filter by divisi
    if (filters.divisi_id && filters.divisi_id !== "") {
      query += " AND u.divisi_id = ?";
      countQuery += " AND u.divisi_id = ?";
      values.push(filters.divisi_id);
      countValues.push(filters.divisi_id);
    }

    // Filter by search
    if (filters.search) {
      query += " AND (bp.nama_barang LIKE ? OR perm.nomor_permintaan LIKE ?)";
      countQuery +=
        " AND (bp.nama_barang LIKE ? OR perm.nomor_permintaan LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm);
      countValues.push(searchTerm, searchTerm);
    }

    query += " ORDER BY dp.created_at DESC";
    query += " LIMIT ? OFFSET ?";
    values.push(limitNum, offset);

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

  // Find validated dokumen
  findValidatedDokumen: async (page = 1, limit = 10, filters = {}) => {
    const offset = (page - 1) * limit;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    let query = `
      SELECT 
        dp.*,
        bp.nama_barang,
        bp.jumlah,
        perm.nomor_permintaan,
        u.nama_lengkap as pemohon_nama,
        d.nama_divisi,
        uv.nama_lengkap as validator_name
      FROM dokumen_pembelian dp
      JOIN barang_permintaan bp ON dp.barang_permintaan_id = bp.id
      JOIN permintaan perm ON bp.permintaan_id = perm.id
      JOIN users u ON perm.user_id = u.id
      JOIN divisi d ON u.divisi_id = d.id
      LEFT JOIN users uv ON dp.validated_by = uv.id
      WHERE dp.is_valid IS NOT NULL
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM dokumen_pembelian dp
      WHERE dp.is_valid IS NOT NULL
    `;

    const values = [];
    const countValues = [];

    // Filter by validation status
    if (filters.is_valid !== undefined && filters.is_valid !== "") {
      const isValid = filters.is_valid === "true" ? 1 : 0;
      query += " AND dp.is_valid = ?";
      countQuery += " AND dp.is_valid = ?";
      values.push(isValid);
      countValues.push(isValid);
    }

    // Filter by jenis dokumen
    if (filters.jenis_dokumen && filters.jenis_dokumen !== "") {
      query += " AND dp.jenis_dokumen = ?";
      countQuery += " AND dp.jenis_dokumen = ?";
      values.push(filters.jenis_dokumen);
      countValues.push(filters.jenis_dokumen);
    }

    // Filter by search
    if (filters.search) {
      query += " AND (bp.nama_barang LIKE ? OR perm.nomor_permintaan LIKE ?)";
      countQuery +=
        " AND (bp.nama_barang LIKE ? OR perm.nomor_permintaan LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm);
      countValues.push(searchTerm, searchTerm);
    }

    query += " ORDER BY dp.validated_at DESC";
    query += " LIMIT ? OFFSET ?";
    values.push(limitNum, offset);

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
};

export default DokumenPembelian;

import dbPool from "../config/database.js";

const Permintaan = {
  // Create new permintaan
  create: async (permintaanData) => {
    const { user_id, tanggal_kebutuhan, catatan } = permintaanData;

    // Generate nomor_permintaan unik menggunakan timestamp
    const nomor_permintaan = `REQ-${Date.now()}`;

    const query = `
      INSERT INTO permintaan (nomor_permintaan, user_id, tanggal_kebutuhan, catatan, status) 
      VALUES (?, ?, ?, ?, 'draft')
    `;
    const [result] = await dbPool.execute(query, [
      nomor_permintaan,
      user_id,
      tanggal_kebutuhan,
      catatan,
    ]);
    return result.insertId;
  },

  // Get permintaan by user ID
  findByUserId: async (userId) => {
    const query = `
      SELECT p.*, u.nama_lengkap, d.nama_divisi 
      FROM permintaan p 
      JOIN users u ON p.user_id = u.id 
      JOIN divisi d ON u.divisi_id = d.id 
      WHERE p.user_id = ? 
      ORDER BY p.created_at DESC
    `;
    const [rows] = await dbPool.execute(query, [userId]);
    return rows;
  },

  // Get permintaan by ID and user ID (untuk memastikan user hanya akses permintaannya sendiri)
  findByIdAndUserId: async (id, userId) => {
    const query = `
      SELECT p.*, u.nama_lengkap, d.nama_divisi 
      FROM permintaan p 
      JOIN users u ON p.user_id = u.id 
      JOIN divisi d ON u.divisi_id = d.id 
      WHERE p.id = ? AND p.user_id = ?
    `;
    const [rows] = await dbPool.execute(query, [id, userId]);
    return rows[0];
  },

  // Update permintaan
  update: async (id, permintaanData) => {
    const { tanggal_kebutuhan, catatan, status } = permintaanData;
    const query = `
      UPDATE permintaan 
      SET tanggal_kebutuhan = ?, catatan = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    const [result] = await dbPool.execute(query, [
      tanggal_kebutuhan,
      catatan,
      status,
      id,
    ]);
    return result.affectedRows;
  },

  // Update status permintaan
  updateStatus: async (id, status) => {
    const query =
      "UPDATE permintaan SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
    const [result] = await dbPool.execute(query, [status, id]);
    return result.affectedRows;
  },

  // Get permintaan by user ID dengan pagination, filter, dan search - UPDATE
  findByUserIdWithPagination: async (
    userId,
    page = 1,
    limit = 5,
    filters = {}
  ) => {
    const offset = (page - 1) * limit;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    console.log("📊 Pagination params dengan filter:", {
      userId,
      pageNum,
      limitNum,
      offsetNum,
      filters,
    });

    let query = `
      SELECT p.*, u.nama_lengkap, d.nama_divisi 
      FROM permintaan p 
      JOIN users u ON p.user_id = u.id 
      JOIN divisi d ON u.divisi_id = d.id 
      WHERE p.user_id = ?
    `;

    let countQuery = `
      SELECT COUNT(*) as total 
      FROM permintaan p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.user_id = ?
    `;

    const values = [userId];
    const countValues = [userId];

    // Filter by status
    if (filters.status && filters.status !== "semua") {
      query += " AND p.status = ?";
      countQuery += " AND p.status = ?";
      values.push(filters.status);
      countValues.push(filters.status);
    }

    // Search by nomor permintaan atau nama barang
    if (filters.search) {
      query += ` AND (
        p.nomor_permintaan LIKE ? OR 
        p.id IN (
          SELECT DISTINCT bp.permintaan_id 
          FROM barang_permintaan bp 
          WHERE bp.nama_barang LIKE ? OR bp.kategori_barang LIKE ?
        )
      )`;
      countQuery += ` AND (
        p.nomor_permintaan LIKE ? OR 
        p.id IN (
          SELECT DISTINCT bp.permintaan_id 
          FROM barang_permintaan bp 
          WHERE bp.nama_barang LIKE ? OR bp.kategori_barang LIKE ?
        )
      )`;
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm, searchTerm);
      countValues.push(searchTerm, searchTerm, searchTerm);
    }

    // Filter by date range
    if (filters.start_date && filters.end_date) {
      query += " AND DATE(p.created_at) BETWEEN ? AND ?";
      countQuery += " AND DATE(p.created_at) BETWEEN ? AND ?";
      values.push(filters.start_date, filters.end_date);
      countValues.push(filters.start_date, filters.end_date);
    }

    query += " ORDER BY p.created_at DESC";
    query += ` LIMIT ${limitNum} OFFSET ${offsetNum}`;

    console.log("🔍 Query dengan filter:", query);
    console.log("📊 Values dengan filter:", values);

    try {
      const [rows] = await dbPool.execute(query, values);
      const [countRows] = await dbPool.execute(countQuery, countValues);

      const total = countRows[0].total;
      const totalPages = Math.ceil(total / limitNum);

      console.log(
        "✅ Query dengan filter successful. Total:",
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
      console.error("💥 Database query dengan filter error:", error);
      throw error;
    }
  },

  // Get count permintaan by status untuk dashboard
  getCountByStatus: async (userId) => {
    const query = `
      SELECT 
        status,
        COUNT(*) as count
      FROM permintaan 
      WHERE user_id = ?
      GROUP BY status
      ORDER BY 
        CASE status 
          WHEN 'menunggu' THEN 1
          WHEN 'diproses' THEN 2
          WHEN 'selesai' THEN 3
          WHEN 'ditolak' THEN 4
          WHEN 'draft' THEN 5
          ELSE 6
        END
    `;

    const [rows] = await dbPool.execute(query, [userId]);

    // Format result untuk frontend
    const result = {
      menunggu: 0,
      diproses: 0,
      selesai: 0,
      ditolak: 0,
      draft: 0,
      total: 0,
    };

    rows.forEach((row) => {
      result[row.status] = row.count;
      result.total += row.count;
    });

    return result;
  },

  // Get all permintaan untuk admin (dengan filter)
  findAllWithFilters: async (filters = {}, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    let query = `
      SELECT p.*, u.nama_lengkap, d.nama_divisi 
      FROM permintaan p 
      JOIN users u ON p.user_id = u.id 
      JOIN divisi d ON u.divisi_id = d.id 
      WHERE 1=1
    `;

    let countQuery = `
      SELECT COUNT(*) as total 
      FROM permintaan p 
      JOIN users u ON p.user_id = u.id 
      WHERE 1=1
    `;

    const values = [];
    const countValues = [];

    // Filter by status
    if (filters.status) {
      query += " AND p.status = ?";
      countQuery += " AND p.status = ?";
      values.push(filters.status);
      countValues.push(filters.status);
    }

    // Filter by divisi
    if (filters.divisi_id) {
      query += " AND u.divisi_id = ?";
      countQuery += " AND u.divisi_id = ?";
      values.push(filters.divisi_id);
      countValues.push(filters.divisi_id);
    }

    // Filter by date range
    if (filters.start_date && filters.end_date) {
      query += " AND DATE(p.created_at) BETWEEN ? AND ?";
      countQuery += " AND DATE(p.created_at) BETWEEN ? AND ?";
      values.push(filters.start_date, filters.end_date);
      countValues.push(filters.start_date, filters.end_date);
    }

    // Search by nomor permintaan atau nama pemohon
    if (filters.search) {
      query += " AND (p.nomor_permintaan LIKE ? OR u.nama_lengkap LIKE ?)";
      countQuery += " AND (p.nomor_permintaan LIKE ? OR u.nama_lengkap LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm);
      countValues.push(searchTerm, searchTerm);
    }

    query += " ORDER BY p.created_at DESC";
    query += ` LIMIT ${limitNum} OFFSET ${offsetNum}`;

    console.log("🔍 Admin query:", query);
    console.log("📊 Admin query values:", values);

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
      console.error("💥 Admin find all error:", error);
      throw error;
    }
  },

  // Update status permintaan
  updateStatus: async (id, status) => {
    const query =
      "UPDATE permintaan SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
    const [result] = await dbPool.execute(query, [status, id]);
    return result.affectedRows;
  },
};

export default Permintaan;

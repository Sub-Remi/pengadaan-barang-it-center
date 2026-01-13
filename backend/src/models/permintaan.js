import dbPool from "../config/database.js";

const Permintaan = {
  // Create new permintaan
  // Create new permintaan
  create: async (permintaanData) => {
    let { user_id, tanggal_kebutuhan, catatan } = permintaanData;

    // format ISO ke YYYY-MM-DD jika perlu
    if (
      tanggal_kebutuhan &&
      typeof tanggal_kebutuhan === "string" &&
      tanggal_kebutuhan.includes("T")
    ) {
      const dateObj = new Date(tanggal_kebutuhan);
      tanggal_kebutuhan = dateObj.toISOString().split("T")[0];
      console.log(
        "📅 Model Create - Tanggal dikonversi ke:",
        tanggal_kebutuhan
      );
    }

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
    SELECT 
      p.*, 
      u.nama_lengkap, 
      u.email,
      u.divisi_id,
      d.nama_divisi  -- TAMBAHKAN INI
    FROM permintaan p 
    JOIN users u ON p.user_id = u.id 
    JOIN divisi d ON u.divisi_id = d.id  -- TAMBAHKAN JOIN
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
    filters = {},
    sort = "terbaru"
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
      sort,
    });

  let query = `
    SELECT 
      p.*, 
      u.nama_lengkap, 
      u.email,
      u.divisi_id,
      d.nama_divisi,  -- INI YANG PENTING
      (SELECT COUNT(*) 
       FROM barang_permintaan bp 
       WHERE bp.permintaan_id = p.id) as jumlah_item
    FROM permintaan p 
    JOIN users u ON p.user_id = u.id 
    JOIN divisi d ON u.divisi_id = d.id  -- PASTIKAN JOIN KE DIVISI
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

    let shouldExcludeDraft = true;

    // Filter by status
    if (filters.status && filters.status !== "" && filters.status !== "semua") {
      query += " AND p.status = ?";
      countQuery += " AND p.status = ?";
      values.push(filters.status);
      countValues.push(filters.status);
      shouldExcludeDraft = false;
    }

    // Exclude draft jika tidak ada filter status atau filter "semua"
    if (shouldExcludeDraft) {
      query += " AND p.status != 'draft'";
      countQuery += " AND p.status != 'draft'";
    }

    // Search by nomor permintaan atau nama barang
if (filters.search) {
  query += ` AND (
    p.nomor_permintaan LIKE ? OR 
    p.catatan LIKE ? OR
    p.id IN (
      SELECT DISTINCT bp.permintaan_id 
      FROM barang_permintaan bp 
      WHERE bp.nama_barang LIKE ? OR bp.kategori_barang LIKE ?
    )
  )`;
  countQuery += ` AND (
    p.nomor_permintaan LIKE ? OR 
    p.catatan LIKE ? OR
    p.id IN (
      SELECT DISTINCT bp.permintaan_id 
      FROM barang_permintaan bp 
      WHERE bp.nama_barang LIKE ? OR bp.kategori_barang LIKE ?
    )
  )`;
  const searchTerm = `%${filters.search}%`;
  values.push(searchTerm, searchTerm, searchTerm, searchTerm);
  countValues.push(searchTerm, searchTerm, searchTerm, searchTerm);
}

    // Filter by date range
    if (filters.start_date && filters.end_date) {
      query += " AND DATE(p.created_at) BETWEEN ? AND ?";
      countQuery += " AND DATE(p.created_at) BETWEEN ? AND ?";
      values.push(filters.start_date, filters.end_date);
      countValues.push(filters.start_date, filters.end_date);
    }

    // Tentukan order berdasarkan parameter sort
    let orderBy = "p.created_at DESC"; // default terbaru
    if (sort === "terlama") {
      orderBy = "p.created_at ASC";
    }

    query += ` ORDER BY ${orderBy}`;
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
        WHEN 'draft' THEN 1
        WHEN 'menunggu' THEN 2
        WHEN 'diproses' THEN 3
        WHEN 'selesai' THEN 4
        WHEN 'ditolak' THEN 5
        ELSE 6
      END
  `;

    const [rows] = await dbPool.execute(query, [userId]);

    // Format result untuk frontend
    const result = {
      draft: 0,
      menunggu: 0,
      diproses: 0,
      selesai: 0,
      ditolak: 0,
      total: 0,
    };

    rows.forEach((row) => {
      result[row.status] = row.count;
      result.total += row.count;
    });

    return result;
  },

  // Di file models/permintaan.js, dalam fungsi findAllWithFilters:

  // Di file models/permintaan.js, dalam fungsi findAllWithFilters:

  findAllWithFilters: async (
    filters = {},
    page = 1,
    limit = 10,
    sort = "terbaru"
  ) => {
    const offset = (page - 1) * limit;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    // Tentukan order berdasarkan parameter sort
    let orderBy = "p.created_at DESC"; // default terbaru
    if (sort === "terlama") {
      orderBy = "p.created_at ASC";
    }

    let query = `
SELECT 
  p.*, 
  u.nama_lengkap, 
  d.nama_divisi,
  (SELECT COUNT(*) 
   FROM barang_permintaan bp 
   WHERE bp.permintaan_id = p.id) as jumlah_barang
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

    // Filter by status - default exclude draft untuk admin
    if (filters.status) {
      query += " AND p.status = ?";
      countQuery += " AND p.status = ?";
      values.push(filters.status);
      countValues.push(filters.status);
    } else {
      // Jika tidak ada filter status, exclude draft
      query += " AND p.status != 'draft'";
      countQuery += " AND p.status != 'draft'";
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

    query += ` ORDER BY ${orderBy}`;
    query += ` LIMIT ${limitNum} OFFSET ${offsetNum}`;

    console.log("🔍 Admin query dengan jumlah_barang:", query);
    console.log("📊 Admin query values:", values);

    try {
      const [rows] = await dbPool.execute(query, values);
      const [countRows] = await dbPool.execute(countQuery, countValues);

      const total = countRows[0].total;
      const totalPages = Math.ceil(total / limitNum);

      // Format jumlah_barang untuk memastikan selalu ada nilai
      const formattedRows = rows.map((row) => ({
        ...row,
        jumlah_barang: parseInt(row.jumlah_barang) || 0,
      }));

      console.log(
        "✅ Admin query dengan jumlah_barang berhasil. Total rows:",
        formattedRows.length
      );

      return {
        data: formattedRows,
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

  // Get draft permintaan by user ID (untuk halaman draft)
  // Get draft permintaan by user ID (untuk halaman draft)
  findDraftByUserIdWithPagination: async (
    userId,
    page = 1,
    limit = 5,
    filters = {}
  ) => {
    const offset = (page - 1) * limit;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    console.log("📝 Getting draft permintaan:", {
      userId,
      pageNum,
      limitNum,
      offsetNum,
      filters,
    });

    let query = `
    SELECT 
      p.*, 
      u.nama_lengkap, 
      d.nama_divisi,
      (SELECT SUM(bp.jumlah) 
       FROM barang_permintaan bp 
       WHERE bp.permintaan_id = p.id) as jumlah_barang_total,
      (SELECT COUNT(*) 
       FROM barang_permintaan bp 
       WHERE bp.permintaan_id = p.id) as jumlah_item_barang
    FROM permintaan p 
    JOIN users u ON p.user_id = u.id 
    JOIN divisi d ON u.divisi_id = d.id 
    WHERE p.user_id = ? AND p.status = 'draft'
  `;

    let countQuery = `
    SELECT COUNT(*) as total 
    FROM permintaan p 
    JOIN users u ON p.user_id = u.id 
    WHERE p.user_id = ? AND p.status = 'draft'
  `;

    const values = [userId];
    const countValues = [userId];

    // Search by nomor permintaan atau catatan
    if (filters.search) {
      query += ` AND (p.nomor_permintaan LIKE ? OR p.catatan LIKE ?)`;
      countQuery += ` AND (p.nomor_permintaan LIKE ? OR p.catatan LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm);
      countValues.push(searchTerm, searchTerm);
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

    console.log("🔍 Draft query:", query);
    console.log("📊 Draft query values:", values);

    try {
      const [rows] = await dbPool.execute(query, values);
      const [countRows] = await dbPool.execute(countQuery, countValues);

      const total = countRows[0].total;
      const totalPages = Math.ceil(total / limitNum);

      console.log(
        "✅ Draft query successful. Total:",
        total,
        "Total pages:",
        totalPages
      );

      // Format jumlah barang
      const formattedRows = rows.map((row) => ({
        ...row,

        jumlah_item_barang: row.jumlah_item_barang || 0,
      }));

      return {
        data: formattedRows,
        total: total,
        page: pageNum,
        limit: limitNum,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error("💥 Draft database query error:", error);
      throw error;
    }
  },

  // Update permintaan
  // Update permintaan
  update: async (id, permintaanData) => {
    let { tanggal_kebutuhan, catatan, status } = permintaanData;

    // ✅ KONVERSI TANGGAL: Ubah format ISO ke YYYY-MM-DD jika perlu
    if (
      tanggal_kebutuhan &&
      typeof tanggal_kebutuhan === "string" &&
      tanggal_kebutuhan.includes("T")
    ) {
      const dateObj = new Date(tanggal_kebutuhan);
      tanggal_kebutuhan = dateObj.toISOString().split("T")[0];
      console.log("📅 Model - Tanggal dikonversi ke:", tanggal_kebutuhan);
    }

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

  // Di dalam file models/permintaan.js, tambahkan fungsi ini:

  findAllWithFiltersForExport: async (filters = {}) => {
    let query = `
    SELECT 
      p.*, 
      u.nama_lengkap, 
      d.nama_divisi,
      (SELECT COUNT(*) 
       FROM barang_permintaan bp 
       WHERE bp.permintaan_id = p.id) as jumlah_barang
    FROM permintaan p 
    JOIN users u ON p.user_id = u.id 
    JOIN divisi d ON u.divisi_id = d.id 
    WHERE 1=1
  `;

    const values = [];

    // Filter by status - default exclude draft untuk admin
    if (filters.status && filters.status !== "semua") {
      query += " AND p.status = ?";
      values.push(filters.status);
    } else {
      query += " AND p.status != 'draft'";
    }

    // Filter by divisi
    if (filters.divisi_id) {
      query += " AND u.divisi_id = ?";
      values.push(filters.divisi_id);
    }

    // Filter by date range
    if (filters.start_date && filters.end_date) {
      query += " AND DATE(p.created_at) BETWEEN ? AND ?";
      values.push(filters.start_date, filters.end_date);
    }

    // Search by nomor permintaan atau nama pemohon
    if (filters.search) {
      query += " AND (p.nomor_permintaan LIKE ? OR u.nama_lengkap LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm);
    }

    query += " ORDER BY p.created_at DESC";

    console.log("🔍 Export query:", query);
    console.log("📊 Export query values:", values);

    try {
      const [rows] = await dbPool.execute(query, values);
      return rows;
    } catch (error) {
      console.error("💥 Export find all error:", error);
      throw error;
    }
  },

// permintaan.js - Pastikan fungsi findAllRiwayatWithFilters sudah benar
findAllRiwayatWithFilters: async (
  filters = {},
  page = 1,
  limit = 5,
  sort = "terbaru"
) => {
  const offset = (page - 1) * limit;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offsetNum = parseInt(offset);

  // Tentukan order berdasarkan parameter sort
  let orderBy = "p.created_at DESC"; // default terbaru
  if (sort === "terlama") {
    orderBy = "p.created_at ASC";
  }

  let query = `
    SELECT 
      p.*, 
      u.nama_lengkap, 
      d.nama_divisi,
      (SELECT COUNT(*) 
       FROM barang_permintaan bp 
       WHERE bp.permintaan_id = p.id) as jumlah_barang
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

  if (filters.status && filters.status !== "" && filters.status !== "semua") {
    // Jika ada filter status spesifik
    query += " AND p.status = ?";
    countQuery += " AND p.status = ?";
    values.push(filters.status);
    countValues.push(filters.status);
  } else {
    // Default: tampilkan kedua status riwayat
    query += " AND p.status IN ('selesai', 'ditolak')";
    countQuery += " AND p.status IN ('selesai', 'ditolak')";
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

  query += ` ORDER BY ${orderBy}`;
  query += ` LIMIT ${limitNum} OFFSET ${offsetNum}`;

  console.log("🔍 Riwayat query:", query);
  console.log("📊 Riwayat query values:", values);

  try {
    const [rows] = await dbPool.execute(query, values);
    const [countRows] = await dbPool.execute(countQuery, countValues);

    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limitNum);

    // Format jumlah_barang untuk memastikan selalu ada nilai
    const formattedRows = rows.map((row) => ({
      ...row,
      jumlah_barang: parseInt(row.jumlah_barang) || 0,
    }));

    console.log(
      "✅ Riwayat query berhasil. Total rows:",
      formattedRows.length,
      "Data sample:",
      formattedRows.length > 0 ? {
        id: formattedRows[0].id,
        nomor_permintaan: formattedRows[0].nomor_permintaan,
        status: formattedRows[0].status
      } : 'No data'
    );

    return {
      data: formattedRows,
      total: total,
      page: pageNum,
      limit: limitNum,
      totalPages: totalPages,
    };
  } catch (error) {
    console.error("💥 Riwayat find all error:", error);
    throw error;
  }
},
};

export default Permintaan;

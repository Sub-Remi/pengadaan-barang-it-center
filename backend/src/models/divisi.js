import dbPool from "../config/database.js";

const Divisi = {
  // Get all divisi dengan pagination
  findAllWithPagination: async (page = 1, limit = 10, search = "") => {
    const offset = (page - 1) * limit;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    let query = `
      SELECT * FROM divisi 
      WHERE 1=1
    `;

    let countQuery = `
      SELECT COUNT(*) as total 
      FROM divisi 
      WHERE 1=1
    `;

    const values = [];
    const countValues = [];

    if (search) {
      query += " AND nama_divisi LIKE ?";
      countQuery += " AND nama_divisi LIKE ?";
      const searchTerm = `%${search}%`;
      values.push(searchTerm);
      countValues.push(searchTerm);
    }

    query += " ORDER BY nama_divisi ASC";
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
      console.error("💥 Divisi find all error:", error);
      throw error;
    }
  },

  // Get all divisi untuk dropdown (tanpa pagination)
  findAll: async () => {
    const query = "SELECT * FROM divisi ORDER BY nama_divisi ASC";
    const [rows] = await dbPool.execute(query);
    return rows;
  },

  // Find divisi by ID
  findById: async (id) => {
    const query = "SELECT * FROM divisi WHERE id = ?";
    const [rows] = await dbPool.execute(query, [id]);
    return rows[0];
  },

  // Find divisi by nama
  findByNama: async (nama_divisi) => {
    const query = "SELECT * FROM divisi WHERE nama_divisi = ?";
    const [rows] = await dbPool.execute(query, [nama_divisi]);
    return rows[0];
  },

  // Create new divisi
  create: async (nama_divisi) => {
    const query = "INSERT INTO divisi (nama_divisi) VALUES (?)";
    const [result] = await dbPool.execute(query, [nama_divisi]);
    return result.insertId;
  },

  // Update divisi
  update: async (id, nama_divisi) => {
    const query = "UPDATE divisi SET nama_divisi = ? WHERE id = ?";
    const [result] = await dbPool.execute(query, [nama_divisi, id]);
    return result.affectedRows;
  },

  // Delete divisi
  delete: async (id) => {
    // Cek apakah divisi digunakan di tabel users
    const checkQuery =
      "SELECT COUNT(*) as count FROM users WHERE divisi_id = ?";
    const [checkRows] = await dbPool.execute(checkQuery, [id]);

    if (checkRows[0].count > 0) {
      throw new Error(
        "Tidak dapat menghapus divisi karena masih digunakan oleh pengguna."
      );
    }

    const query = "DELETE FROM divisi WHERE id = ?";
    const [result] = await dbPool.execute(query, [id]);
    return result.affectedRows;
  },

  // Get divisi statistics
  getStats: async () => {
    const query = `
      SELECT 
        d.id,
        d.nama_divisi,
        COUNT(u.id) as jumlah_pengguna
      FROM divisi d
      LEFT JOIN users u ON d.id = u.divisi_id AND u.is_active = true
      GROUP BY d.id, d.nama_divisi
      ORDER BY d.nama_divisi
    `;
    const [rows] = await dbPool.execute(query);
    return rows;
  },
};

export default Divisi;

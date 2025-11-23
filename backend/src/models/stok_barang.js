import dbPool from "../config/database.js";

const StokBarang = {
  // Get all stok dengan pagination
  findAllWithPagination: async (page = 1, limit = 10, search = "") => {
    const offset = (page - 1) * limit;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    let query = `
      SELECT * FROM stok_barang 
      WHERE 1=1
    `;

    let countQuery = `
      SELECT COUNT(*) as total 
      FROM stok_barang 
      WHERE 1=1
    `;

    const values = [];
    const countValues = [];

    if (search) {
      query +=
        " AND (nama_barang LIKE ? OR kategori_barang LIKE ? OR kode_barang LIKE ?)";
      countQuery +=
        " AND (nama_barang LIKE ? OR kategori_barang LIKE ? OR kode_barang LIKE ?)";
      const searchTerm = `%${search}%`;
      values.push(searchTerm, searchTerm, searchTerm);
      countValues.push(searchTerm, searchTerm, searchTerm);
    }

    query += " ORDER BY nama_barang ASC";
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
      console.error("💥 Stok find all error:", error);
      throw error;
    }
  },

  // Find by ID
  findById: async (id) => {
    const query = "SELECT * FROM stok_barang WHERE id = ?";
    const [rows] = await dbPool.execute(query, [id]);
    return rows[0];
  },

  // Find stok by nama barang dan spesifikasi
  findByNamaAndSpesifikasi: async (nama_barang, spesifikasi) => {
    const query =
      "SELECT * FROM stok_barang WHERE nama_barang = ? AND spesifikasi = ?";
    const [rows] = await dbPool.execute(query, [nama_barang, spesifikasi]);
    return rows[0];
  },

  // Create new stok
  create: async (stokData) => {
    const {
      kode_barang,
      kategori_barang,
      nama_barang,
      spesifikasi,
      satuan,
      stok,
      stok_minimum,
    } = stokData;
    const query = `
      INSERT INTO stok_barang 
      (kode_barang, kategori_barang, nama_barang, spesifikasi, satuan, stok, stok_minimum) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await dbPool.execute(query, [
      kode_barang,
      kategori_barang,
      nama_barang,
      spesifikasi,
      satuan,
      stok,
      stok_minimum,
    ]);
    return result.insertId;
  },

  // Update stok
  update: async (id, stokData) => {
    const {
      kategori_barang,
      nama_barang,
      spesifikasi,
      satuan,
      stok,
      stok_minimum,
    } = stokData;
    const query = `
      UPDATE stok_barang 
      SET kategori_barang = ?, nama_barang = ?, spesifikasi = ?, satuan = ?, stok = ?, stok_minimum = ?
      WHERE id = ?
    `;
    const [result] = await dbPool.execute(query, [
      kategori_barang,
      nama_barang,
      spesifikasi,
      satuan,
      stok,
      stok_minimum,
      id,
    ]);
    return result.affectedRows;
  },

  // Delete stok
  delete: async (id) => {
    const query = "DELETE FROM stok_barang WHERE id = ?";
    const [result] = await dbPool.execute(query, [id]);
    return result.affectedRows;
  },

  // Update stok quantity
  updateStokQuantity: async (id, newStok) => {
    const query = "UPDATE stok_barang SET stok = ? WHERE id = ?";
    const [result] = await dbPool.execute(query, [newStok, id]);
    return result.affectedRows;
  },
};

export default StokBarang;

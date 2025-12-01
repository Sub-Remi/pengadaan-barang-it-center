import dbPool from "../config/database.js";

const SatuanBarang = {
  // Get all satuan untuk dropdown
  findAll: async () => {
    const query = "SELECT * FROM satuan_barang ORDER BY nama_satuan ASC";
    const [rows] = await dbPool.execute(query);
    return rows;
  },

  // Get dengan pagination untuk tabel - ✅ PERBAIKAN
findAllWithPagination: async (page = 1, limit = 10, search = "") => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;
  
  let query = `
    SELECT * FROM satuan_barang 
    WHERE 1=1
  `;
  
  let countQuery = `
    SELECT COUNT(*) as total 
    FROM satuan_barang 
    WHERE 1=1
  `;
  
  const values = [];
  const countValues = [];
  
  if (search) {
    query += " AND nama_satuan LIKE ?";
    countQuery += " AND nama_satuan LIKE ?";
    const searchTerm = `%${search}%`;
    values.push(searchTerm);
    countValues.push(searchTerm);
  }
  
  query += " ORDER BY nama_satuan ASC";
  
  // ✅ PERBAIKAN: Tambahkan langsung ke query string
  query += ` LIMIT ${limitNum} OFFSET ${offset}`;
  
  try {
    const [rows] = search 
      ? await dbPool.execute(query, values)
      : await dbPool.execute(query);
    
    const [countRows] = search
      ? await dbPool.execute(countQuery, countValues)
      : await dbPool.execute(countQuery);
    
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limitNum);
    
    return {
      data: rows,
      total: total,
      page: pageNum,
      limit: limitNum,
      totalPages: totalPages
    };
  } catch (error) {
    console.error("💥 Satuan find all error:", error);
    throw error;
  }
},

  // Find by ID
  findById: async (id) => {
    const query = "SELECT * FROM satuan_barang WHERE id = ?";
    const [rows] = await dbPool.execute(query, [id]);
    return rows[0];
  },

  // Find by nama (untuk validasi)
  findByNama: async (nama_satuan) => {
    const query = "SELECT * FROM satuan_barang WHERE nama_satuan = ?";
    const [rows] = await dbPool.execute(query, [nama_satuan]);
    return rows[0];
  },

  // Create new satuan
  create: async (nama_satuan) => {
    const query = "INSERT INTO satuan_barang (nama_satuan) VALUES (?)";
    const [result] = await dbPool.execute(query, [nama_satuan]);
    return result.insertId;
  },

  // Update satuan
  update: async (id, nama_satuan) => {
    const query = "UPDATE satuan_barang SET nama_satuan = ? WHERE id = ?";
    const [result] = await dbPool.execute(query, [nama_satuan, id]);
    return result.affectedRows;
  },

  // Delete satuan (dengan cek apakah digunakan)
  delete: async (id) => {
    // Cek apakah satuan digunakan di stok_barang
    const checkQuery = "SELECT COUNT(*) as count FROM stok_barang WHERE satuan_barang_id = ?";
    const [checkRows] = await dbPool.execute(checkQuery, [id]);
    
    if (checkRows[0].count > 0) {
      throw new Error("Tidak dapat menghapus satuan karena masih digunakan oleh barang.");
    }
    
    const query = "DELETE FROM satuan_barang WHERE id = ?";
    const [result] = await dbPool.execute(query, [id]);
    return result.affectedRows;
  }
};

export default SatuanBarang;
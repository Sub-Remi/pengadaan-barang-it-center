import dbPool from "../config/database.js";

const KategoriBarang = {
  // Get all kategori untuk dropdown
  findAll: async () => {
    const query = "SELECT * FROM kategori_barang ORDER BY nama_kategori ASC";
    const [rows] = await dbPool.execute(query);
    return rows;
  },

  // Get dengan pagination untuk tabel - ✅ PERBAIKAN DI SINI
findAllWithPagination: async (page = 1, limit = 10, search = "") => {
  // Pastikan page dan limit adalah number
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;
  
  let query = `
    SELECT * FROM kategori_barang 
    WHERE 1=1
  `;
  
  let countQuery = `
    SELECT COUNT(*) as total 
    FROM kategori_barang 
    WHERE 1=1
  `;
  
  const values = [];
  const countValues = [];
  
  if (search) {
    query += " AND nama_kategori LIKE ?";
    countQuery += " AND nama_kategori LIKE ?";
    const searchTerm = `%${search}%`;
    values.push(searchTerm);
    countValues.push(searchTerm);
  }
  
  query += " ORDER BY nama_kategori ASC";
  
  // ✅ PERBAIKAN: Tambahkan LIMIT dan OFFSET ke query string, bukan sebagai parameter
  query += ` LIMIT ${limitNum} OFFSET ${offset}`;
  
  try {
    // ✅ PERBAIKAN: Jika ada search, gunakan values, jika tidak, jangan kirim parameter
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
    console.error("💥 Kategori find all error:", error);
    throw error;
  }
},

  // Find by ID
  findById: async (id) => {
    const query = "SELECT * FROM kategori_barang WHERE id = ?";
    const [rows] = await dbPool.execute(query, [id]);
    return rows[0];
  },

  // Find by nama (untuk validasi)
  findByNama: async (nama_kategori) => {
    const query = "SELECT * FROM kategori_barang WHERE nama_kategori = ?";
    const [rows] = await dbPool.execute(query, [nama_kategori]);
    return rows[0];
  },

  // Create new kategori
  create: async (nama_kategori) => {
    const query = "INSERT INTO kategori_barang (nama_kategori) VALUES (?)";
    const [result] = await dbPool.execute(query, [nama_kategori]);
    return result.insertId;
  },

  // Update kategori
  update: async (id, nama_kategori) => {
    const query = "UPDATE kategori_barang SET nama_kategori = ? WHERE id = ?";
    const [result] = await dbPool.execute(query, [nama_kategori, id]);
    return result.affectedRows;
  },

  // Delete kategori (dengan cek apakah digunakan)
  delete: async (id) => {
    // Cek apakah kategori digunakan di stok_barang
    const checkQuery = "SELECT COUNT(*) as count FROM stok_barang WHERE kategori_barang_id = ?";
    const [checkRows] = await dbPool.execute(checkQuery, [id]);
    
    if (checkRows[0].count > 0) {
      throw new Error("Tidak dapat menghapus kategori karena masih digunakan oleh barang.");
    }
    
    const query = "DELETE FROM kategori_barang WHERE id = ?";
    const [result] = await dbPool.execute(query, [id]);
    return result.affectedRows;
  }
};

export default KategoriBarang;
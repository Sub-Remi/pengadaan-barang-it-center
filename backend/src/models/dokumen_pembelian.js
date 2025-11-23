import dbPool from "../config/database.js";

const DokumenPembelian = {
  // Create new dokumen pembelian
  create: async (dokumenData) => {
    const {
      barang_permintaan_id,
      jenis_dokumen,
      nomor_dokumen,
      tanggal_dokumen,
      vendor,
      total_harga,
      file_url,
      original_name,
      file_size,
      uploaded_by,
      catatan,
    } = dokumenData;

    const query = `
      INSERT INTO dokumen_pembelian 
      (barang_permintaan_id, jenis_dokumen, nomor_dokumen, tanggal_dokumen, 
       vendor, total_harga, file_url, original_name, file_size, uploaded_by, catatan) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await dbPool.execute(query, [
      barang_permintaan_id,
      jenis_dokumen,
      nomor_dokumen,
      tanggal_dokumen,
      vendor,
      total_harga,
      file_url,
      original_name,
      file_size,
      uploaded_by,
      catatan,
    ]);

    return result.insertId;
  },

  // Find by ID
  findById: async (id) => {
    const query = `
      SELECT 
        dp.*,
        bp.nama_barang,
        bp.spesifikasi,
        p.nomor_permintaan,
        u.nama_lengkap as uploader_name
      FROM dokumen_pembelian dp
      JOIN barang_permintaan bp ON dp.barang_permintaan_id = bp.id
      JOIN permintaan p ON bp.permintaan_id = p.id
      LEFT JOIN users u ON dp.uploaded_by = u.id
      WHERE dp.id = ?
    `;
    const [rows] = await dbPool.execute(query, [id]);
    return rows[0];
  },

  // Find by barang_permintaan_id
  findByBarangPermintaanId: async (barang_permintaan_id) => {
    const query = `
      SELECT 
        dp.*,
        u.nama_lengkap as uploader_name
      FROM dokumen_pembelian dp
      LEFT JOIN users u ON dp.uploaded_by = u.id
      WHERE dp.barang_permintaan_id = ?
      ORDER BY dp.created_at DESC
    `;
    const [rows] = await dbPool.execute(query, [barang_permintaan_id]);
    return rows;
  },

  // Find by permintaan_id (all dokumen for a permintaan)
  findByPermintaanId: async (permintaan_id) => {
    const query = `
      SELECT 
        dp.*,
        bp.nama_barang,
        bp.spesifikasi,
        u.nama_lengkap as uploader_name
      FROM dokumen_pembelian dp
      JOIN barang_permintaan bp ON dp.barang_permintaan_id = bp.id
      LEFT JOIN users u ON dp.uploaded_by = u.id
      WHERE bp.permintaan_id = ?
      ORDER BY dp.created_at DESC
    `;
    const [rows] = await dbPool.execute(query, [permintaan_id]);
    return rows;
  },

  // Update dokumen
  update: async (id, dokumenData) => {
    const {
      jenis_dokumen,
      nomor_dokumen,
      tanggal_dokumen,
      vendor,
      total_harga,
      catatan,
    } = dokumenData;

    const query = `
      UPDATE dokumen_pembelian 
      SET jenis_dokumen = ?, nomor_dokumen = ?, tanggal_dokumen = ?, 
          vendor = ?, total_harga = ?, catatan = ?
      WHERE id = ?
    `;
    const [result] = await dbPool.execute(query, [
      jenis_dokumen,
      nomor_dokumen,
      tanggal_dokumen,
      vendor,
      total_harga,
      catatan,
      id,
    ]);
    return result.affectedRows;
  },

  // Delete dokumen
  delete: async (id) => {
    // First get file path to delete physical file
    const dokumen = await DokumenPembelian.findById(id);

    const query = "DELETE FROM dokumen_pembelian WHERE id = ?";
    const [result] = await dbPool.execute(query, [id]);

    // Return both affectedRows and file path for cleanup
    return {
      affectedRows: result.affectedRows,
      filePath: dokumen ? dokumen.file_url : null,
    };
  },

  // Update validation status by validator
  updateValidation: async (id, is_valid, catatan_validator) => {
    const query = `
      UPDATE dokumen_pembelian 
      SET is_valid = ?, catatan_validator = ?, validated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    const [result] = await dbPool.execute(query, [
      is_valid,
      catatan_validator,
      id,
    ]);
    return result.affectedRows;
  },

  // Get dokumen statistics
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

  // Get dokumen yang perlu divalidasi (for validator)
  getDokumenForValidation: async () => {
    const query = `
      SELECT 
        dp.*,
        bp.nama_barang,
        bp.spesifikasi,
        p.nomor_permintaan,
        u.nama_lengkap as pemohon,
        d.nama_divisi
      FROM dokumen_pembelian dp
      JOIN barang_permintaan bp ON dp.barang_permintaan_id = bp.id
      JOIN permintaan p ON bp.permintaan_id = p.id
      JOIN users u ON p.user_id = u.id
      JOIN divisi d ON u.divisi_id = d.id
      WHERE dp.is_valid IS NULL
      ORDER BY dp.created_at DESC
    `;
    const [rows] = await dbPool.execute(query);
    return rows;
  },
};

export default DokumenPembelian;

import dbPool from "../config/database.js";

const PenerimaanBarang = {
  // Create new penerimaan
  create: async (penerimaanData) => {
    const {
      barang_permintaan_id,
      tanggal_penerimaan,
      penerima,
      nama_barang,
      spesifikasi,
      jumlah_dipesan,
      jumlah_diterima,
      diperiksa_oleh,
      tanggal_pemeriksaan,
      foto_bukti,
    } = penerimaanData;

    const query = `
      INSERT INTO penerimaan_barang 
      (barang_permintaan_id, tanggal_penerimaan, penerima, nama_barang, spesifikasi, 
       jumlah_dipesan, jumlah_diterima, diperiksa_oleh, tanggal_pemeriksaan, foto_bukti) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await dbPool.execute(query, [
      barang_permintaan_id,
      tanggal_penerimaan,
      penerima,
      nama_barang,
      spesifikasi,
      jumlah_dipesan,
      jumlah_diterima,
      diperiksa_oleh,
      tanggal_pemeriksaan,
      foto_bukti,
    ]);

    return result.insertId;
  },

  // Find by ID
  findById: async (id) => {
    const query = `
      SELECT pb.*, bp.permintaan_id, bp.kategori_barang, p.nomor_permintaan
      FROM penerimaan_barang pb
      JOIN barang_permintaan bp ON pb.barang_permintaan_id = bp.id
      JOIN permintaan p ON bp.permintaan_id = p.id
      WHERE pb.id = ?
    `;
    const [rows] = await dbPool.execute(query, [id]);
    return rows[0];
  },

  // Find by barang_permintaan_id
  findByBarangPermintaanId: async (barang_permintaan_id) => {
    const query =
      "SELECT * FROM penerimaan_barang WHERE barang_permintaan_id = ?";
    const [rows] = await dbPool.execute(query, [barang_permintaan_id]);
    return rows[0];
  },
};

export default PenerimaanBarang;

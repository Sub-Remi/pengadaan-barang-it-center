// Temporary controller untuk validator - bisa diisi nanti
export const getPermintaanForValidation = async (req, res) => {
  try {
    res.json({ 
      message: 'Daftar permintaan untuk validasi',
      data: [] 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const validateBarang = async (req, res) => {
  try {
    const { id } = req.params;
    res.json({ 
      message: `Barang dengan ID ${id} berhasil divalidasi` 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default{
    getPermintaanForValidation,
    validateBarang
}
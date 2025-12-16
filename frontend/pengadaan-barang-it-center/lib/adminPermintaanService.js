import axiosInstance from "./axiosConfig";

const adminPermintaanService = {
  // Get all permintaan untuk admin
  getAllPermintaan: async (
    page = 1,
    limit = 10,
    filters = {},
    sort = "terbaru"
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      // Tambahkan parameter sort
      params.append("sort", sort);

      if (filters.search) params.append("search", filters.search);
      if (filters.status && filters.status !== "semua")
        params.append("status", filters.status);
      if (filters.divisi_id && filters.divisi_id !== "semua")
        params.append("divisi_id", filters.divisi_id);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const url = `/admin/permintaan?${params.toString()}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error("❌ [adminPermintaanService] Error:", error);
      throw error;
    }
  },

  // Get detail permintaan untuk admin
  getDetailPermintaan: async (id) => {
    try {
      const response = await axiosInstance.get(`/admin/permintaan/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ [adminPermintaanService] Error:", error);
      throw error;
    }
  },

  // Update status permintaan
  updatePermintaanStatus: async (id, status) => {
    try {
      const response = await axiosInstance.put(
        `/admin/permintaan/${id}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error("❌ [adminPermintaanService] Error:", error);
      throw error;
    }
  },

  // Update status barang
  updateBarangStatus: async (id, status, catatan_admin = "") => {
    try {
      const response = await axiosInstance.put(`/admin/barang/${id}/status`, {
        status,
        catatan_admin,
      });
      return response.data;
    } catch (error) {
      console.error("❌ [adminPermintaanService] Error:", error);
      throw error;
    }
  },
};

export default adminPermintaanService;

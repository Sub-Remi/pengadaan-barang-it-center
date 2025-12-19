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

// adminPermintaanService.js - Perbaiki fungsi getPermintaanRiwayat
  getPermintaanRiwayat: async (page = 1, limit = 10, filters = {}, sort = "terbaru") => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      params.append("sort", sort);

      if (filters.status && filters.status !== "") {
      params.append("status", filters.status);
      }
      if (filters.search) params.append("search", filters.search);
      if (filters.divisi_id && filters.divisi_id !== "semua")
        params.append("divisi_id", filters.divisi_id);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      // Coba endpoint riwayat khusus
      const url = `/admin/permintaan/riwayat?${params.toString()}`;
      console.log("🔍 Mencoba endpoint riwayat:", url);
      
      const response = await axiosInstance.get(url);
      console.log("✅ Endpoint riwayat berhasil");
      return response.data;
    } catch (error) {
      console.error("❌ Endpoint /admin/permintaan/riwayat gagal:", error.message);
      
      // FALLBACK 1: Coba endpoint biasa dengan multiple status
      try {
        console.log("🔄 Mencoba fallback dengan endpoint biasa...");
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        params.append("sort", sort);
        
        // Kirim status multiple sebagai array atau string
        params.append("status", "selesai,ditolak");
        
        if (filters.search) params.append("search", filters.search);
        if (filters.divisi_id && filters.divisi_id !== "semua")
          params.append("divisi_id", filters.divisi_id);
        if (filters.start_date) params.append("start_date", filters.start_date);
        if (filters.end_date) params.append("end_date", filters.end_date);
        
        const fallbackUrl = `/admin/permintaan?${params.toString()}`;
        console.log("🔄 Mencoba fallback ke:", fallbackUrl);
        
        const response = await axiosInstance.get(fallbackUrl);
        console.log("✅ Fallback berhasil, data ditemukan:", response.data.data?.length || 0);
        
        // Filter manual untuk memastikan hanya selesai dan ditolak
        if (response.data.data && Array.isArray(response.data.data)) {
          const filteredData = response.data.data.filter(item => 
            item.status === 'selesai' || item.status === 'ditolak'
          );
          
          return {
            ...response.data,
            data: filteredData,
            message: "Data riwayat berhasil diambil (fallback)"
          };
        }
        
        return response.data;
      } catch (fallbackError) {
        console.error("❌ Fallback juga gagal:", fallbackError.message);
        
        // FALLBACK 2: Coba endpoint debug untuk melihat apakah server berjalan
        try {
          console.log("🔧 Mencoba endpoint debug...");
          const debugResponse = await axiosInstance.get("/admin/debug/riwayat-data");
          console.log("🔧 Debug endpoint berhasil, data:", debugResponse.data.data?.length || 0);
          
          return {
            message: "Data riwayat dari debug endpoint",
            data: debugResponse.data.data || [],
            pagination: {
              currentPage: page,
              totalPages: 1,
              totalItems: debugResponse.data.count || 0,
              itemsPerPage: limit,
            }
          };
        } catch (debugError) {
          console.error("❌ Semua fallback gagal:", debugError.message);
          throw new Error("Tidak dapat mengakses data riwayat. Periksa koneksi server.");
        }
      }
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
// lib/permintaanService.js
import axios from "axios";
import authService from "./authService";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menambahkan token
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handle response error
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      authService.logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const permintaanService = {
  // Membuat permintaan baru
  createPermintaan: async (data) => {
    try {
      const response = await apiClient.post("/pemohon/permintaan", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Mengambil daftar permintaan dengan filter
  getPermintaan: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== "") {
          if (Array.isArray(filters[key])) {
            params.append(key, filters[key].join(","));
          } else {
            params.append(key, filters[key]);
          }
        }
      });
      const response = await apiClient.get(
        `/pemohon/permintaan?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Mengambil detail permintaan
  getDetailPermintaan: async (id) => {
    try {
      const response = await apiClient.get(`/pemohon/permintaan/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Menambahkan barang ke permintaan
  addBarangToPermintaan: async (permintaanId, data) => {
    try {
      const response = await apiClient.post(
        `/pemohon/permintaan/${permintaanId}/barang`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Submit permintaan (mengubah dari draft ke menunggu)
  submitPermintaan: async (permintaanId) => {
    try {
      const response = await apiClient.put(
        `/pemohon/permintaan/${permintaanId}/submit`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Mengambil count untuk dashboard
  getCountByStatus: async () => {
    try {
      const response = await apiClient.get(
        "/pemohon/permintaan/count-by-status"
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Update draft permintaan
  updateDraftPermintaan: async (permintaanId, data) => {
    try {
      const response = await apiClient.put(
        `/pemohon/permintaan/${permintaanId}/draft`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Menghapus permintaan (draft)
  deletePermintaan: async (permintaanId) => {
    try {
      const response = await apiClient.delete(`/pemohon/permintaan/${permintaanId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Mengambil daftar draft permintaan
  getDraftPermintaan: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== "") {
          params.append(key, filters[key]);
        }
      });
      const response = await apiClient.get(
        `/pemohon/permintaan/draft?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Menghapus semua barang dari permintaan (untuk keperluan update draft)
  deleteAllBarangFromPermintaan: async (permintaanId) => {
    try {
      const response = await apiClient.delete(`/pemohon/permintaan/${permintaanId}/barang/all`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Update permintaan (bukan draft)
  updatePermintaan: async (id, data) => {
    try {
      const response = await apiClient.put(`/pemohon/permintaan/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Delete barang dari permintaan
  deleteBarangPermintaan: async (permintaanId, barangId) => {
    try {
      const response = await apiClient.delete(`/pemohon/permintaan/${permintaanId}/barang/${barangId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // **TAMBAHAN BARU UNTUK NOTIFIKASI DAN DASHBOARD**

  // Mengambil total jumlah untuk dashboard
  getDashboardCounts: async () => {
    try {
      const response = await apiClient.get("/pemohon/permintaan/dashboard/counts");
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Mengecek perubahan status terbaru
  checkStatusChanges: async (lastChecked) => {
    try {
      const response = await apiClient.get("/pemohon/permintaan/status-changes", {
        params: { lastChecked }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Mengambil summary status untuk dashboard
  getStatusSummary: async () => {
    try {
      const response = await apiClient.get("/pemohon/permintaan/status-summary");
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Mengambil riwayat permintaan (selesai/ditolak)
  getRiwayatPermintaan: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== "") {
          params.append(key, filters[key]);
        }
      });
      const response = await apiClient.get(
        `/pemohon/permintaan/riwayat?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Mengambil jumlah riwayat
  getRiwayatCount: async () => {
    try {
      const response = await apiClient.get("/pemohon/permintaan/riwayat/count");
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Mark status changes as read
  markStatusChangesAsRead: async (permintaanIds = []) => {
    try {
      const response = await apiClient.post("/pemohon/permintaan/mark-read", {
        permintaanIds
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Get permintaan yang memiliki status "menunggu" atau "diproses"
  getActivePermintaan: async () => {
    try {
      const response = await apiClient.get("/pemohon/permintaan/active");
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Get latest updates untuk notifikasi
  getLatestUpdates: async () => {
    try {
      const response = await apiClient.get("/pemohon/permintaan/latest-updates");
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Export data ke Excel
  exportToExcel: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== "") {
          params.append(key, filters[key]);
        }
      });
      
      const response = await apiClient.get(
        `/pemohon/permintaan/export/excel?${params.toString()}`,
        {
          responseType: 'blob' // Penting untuk download file
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Export data ke PDF
  exportToPDF: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== "") {
          params.append(key, filters[key]);
        }
      });
      
      const response = await apiClient.get(
        `/pemohon/permintaan/export/pdf?${params.toString()}`,
        {
          responseType: 'blob'
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  // Get permintaan dengan status tertentu untuk notifikasi
  getPermintaanByStatuses: async (statuses = []) => {
    try {
      const response = await apiClient.get("/pemohon/permintaan/by-status", {
        params: { statuses: statuses.join(",") }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  }
};

export default permintaanService;
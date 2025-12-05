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
        if (filters[key]) {
          params.append(key, filters[key]);
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

  deletePermintaan: async (permintaanId) => {
    try {
      const response = await apiClient.delete(
        `/pemohon/permintaan/${permintaanId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },

  getDraftPermintaan: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
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

  // Menghapus permintaan (draft)
  deletePermintaan: async (id) => {
    try {
      const response = await apiClient.delete(`/pemohon/permintaan/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Terjadi kesalahan" };
    }
  },
};

export default permintaanService;

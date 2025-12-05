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

const dropdownService = {
  // Get kategori barang - PUBLIC ENDPOINT
  getKategoriBarang: async (search = "") => {
    try {
      const response = await apiClient.get(
        `/kategori/public${
          search ? `/search?q=${encodeURIComponent(search)}` : ""
        }`
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching kategori:", error);
      // Fallback ke data dummy jika API error
      return [
        { id: 1, nama_kategori: "Elektronik" },
        { id: 2, nama_kategori: "ATK (Alat Tulis Kantor)" },
        { id: 3, nama_kategori: "Furniture" },
        { id: 4, nama_kategori: "IT Hardware" },
        { id: 5, nama_kategori: "Perlengkapan Kantor" },
        { id: 6, nama_kategori: "Kendaraan" },
        { id: 7, nama_kategori: "Lainnya" },
      ];
    }
  },

  // Get satuan barang - PUBLIC ENDPOINT
  getSatuanBarang: async (search = "") => {
    try {
      const response = await apiClient.get(
        `/satuan/public${
          search ? `/search?q=${encodeURIComponent(search)}` : ""
        }`
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching satuan:", error);
      // Fallback ke data dummy jika API error
      return [
        { id: 1, nama_satuan: "Unit" },
        { id: 2, nama_satuan: "Pcs" },
        { id: 3, nama_satuan: "Set" },
        { id: 4, nama_satuan: "Rim" },
        { id: 5, nama_satuan: "Box" },
        { id: 6, nama_satuan: "Lusin" },
        { id: 7, nama_satuan: "Pack" },
        { id: 8, nama_satuan: "Liter" },
        { id: 9, nama_satuan: "Kg" },
      ];
    }
  },

  // Get stok barang untuk dropdown - PRIVATE (perlu token)
  getStokBarang: async (search = "", kategoriId = null) => {
    try {
      let url = "/stok/dropdown";
      const params = new URLSearchParams();

      if (search) {
        params.append("q", search);
      }

      if (kategoriId) {
        url = `/stok/by-kategori/${kategoriId}`;
        if (search) {
          params.append("q", search);
        }
      }

      const queryString = params.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      const response = await apiClient.get(fullUrl);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching stok:", error);
      return []; // Return empty array jika error
    }
  },
};

export default dropdownService;

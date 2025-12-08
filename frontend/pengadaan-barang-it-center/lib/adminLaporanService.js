// File baru: lib/adminLaporanService.js
import axios from 'axios';

const API_URL = 'http://localhost:3200/api/admin';

const adminLaporanService = {
  // Get laporan dengan filter
  getLaporan: async (page = 1, limit = 10, filters = {}) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/permintaan/laporan`, {
        params: {
          page,
          limit,
          ...filters,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Get statistik untuk dashboard
  getStatistik: async (filters = {}) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/permintaan/statistik`, {
        params: filters,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Export ke Excel
  exportExcel: async (filters = {}) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/permintaan/export/excel`, {
        params: filters,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Export ke PDF
  exportPDF: async (filters = {}) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/permintaan/export/pdf`, {
        params: filters,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
};



export default adminLaporanService;
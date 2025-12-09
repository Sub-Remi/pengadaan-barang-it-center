const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3200/api";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const dashboardService = {
  async getDashboardStats() {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(`${API_URL}/admin/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data dashboard");
      }

      const result = await response.json();
      return result.data || {
        permintaanBaru: 0,
        permintaanDiproses: 0,
        totalBarang: 0,
        totalPemesanan: 0,
        totalDivisi: 0,
        totalUser: 0
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Return default values if API fails
      return {
        permintaanBaru: 0,
        permintaanDiproses: 0,
        totalBarang: 0,
        totalPemesanan: 0,
        totalDivisi: 0,
        totalUser: 0
      };
    }
  },

  async getPermintaanByStatus(status) {
    try {
      const token = getToken();
      const response = await fetch(
        `${API_URL}/admin/permintaan?status=${status}&page=1&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      return result.pagination?.totalItems || 0;
    } catch (error) {
      console.error(`Error fetching permintaan with status ${status}:`, error);
      return 0;
    }
  },

  async getTotalCount(endpoint) {
    try {
      const token = getToken();
      const response = await fetch(
        `${API_URL}/${endpoint}?page=1&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      return result.pagination?.totalItems || 0;
    } catch (error) {
      console.error(`Error fetching total ${endpoint}:`, error);
      return 0;
    }
  }
};

export default dashboardService;
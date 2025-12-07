import axiosInstance from "./axiosConfig";

const authService = {
  login: async (username, password) => {
    try {
      const response = await axiosInstance.post("/auth/login/login", {
        username,
        password,
      });

      console.log("Login response:", response.data);

      if (response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error("Login error details:", error.response?.data || error);
      throw (
        error.response?.data || {
          error: "Terjadi kesalahan saat login. Periksa koneksi jaringan Anda.",
        }
      );
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login/login";
  },

  // **PERBAIKAN: Hanya satu fungsi getCurrentUser yang mengambil dari localStorage**
  getCurrentUser: () => {
    try {
      if (typeof window === "undefined") return null;

      // Coba ambil dari localStorage dulu (data user lengkap)
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        // Pastikan user memiliki properti yang diperlukan
        return {
          id: user.id,
          username: user.username,
          nama_lengkap: user.nama_lengkap,
          email: user.email,
          role: user.role,
          divisi_id: user.divisi_id,
        };
      }

      // Jika tidak ada di localStorage, coba decode token
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          return {
            id: payload.id,
            username: payload.username,
            nama_lengkap: payload.nama_lengkap,
            email: payload.email,
            role: payload.role,
            divisi_id: payload.divisi_id,
          };
        } catch (error) {
          console.error("Error decoding token:", error);
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() < payload.exp * 1000;
    } catch {
      return false;
    }
  },

  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user?.role || null;
  },

  getUserName: () => {
    const user = authService.getCurrentUser();
    return user?.nama_lengkap || user?.username || null;
  },

  getUserEmail: () => {
    const user = authService.getCurrentUser();
    return user?.email || null;
  },

  // **TAMBAHKAN: Fungsi untuk mendapatkan nama divisi**
  getUserDivisi: () => {
    const user = authService.getCurrentUser();
    // Divisi ID bisa digunakan untuk mendapatkan nama divisi
    return user?.divisi_id || null;
  },
};

export default authService;

import axiosInstance from "./axiosConfig";

const authService = {
  login: async (username, password) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });

      console.log("Login response:", response.data); // Debug log

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
    window.location.href = "/login";
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing user:", error);
      return null;
    }
  },

  getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    // Basic token validation (you can add more checks here)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() < payload.exp * 1000;
    } catch {
      return false;
    }
  },

  // Helper untuk mendapatkan role
  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user?.role || null;
  },

  // Helper untuk mendapatkan nama
  getUserName: () => {
    const user = authService.getCurrentUser();
    return user?.nama_lengkap || user?.username || null;
  },

  getCurrentUser() {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      // Decode JWT token untuk mendapatkan user info
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.id,
        username: payload.username,
        role: payload.role,
        divisi_id: payload.divisi_id,
        nama_lengkap: payload.nama_lengkap,
        email: payload.email,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },
};

export default authService;

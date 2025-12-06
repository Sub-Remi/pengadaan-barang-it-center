import axiosInstance from "./axiosConfig";

const userService = {
  // Get all users dengan pagination dan filter - DIPERBAIKI
  getAllUsers: async (page = 1, limit = 10, filters = {}) => {
    try {
      console.log("📡 [userService] Fetching users with params:", {
        page,
        limit,
        filters,
      });

      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      // DIPERBAIKI: Hanya kirim filter jika ada nilai
      if (filters.search && filters.search.trim() !== "") {
        params.append("search", filters.search);
      }
      if (filters.role && filters.role !== "semua") {
        params.append("role", filters.role);
      }
      if (filters.divisi_id && filters.divisi_id !== "semua") {
        params.append("divisi_id", filters.divisi_id);
      }
      // JANGAN kirim is_active kecuali jika spesifik diminta

      const url = `/admin/users?${params.toString()}`;
      console.log("📡 [userService] Request URL:", url);

      const response = await axiosInstance.get(url);
      console.log("📡 [userService] Response received:", response.data);

      // Pastikan response format konsisten
      const backendData = response.data;

      return {
        data: backendData.data || [],
        pagination: backendData.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      console.error("❌ [userService] Error fetching users:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      return {
        data: [],
        pagination: {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: limit,
        },
      };
    }
  },

  // Create new user - DIPERBAIKI
  createUser: async (userData) => {
    try {
      console.log("📡 [userService] Creating user with data:", userData);

      // Validasi data sebelum dikirim
      if (
        !userData.username ||
        !userData.password ||
        !userData.nama_lengkap ||
        !userData.role
      ) {
        throw {
          error:
            "Data tidak lengkap. Username, password, nama, dan role wajib diisi.",
        };
      }

      // Format data sesuai dengan backend
      const payload = {
        username: userData.username.trim(),
        password: userData.password,
        nama_lengkap: userData.nama_lengkap.trim(),
        role: userData.role.toLowerCase(),
        email: userData.email ? userData.email.trim() : null,
        divisi_id: userData.divisi_id || null,
      };

      console.log("📡 [userService] Sending payload to backend:", payload);

      const response = await axiosInstance.post("/admin/users", payload);
      console.log("✅ [userService] Create user successful:", response.data);

      return response.data;
    } catch (error) {
      console.error("❌ [userService] Error creating user:", error);

      // Extract error message dari berbagai format
      let errorMessage = "Terjadi kesalahan saat membuat user";

      if (error.response?.data) {
        // Format 1: { error: "message" }
        if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
        // Format 2: { message: "message" }
        else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        // Format 3: String langsung
        else if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        }
        // Format 4: Array errors
        else if (Array.isArray(error.response.data)) {
          errorMessage = error.response.data.join(", ");
        }
      } else if (error.error) {
        // Error dari validasi internal
        errorMessage = error.error;
      } else if (error.message) {
        // Error dari network/axios
        errorMessage = error.message;
      }

      console.error("❌ [userService] Extracted error message:", errorMessage);
      throw { error: errorMessage };
    }
  },

  // Delete user (soft delete)
  deleteUser: async (id) => {
    try {
      console.log("📡 [userService] Deleting user ID:", id);
      const response = await axiosInstance.delete(`/admin/users/${id}`);
      console.log("📡 [userService] Delete response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [userService] Error deleting user:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (error.response?.data?.error) {
        throw { error: error.response.data.error };
      }
      throw { error: error.message || "Terjadi kesalahan saat menghapus user" };
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await axiosInstance.put(`/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  // Reset password
  resetPassword: async (id) => {
    try {
      const response = await axiosInstance.post(
        `/admin/users/${id}/reset-password`
      );
      return response.data;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  },
};

export default userService;

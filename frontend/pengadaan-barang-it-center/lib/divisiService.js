import axiosInstance from "./axiosConfig";

const divisiService = {
  // Get divisi for dropdown
  getDivisiDropdown: async () => {
    try {
      console.log("📡 [divisiService] Fetching divisi dropdown");
      const response = await axiosInstance.get("/admin/divisi/dropdown");
      console.log("📡 [divisiService] Response:", response.data);
      return response.data.data || [];
    } catch (error) {
      console.error("❌ [divisiService] Error fetching divisi:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return []; // Return empty array if error
    }
  },
};

export default divisiService;

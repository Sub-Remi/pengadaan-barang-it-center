import axiosInstance from "./axiosConfig";

const divisiPemohonService = {
  // Get divisi for dropdown - tanpa require admin
  getDivisiDropdown: async () => {
    try {
      console.log("📡 [divisiPemohonService] Fetching divisi dropdown");
      const response = await axiosInstance.get("/pemohon/divisi/dropdown");
      console.log("📡 [divisiPemohonService] Response:", response.data);
      return response.data.data || [];
    } catch (error) {
      console.error("❌ [divisiPemohonService] Error fetching divisi:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return []; // Return empty array if error
    }
  },
};

export default divisiPemohonService;

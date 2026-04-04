import { create } from "zustand";
import { getdashboarddata as getDashboardApi } from "@/api/dashboard";

export const dashboardStore = create((set) => ({
  dashboard: null,
  loading: false,
  error: null,

  fetchDashboard: async () => {
    try {
      set({ loading: true, error: null });

      const res = await getDashboardApi();
      
      set({
        dashboard: res,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.message || "Failed to load dashboard",
        loading: false,
      });
    }
  },

  clearDashboard: () => {
    set({ dashboard: null });
  },
}));

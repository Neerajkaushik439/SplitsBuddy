import {create} from 'zustand'
import {createGroup as createGroupApi} from '../api/groups'
import { dashboardStore } from './dashboardStore'

export const groupStore = create((set) => ({
    loading: false,
    error: null,
  
    createGroup: async (data, navigate) => {
      try {
        set({ loading: true, error: null });
  
        await createGroupApi(data);
  
        //Dashboard refresh
        dashboardStore.getState().fetchDashboard();
  
        navigate("/dashboard");
      } catch (err) {
        set({
          error: err.response?.data?.message || "Create group failed",
        });
      } finally {
        set({ loading: false });
      }
    },
  }));

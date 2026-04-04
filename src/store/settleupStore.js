import { create } from "zustand";
import apiinstance from "@/api/axios";

export const settleupStore = create((set) => ({
  balancesCache: {},
  settlementsCache: {},
  loading: false,
  error: null,
  
  // ✅ FETCH FROM BACKEND
  fetchSettlementPreview: async (groupId) => {
    try {
      set({ loading: true, error: null });

      const res = await apiinstance.get(`/settles/${groupId}/settlement`);
      
console.log("API RESPONSE:", res.data);
      const balancesArray = res.data.result.balances;
      const settlementsArray = res.data.result.settlements;

      const balances = {};
      balancesArray.forEach((m) => {
        balances[m.id] = m;
      });

      set((state) => ({
        balancesCache: {
          ...state.balancesCache,
          [groupId]: balances,
        },
        settlementsCache: {
          ...state.settlementsCache,
          [groupId]: settlementsArray,
        },
        loading: false,
      }));

    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch settlements",
        loading: false,
      });
    }
  },

  // ✅ record payment (optional frontend update)
  recordPayment: (groupId, payment) => {
    const balances = { ...get().balancesCache[groupId] };

    balances[payment.from].balance += payment.amount;
    balances[payment.to].balance -= payment.amount;

    set((state) => ({
      balancesCache: {
        ...state.balancesCache,
        [groupId]: balances,
      },
    }));
  },
}));
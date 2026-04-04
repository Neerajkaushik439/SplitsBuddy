import { create } from "zustand";
import { addExpense as createExpenseApi , getAllGroupExpenses ,deleteExpense as deleteExpenseApi } from "../api/expense";
import { dashboardStore } from "./dashboardStore";
import { computeBalances, computeSettlements } from "../lib/settlementEngine";
export const expenseStore = create((set) => ({
  loading: false,
  error: null,
  balancesCache: {},
  settlementsCache: {},

  // ADD EXPENSE
  addExpense: async (data, navigate, groupIdFromUrl) => {
    try {
      set({ loading: true, error: null });

      await createExpenseApi(data);

      await dashboardStore.getState().fetchDashboard();
      // get().recalculateSettlements(data.groupId);

      // 3️⃣ Navigate back
      if (groupIdFromUrl) {
        navigate(`/group/${groupIdFromUrl}`);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          err.message ||
          "Failed to add expense",
      });
    } finally {
      set({ loading: false });
    }
  },
  clearError: () => set({ error: null }),
  //delete expense
  deleteExpense: async (expenseId) => {
    try {
      set({ loading: true, error: null });

      await deleteExpenseApi(expenseId);

      await dashboardStore.getState().fetchDashboard();

      // Optionally, you can also refresh the group expenses if you're on a group page
      set((state) => ({
        groupExpenses: state.groupExpenses.filter(
          (e) => e._id !== expenseId
        ),
      }));
      get().recalculateSettlements(data.groupId);
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          err.message ||
          "Failed to delete expense",
      });
    } finally {
      set({ loading: false });
    }
  },
  //getallgroupexpenses
  groupExpenses: [],

  fetchGroupExpenses: async (groupId) => {
    try {
      set({ loading: true, error: null });

      const res = await getAllGroupExpenses(groupId);

      set({
        groupExpenses: res.data.expenses,
      });
      get().recalculateSettlements(groupId);
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch expenses",
      });
    } finally {
      set({ loading: false });
    }
  },
  recalculateSettlements: (groupId) => {
    const state = get();
    const group = dashboardStore.getState().dashboard?.data?.groups
      ?.find(g => g.groupId === groupId);

    if (!group) return;

    const balances = computeBalances(
      group.membersPreview,
      state.groupExpenses
    );

    const settlements = computeSettlements(balances);

    set(state => ({
      balancesCache: {
        ...state.balancesCache,
        [groupId]: balances,
      },
      settlementsCache: {
        ...state.settlementsCache,
        [groupId]: settlements,
      }
    }));
  },
}));

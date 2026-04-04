import apiinstance from "./axios";

export const addExpense = async (data) => {
  try {
    return await apiinstance.post("/expenses/expense",data);
  } catch (error) {
    console.log(error);
  }
};
export const deleteExpense = async (expenseId) => {
  try {
    return await apiinstance.delete(`/expenses/deleteexpense/${expenseId}`);
  } catch (error) {
    console.log(error);
  }
};

export const getAllGroupExpenses = async (groupId) => {
  try {
    return await apiinstance.get(
      `/expenses/${groupId}/getallgroupexpenses`
    );
  } catch (error) {
    console.log(error);
  }
};  
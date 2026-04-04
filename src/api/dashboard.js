import apiinstance from "./axios";

export const getdashboarddata = async () => {
  const response = await apiinstance.get("/dashboard/getdash");
  return response.data;
}
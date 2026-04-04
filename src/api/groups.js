import axiosInstance from "./axios";

export const createGroup = async (groupData) => {
  try {
    return await axiosInstance.post("/groups/createGroup", groupData);
  } catch (error) {
    console.log(error);
  }
};  


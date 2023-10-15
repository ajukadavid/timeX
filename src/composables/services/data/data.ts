import axios from "axios";
import { setupInterceptors } from "../../helpers/axios-interceptor";
const axiosInstance = setupInterceptors(axios.create());

interface StaffRegister {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const getStaffs = async () => {
  const response = await axiosInstance.get("/staffs");
  return response.data;
};

export const registerStaff = async (data: StaffRegister) => {
  const response = await axiosInstance.post("/staffs", data);
  return response.data;
};

import axios from "axios";
import { setupInterceptors } from "../../helpers/axios-interceptor";
import { EmployerRegister, Login } from "@/types/auth";
const axiosInstance = setupInterceptors(axios.create());

export const loginEmployer = async (data: Login) => {
  const response = await axiosInstance.post("/employers/tokens", data);
  return response.data;
};

export const employerRegister = async (data: EmployerRegister) => {
  const response = await axiosInstance.post("/employers", data);
  return response.data;
};

export const loginStaff = async (passwordAuth: { email: string; password: string }) => {
  const res = await axiosInstance.post("/staffs/tokens", {passwordAuth});
  return res.data;
};



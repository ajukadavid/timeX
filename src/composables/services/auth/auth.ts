import axios from "axios";
import { setupInterceptors } from "../../helpers/axios-interceptor";
const axiosInstance = setupInterceptors(axios.create());

interface Login {
  email: string;
  password?: string;
}

interface EmployerRegister extends Login {
  firstName: string;
  lastName: string;
  companyName: string;
  phone?: string;
}

interface StaffRegister extends Login {
  firstName: string;
  lastName: string;
  role: string;
}

export const loginEmployer = async (data: Login) => {
  const response = await axiosInstance.post("/employers/tokens", data);
  return response.data;
};

export const registerStaff = async (data: StaffRegister) => {
  const response = await axiosInstance.post("/staffs", data);
  return response.data;
};

export const employerRegister = async (data: EmployerRegister) => {
  const response = await axiosInstance.post("/employers", data);
  return response.data;
};

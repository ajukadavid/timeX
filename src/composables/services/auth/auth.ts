import axios from "axios";
import { setupInterceptors } from "../../helpers/axios-interceptor";
const axiosInstance = setupInterceptors(axios.create());

export interface Login {
  email: string;
  password?: string;
}

interface EmployerRegister extends Login {
  firstName: string;
  lastName: string;
  companyName: string;
  phone?: string;
}

export const loginEmployer = async (data: Login) => {
  const response = await axiosInstance.post("/employers/tokens", data);
  return response.data;
};

export const employerRegister = async (data: EmployerRegister) => {
  const response = await axiosInstance.post("/employers", data);
  return response.data;
};

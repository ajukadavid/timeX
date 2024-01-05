import axios from "axios";
import { setupInterceptors } from "../../helpers/axios-interceptor";
import { StaffRegister } from "@/types/auth";

const axiosInstance = setupInterceptors(axios.create());

export const getStaffs = async (page?: number) => {
  let response;
  if (page) {
    response = await axiosInstance.get(`/staffs?page=${page}`);
  } else {
    response = await axiosInstance.get(`/staffs`);
  }
  return response.data;
};

export const registerStaff = async (data: StaffRegister) => {
  const response = await axiosInstance.post("/staffs", data);
  return response.data;
};

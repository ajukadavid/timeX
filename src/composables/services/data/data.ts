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
export const getStaff = async (id: string) => {
  const response = await axiosInstance.get(`/staffs/${id}`);
  return response.data;
};

export const getDepartments = async (page?: number) => {
  let response;
  if (page) {
    response = await axiosInstance.get(`/departments?page=${page}`);
  } else {
    response = await axiosInstance.get(`/departments`);
  }
  return response.data;
};
export const registerStaff = async (data: StaffRegister) => {
  const response = await axiosInstance.post("/staffs", data);
  return response.data;
};

export const createDepartment = async (name: string) => {
  const response = await axiosInstance.post("/departments", { name });
  return response.data;
};


export const updateTime = async (loginTime: string) => {
  const response = await axiosInstance.put("/employers", { loginTime });
  return response.data;
}

export const updateStaffPassword = async (staffId: string, password: string) => {
  const response = await axiosInstance.put(`/staffs/${staffId}`, { password });
  return response.data;
};

export const deleteStaff = async (staffId: string) => {
  const response = await axiosInstance.delete(`/staffs/${staffId}`);
  return response.data;
};

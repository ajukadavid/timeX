import axios from "axios";
import { setupInterceptors } from "../../helpers/axios-interceptor";
import { StaffRegister } from "@/types/auth";
// const $router = useRouter();

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
  try {
    if (page) {
      response = await axiosInstance.get(`/departments?page=${page}`);
    } else {
      response = await axiosInstance.get(`/departments`);
    }
    return response.data;
  } catch (e: any) {
    if (e.response.status === 401) {
      // $router.push("/login");
    }
  }
};
export const registerStaff = async (data: StaffRegister) => {
  const response = await axiosInstance.post("/staffs", data);
  return response.data;
};

export const createDepartment = async (name: string) => {
  const response = await axiosInstance.post("/departments", { name });
  return response.data;
};

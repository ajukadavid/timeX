import axios from "axios";
import { setupInterceptors } from "../../helpers/axios-interceptor";
const axiosInstance = setupInterceptors(axios.create());

export const getStaffs = async () => {
  const response = await axiosInstance.get("/staffs");
  console.log(response.data);
  return response.data;
};

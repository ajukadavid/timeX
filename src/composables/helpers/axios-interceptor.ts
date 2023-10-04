import {
    AxiosError,
    AxiosInstance,
    // AxiosRequestConfig, // Change to InternalAxiosRequestConfig
    InternalAxiosRequestConfig,
    AxiosResponse,
  } from "axios";
  
  
  // For Make Log on Develop Mode
  const logOnDev = (message: string) => {
    if (import.meta.env.MODE === "development") {
      console.log(message);
    }
  };
  
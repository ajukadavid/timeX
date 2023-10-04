import {
    AxiosError,
    AxiosInstance,
    // AxiosRequestConfig, // Change to InternalAxiosRequestConfig
    InternalAxiosRequestConfig,
    AxiosResponse,
  } from "axios";
  
  const BASE_URL = 'https://timex-vzwo.onrender.com/api/v1'
  // For Make Log on Develop Mode
  const logOnDev = (message: string) => {
    if (import.meta.env.MODE === "development") {
      console.log(message);
    }
  };


  // Request Interceptor
export const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const { method, url } = config;
    config.url = BASE_URL + url
    logOnDev(`🚀 [API] ${method?.toUpperCase()} ${url} | Request`);
  
    if (method === "get") {
      config.timeout = 15000;
    }
    return config;
  };
  
  const onResponse = (response: AxiosResponse): AxiosResponse => {
    const { method, url } = response.config;
    const { status } = response;
    // Set Loading End Here
    // Handle Response Data Here
    // Error Handling When Return Success with Error Code Here
    logOnDev(`🚀 [API] ${method?.toUpperCase()} ${url} | Response ${status}`);
    console.log(response)
    return response;
  };
  

  export  const onErrorResponse = (error: AxiosError | Error): Promise<AxiosError> => {
    if (axios.isAxiosError(error)) {
      const { message } = error;
      const { method, url } = error.config as AxiosRequestConfig;
      const { statusText, status } = error.response as AxiosResponse ?? {};
  
      logOnDev(
        `🚨 [API] ${method?.toUpperCase()} ${url} | Error ${status} ${message}`
      );
  
      switch (status) {
        case 401: {
          // "Login required"
          break;
        }
        case 403: {
          // "Permission denied"
          break;
        }
        case 404: {
          // "Invalid request"
          break;
        }
        case 500: {
          // "Server error"
          break;
        }
        default: {
          // "Unknown error occurred"
          break;
        }
      }
  
      if (status === 401) {
        // Delete Token & Go To Login Page if you required.
        sessionStorage.removeItem("token");
      }
    } else {
      logOnDev(`🚨 [API] | Error ${error.message}`);
    }
  
    return Promise.reject(error);
  };
  

  export const setupInterceptors = (instance: AxiosInstance): AxiosInstance => {
    instance.interceptors.request.use(onRequest, onErrorResponse);
    instance.interceptors.response.use(onResponse, onErrorResponse);
  
    return instance;
  };
  
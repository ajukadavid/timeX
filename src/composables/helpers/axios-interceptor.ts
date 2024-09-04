import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const BASE_URL = "https://timex-vzwo.onrender.com/api/v1";

export const onRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const { method, url } = config;
  config.url = BASE_URL + url;
  if (url?.includes("staffs") || url?.includes("departments") || method === "put") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  if (method === "get") {
    config.timeout = 15000;
  }
  return config;
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  const { method, url } = response.config;
  const { status } = response;
  if (url?.includes("token") && response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response;
};

export const onErrorResponse = (
  error: AxiosError | Error | any
): Promise<AxiosError> => {
  if (axios.isAxiosError(error)) {
    const { message } = error;
    const { method, url } = error.config as InternalAxiosRequestConfig;
    const { statusText, status } = (error.response as AxiosResponse) ?? {};

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
  }

  return Promise.reject(error);
};

export const setupInterceptors = (instance: AxiosInstance): AxiosInstance => {
  instance.interceptors.request.use(onRequest, onErrorResponse);
  instance.interceptors.response.use(onResponse, onErrorResponse);

  return instance;
};

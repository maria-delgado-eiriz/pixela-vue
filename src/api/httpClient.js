import axios from "axios";
// import { useToast } from "vue-toast-notification";

// const toast = useToast();
// Create an axios instance
const httpClient = axios.create({
  baseURL:
    "http://" +
    import.meta.env.VITE_SERVER_URL +
    ":" +
    import.meta.env.VITE_SERVER_PORT,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get the auth token from local storage
const getAuthToken = () => localStorage.getItem("token");

// Add a request interceptor
const authInterceptor = (config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};
// Add the request interceptor
httpClient.interceptors.request.use(authInterceptor);
// Add the response interceptor
httpClient.interceptors.response.use(
  (response) => {
    // let message = response?.data?.message;
    // if (message) toast.success(message);
    return response;
  },
  (error) => {
    // let message = error?.response?.data?.message;
    // if (message) toast.error(message);
    return Promise.reject(error);
  }
);

export default httpClient;

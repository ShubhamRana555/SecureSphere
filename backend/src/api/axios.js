// src/api/axios.js
// AXIOS INTERCEPTOR FOR HANDLING JWT REFRESH TOKEN
import axios from "axios";
import Cookies from "js-cookie"; // Only if you're not using httpOnly cookies

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // important for sending cookies
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If accessToken expired
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Get new token using refresh token
        const res = await axiosInstance.post("/auth/refresh-token");

        const newAccessToken = res.data?.data?.accessToken;

        // Set new token to header
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest); // retry failed request
      } catch (err) {
        // redirect to login, show error, etc.
        console.error("Refresh token failed", err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

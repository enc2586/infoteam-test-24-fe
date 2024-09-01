import axios from "axios";
import { tokenInterceptor } from "./tokenInterceptor";
import { router } from "../main";
import { getNewToken } from "./auth/refresh";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config = tokenInterceptor(config);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 401:
          if (originalRequest.url?.includes("/u/login")) break;

          if (!originalRequest._retry) {
            originalRequest._retry = true;

            try {
              const refreshToken = localStorage.getItem("refreshToken");
              if (!refreshToken) throw new Error("Refresh token not found");

              const { accessToken, refreshToken: newRefreshToken } =
                await getNewToken({ refreshToken });
              localStorage.setItem("accessToken", accessToken);
              localStorage.setItem("refreshToken", newRefreshToken);

              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${accessToken}`;

              return axiosInstance(originalRequest);
            } catch (refreshError) {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              router.navigate("/u/login?expired=true");
              return Promise.reject(refreshError);
            }
          }

          break;

        default:
          return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

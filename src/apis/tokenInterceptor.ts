import { InternalAxiosRequestConfig } from "axios";

export const tokenInterceptor = (
  config: InternalAxiosRequestConfig<unknown>
) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
};

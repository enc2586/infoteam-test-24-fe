import axios from "../api-instance";
import { LoginInputs } from "./types";

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: 0;
};

export const login = async (inputs: LoginInputs) => {
  const { data } = await axios.post<LoginResponse>("/auth/login", inputs);

  return data;
};

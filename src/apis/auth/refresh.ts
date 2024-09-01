import axios from "../api-instance";
import { LoginResponse } from "./login";

type GetNewTokenInputs = Pick<LoginResponse, "refreshToken">;

export const getNewToken = async (inputs: GetNewTokenInputs) => {
  const { data } = await axios.post<LoginResponse>("/auth/refresh", inputs);

  return data;
};

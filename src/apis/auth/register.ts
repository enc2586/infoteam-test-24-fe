import axios from "../api-instance";
import { LoginInputs } from "./types";

export type RegisterInputs = LoginInputs & {
  nickname: string;
};

export const register = async (inputs: RegisterInputs) => {
  await axios.post("/auth/register", inputs);

  return;
};

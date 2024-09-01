import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { login } from "../apis/auth/login";
import { LoginInputs } from "../apis/auth/types";
import { router } from "../main";
import { decodeJwt } from "../utils/jwt";

function useAuthProvider() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );

  const user = token ? decodeJwt(token) : null;

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginInputs) => {
      const result = await login({ email, password });

      const { accessToken, refreshToken } = result;
      setToken(accessToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return result;
    },
  });

  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    router.navigate("/u/login");
  };

  return {
    token,
    loginMutation,
    user,
    logout,
  };
}

const authContext = createContext<ReturnType<typeof useAuthProvider> | null>(
  null
);

export default function useAuth() {
  const user = useContext(authContext);
  if (user === null) throw new Error("AuthProvider not found");
  return user;
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const user = useAuthProvider();
  return <authContext.Provider value={user}>{children}</authContext.Provider>;
}

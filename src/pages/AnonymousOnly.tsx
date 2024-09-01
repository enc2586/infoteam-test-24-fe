import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export function Component() {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

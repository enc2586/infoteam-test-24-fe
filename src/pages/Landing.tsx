import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
export function Component() {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/board" />;
  } else {
    return <Navigate to="/u/login" />;
  }
}

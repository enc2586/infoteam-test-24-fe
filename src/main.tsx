import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./global.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        path: "/",
        lazy: () => import("./pages/Landing"),
      },
      {
        lazy: () => import("./pages/ProtectedLayout"),
        children: [
          {
            path: "board",
            lazy: () => import("./pages/Board"),
          },
          {
            path: "post",
            lazy: () => import("./pages/Post"),
          },
          {
            path: "search",
            lazy: () => import("./pages/SearchResult"),
          },
          {
            path: "write",
            lazy: () => import("./pages/Write"),
          },
        ],
      },
      {
        path: "u",
        lazy: () => import("./pages/AnonymousOnly"),
        children: [
          {
            path: "login",
            lazy: () => import("./pages/Login"),
          },
          {
            path: "register",
            lazy: () => import("./pages/Register"),
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="top-right" />
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);

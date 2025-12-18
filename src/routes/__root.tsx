import { createRootRoute, Outlet } from "@tanstack/react-router";

import { AuthProvider } from "../contexts/AuthContext";

const RootLayout = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

export const Route = createRootRoute({ component: RootLayout });

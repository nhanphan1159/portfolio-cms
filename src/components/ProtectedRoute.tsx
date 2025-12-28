import { useEffect } from "react";

import { Center, Spinner } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";

import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user || !isAdmin) {
        navigate({ to: "/login" });
      }
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};

import { useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { loading, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    navigate({
      to: user && isAdmin ? "/admin/about" : "/login",
      replace: true,
    });
  }, [isAdmin, loading, navigate, user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50" />
  );
}

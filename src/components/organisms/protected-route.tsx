// src/components/organisms/protected-route.tsx
import { Navigate } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { useAuth } from "@/hooks/use-auth";

export function ProtectedRoute({
  children,
  adminOnly = false,
}: PropsWithChildren<{ adminOnly?: boolean }>) {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/auth/login" />;
  }

  if (adminOnly && user.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

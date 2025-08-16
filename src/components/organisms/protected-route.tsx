// src/components/organisms/protected-route.tsx
"use client"
import { useEffect, type PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export function ProtectedRoute({
  children,
  adminOnly = false,
}: PropsWithChildren<{ adminOnly?: boolean }>) {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token || !user) {
      router.push("/auth/login");
      return;
    }
    if (adminOnly && user.role !== "ADMIN") {
      router.push("/");
    }
  }, [token, user, adminOnly, router]);

  return <>{children}</>;
}

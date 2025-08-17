"use client";
import { useEffect, type PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/stores/auth";

export function ProtectedRoute({
  children,
  adminOnly = false,
}: PropsWithChildren<{ adminOnly?: boolean }>) {
  const { user } = useAuth();
  const hydrated = useAuthStore((s) => s.hydrated);
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (adminOnly && user.role !== "ADMIN") {
      router.push("/");
    }
  }, [hydrated, user, adminOnly, router]);

  return <>{children}</>;
}

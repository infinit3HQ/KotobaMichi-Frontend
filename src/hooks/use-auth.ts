import { useAuthStore, type AuthUser } from "@/stores/auth";

export type User = AuthUser;

export function useAuth() {
  const { user, setUser, logout } = useAuthStore();
  return { user, setUser, logout };
}

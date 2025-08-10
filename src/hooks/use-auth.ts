// src/hooks/use-auth.ts
import { useAuthStore, type AuthUser } from '@/stores/auth'

export type User = AuthUser

export function useAuth() {
  const { user, token, login, logout } = useAuthStore()
  return { user, token, login, logout }
}

// src/hooks/use-auth.ts
// Lightweight placeholder auth hook. Replace with real implementation in Auth task.
import { useMemo } from 'react'

export type User = {
  id: string
  name: string
  role: 'USER' | 'ADMIN'
}

export function useAuth() {
  // TODO: wire to real auth state (context/zustand) in Task 3.
  // For now, read from localStorage to allow quick ProtectedRoute behavior during scaffolding.
  const value = useMemo(() => {
    try {
      const raw = localStorage.getItem('auth:user')
      if (!raw) return { user: null as User | null, token: null as string | null }
      const parsed = JSON.parse(raw)
      return { user: parsed.user as User | null, token: parsed.token as string | null }
    } catch {
      return { user: null as User | null, token: null as string | null }
    }
  }, [])

  return value
}

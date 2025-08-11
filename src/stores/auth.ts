// src/stores/auth.ts
import { create, type StateCreator } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Role = 'USER' | 'ADMIN'
export type AuthUser = { id: string; email: string; role: Role }

export type AuthState = {
  user: AuthUser | null
  token: string | null
  login: (payload: { user: AuthUser; token: string }) => void
  logout: () => void
}

const creator: StateCreator<AuthState> = (set) => ({
  user: null,
  token: null,
  login: ({ user, token }: { user: AuthUser; token: string }) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
})

type PersistedAuthState = Pick<AuthState, 'user' | 'token'>

export const useAuthStore = create<AuthState>()(
  persist<AuthState, [], [], PersistedAuthState>(creator, {
    name: 'auth',
    storage: createJSONStorage<PersistedAuthState>(() => localStorage),
    partialize: (state) => ({ user: state.user, token: state.token }),
  }),
)

export const getAuthToken = () => useAuthStore.getState().token

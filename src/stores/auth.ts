// src/stores/auth.ts
import { create, type StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Role = "USER" | "ADMIN";
export type AuthUser = { id: string; email: string; role: Role };

export type AuthState = {
  user: AuthUser | null;
  hydrated: boolean;
  authChecked: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  setAuthChecked: () => void;
};

let _setStateRef: (partial: Partial<AuthState> | ((s: AuthState) => Partial<AuthState>)) => void;
const creator: StateCreator<AuthState> = (set) => {
  _setStateRef = set;
  return ({
  user: null,
  hydrated: false,
  authChecked: false,
    setUser: (user) => set({ user, hydrated: true }),
    logout: () => set({ user: null, authChecked: false, hydrated: true }),
    setAuthChecked: () => set({ authChecked: true }),
  });
};

type PersistedAuthState = Pick<AuthState, "user">;

export const useAuthStore = create<AuthState>()(
  persist<AuthState, [], [], PersistedAuthState>(creator, {
    name: "auth",
    storage: createJSONStorage<PersistedAuthState>(() =>
      typeof window !== "undefined"
        ? localStorage
        : (undefined as unknown as Storage)
    ),
      // allow automatic rehydration so persisted `user` is loaded
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        // mark hydrated after rehydration using the store setter so subscribers are notified
        try {
          if (state && _setStateRef) _setStateRef({ hydrated: true });
        } catch {}
      },
  })
);

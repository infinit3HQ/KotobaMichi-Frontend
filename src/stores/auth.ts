// src/stores/auth.ts
import { create, type StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Role = "USER" | "ADMIN";
export type AuthUser = { id: string; email: string; role: Role };

export type AuthState = {
  user: AuthUser | null;
  hydrated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

const creator: StateCreator<AuthState> = (set) => ({
  user: null,
  hydrated: false,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
});

type PersistedAuthState = Pick<AuthState, "user">;

export const useAuthStore = create<AuthState>()(
  persist<AuthState, [], [], PersistedAuthState>(creator, {
    name: "auth",
    storage: createJSONStorage<PersistedAuthState>(() =>
      typeof window !== "undefined"
        ? localStorage
        : (undefined as unknown as Storage)
    ),
    skipHydration: true,
    partialize: (state) => ({ user: state.user }),
    onRehydrateStorage: () => (state) => {
      // mark hydrated after rehydration
      if (state) state.hydrated = true;
    },
  })
);

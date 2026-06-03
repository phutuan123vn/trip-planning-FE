import type { User } from "@/features/auth/types/auth";
import { removeTokenCookie } from "@/lib/cookie";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    removeTokenCookie();
    set({ user: null });
  },
}));
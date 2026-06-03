import type { User } from "@/features/auth/types/auth";
import { createContext, useContext } from "react";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

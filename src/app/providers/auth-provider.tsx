import { useEffect, useMemo, type ReactNode } from "react";
import { AuthContext } from "@/app/context/AuthContext";
import { useAuthStore } from "@/app/stores/auth-store";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { getTokenCookie } from "@/lib/cookie";

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  const hasToken = !!getTokenCookie();
  const { data, isLoading, isError } = useCurrentUser();

  // Sync fetched user into Zustand store
  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  // If /me fails (expired/invalid token), clear auth state
  useEffect(() => {
    if (isError && hasToken) {
      logout();
    }
  }, [isError, hasToken, logout]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: hasToken && !!user,
      isLoading: hasToken && isLoading,
    }),
    [user, hasToken, isLoading],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

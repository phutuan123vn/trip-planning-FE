import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/app/stores/auth-store";
import { authKeys } from "./use-current-user";
import { useCallback } from "react";

export const useLogout = () => {
  const authLogout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useCallback(() => {
    authLogout();
    queryClient.removeQueries({ queryKey: authKeys.currentUser });
  }, [authLogout, queryClient]);
};

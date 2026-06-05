import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth-api";
import { getTokenCookie } from "@/lib/cookie";

export const authKeys = {
  currentUser: ["auth", "me"] as const,
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.currentUser,
    queryFn: getCurrentUser,
    enabled: !!getTokenCookie(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

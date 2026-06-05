import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth-api";
import { useAuthStore } from "@/app/stores/auth-store";
import { setTokenCookie } from "@/lib/cookie";

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setTokenCookie(data.data?.[0].accessToken);
      setUser(data.data?.[0].user);
    },
  });
};

import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../api/auth-api";
import type { ChangePasswordDto } from "../schemas/auth-schema";
import { toast } from "sonner";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordDto) => changePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to change password");
    },
  });
};

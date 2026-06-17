import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/auth-api";
import type { UpdateProfileDto } from "../schemas/auth-schema";
import { toast } from "sonner";
import { authKeys } from "./use-current-user";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileDto) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser });
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });
};

import { useAuth } from "@/app/context/AuthContext";
import { Role } from "../types/auth";

export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.role === Role.ADMIN;
};

import api from "@/lib/axios";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  User,
} from "../types/auth";

export const login = (payload: LoginPayload) =>
  api.post<LoginResponse>("/auth/login", payload).then((r) => r.data);

export const register = (payload: RegisterPayload) =>
  api.post("/auth/register", payload);

export const getCurrentUser = () =>
  api.get<User>("/auth/me").then((r) => r.data);

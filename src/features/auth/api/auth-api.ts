import api from "@/lib/axios";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  User,
  VerifyEmailPayload,
} from "../types/auth";

const API_PATH = "/auth";


export const login = (payload: LoginPayload) =>
  api.post<LoginResponse>(`${API_PATH}/login`, payload).then((r) => r.data);

export const register = (payload: RegisterPayload) =>
  api.post(`${API_PATH}/register`, payload);

export const getCurrentUser = () =>
  api.get<User>(`${API_PATH}/me`).then((r) => r.data);

export const verifyEmail = (payload: VerifyEmailPayload) =>
  api.post(`${API_PATH}/verify-email`, payload);

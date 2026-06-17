import api from "@/lib/axios";
import type {
    CurrentUserResponse,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  VerifyEmailPayload,
  User,
} from "../types/auth";
import type { UpdateProfileDto, ChangePasswordDto } from "../schemas/auth-schema";

const API_PATH = "/auth";


export const login = (payload: LoginPayload) =>
  api.post<LoginResponse>(`${API_PATH}/login`, payload).then((r) => r.data);

export const register = (payload: RegisterPayload) =>
  api.post(`${API_PATH}/register`, payload);

export const getCurrentUser = () =>
  api.get<CurrentUserResponse>(`${API_PATH}/me`).then((r) => r.data.data?.[0] || null);

export const verifyEmail = (payload: VerifyEmailPayload) =>
  api.post(`${API_PATH}/verify-email`, payload);

export const updateProfile = (payload: UpdateProfileDto) =>
  api.patch<{ data: User }>(`${API_PATH}/me`, payload).then((r) => r.data.data);

export const changePassword = (payload: ChangePasswordDto) =>
  api.post(`${API_PATH}/change-password`, payload);

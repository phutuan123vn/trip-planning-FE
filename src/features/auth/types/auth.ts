import type { PaginatedResponse } from "@/types/Response";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "ADMIN";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}


export interface LoginData {
  user: User;
  accessToken: string;
  tokenType: string;
}


export type LoginResponse = PaginatedResponse<LoginData>;

export interface VerifyEmailPayload {
  token: string;
  email: string;
}

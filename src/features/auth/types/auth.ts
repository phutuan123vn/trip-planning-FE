import type { PaginatedResponse } from "@/types/Response";

export const Role = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
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

export type CurrentUserResponse = PaginatedResponse<User>;

export interface VerifyEmailPayload {
  token: string;
  email: string;
}

// Types
export type { User, LoginPayload, RegisterPayload, LoginResponse } from "./types/auth";

// Context
export { useAuth } from "@/app/context/AuthContext";

// API
export { login, register, getCurrentUser } from "./api/auth-api";

// Hooks
export { useLogin } from "./hooks/use-login";
export { useRegister } from "./hooks/use-register";
export { useCurrentUser, authKeys } from "./hooks/use-current-user";
export { useLogout } from "./hooks/use-logout";

// Schemas
export { LoginSchema, RegisterSchema } from "./schemas/auth-schema";
export type { LoginDto, RegisterDto } from "./schemas/auth-schema";

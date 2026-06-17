// Types
export type { User, LoginPayload, RegisterPayload, LoginResponse, VerifyEmailPayload } from "./types/auth";
export { Role } from "./types/auth";

// Context
export { useAuth } from "@/app/context/AuthContext";

// API
export { login, register, getCurrentUser, verifyEmail, updateProfile, changePassword } from "./api/auth-api";

// Hooks
export { useLogin } from "./hooks/use-login";
export { useRegister } from "./hooks/use-register";
export { useCurrentUser, authKeys } from "./hooks/use-current-user";
export { useLogout } from "./hooks/use-logout";
export { useUpdateProfile } from "./hooks/use-update-profile";
export { useChangePassword } from "./hooks/use-change-password";
export { useIsAdmin } from "./hooks/use-is-admin";

// Schemas
export { LoginSchema, RegisterSchema, UpdateProfileSchema, ChangePasswordSchema } from "./schemas/auth-schema";
export type { LoginDto, RegisterDto, UpdateProfileDto, ChangePasswordDto } from "./schemas/auth-schema";

// Components
export { LoginDialog } from "./components/login-dialog";
export { ProfileForm } from "./components/profile-form";
export { ChangePasswordForm } from "./components/change-password-form";

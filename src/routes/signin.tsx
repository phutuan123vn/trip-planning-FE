import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoginSchema, useAuth, useLogin, type LoginDto } from "@/features/auth";
import { setTokenCookie } from "@/lib/cookie";
import { cn } from "@/lib/utils";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";

export const Route = createFileRoute("/signin")({
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }

  const loginMutation = useLogin();

  const [form, setForm] = useState<LoginDto>({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const result = LoginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    loginMutation.mutate(result.data);
    navigate({ to: "/" });
  };

  return (
    <div className="p-4 bg-gray-100 grow relative">
      <form
        onSubmit={handleSubmit}
        className={cn(
          "absolute top-1/4 left-1/2 min-h-[300px] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 shadow-lg backdrop-blur-sm",
        )}
      >
        <h2>Sign In</h2>
        <div className="flex flex-col gap-4">
          <Field data-invalid={!!errors.email || undefined}>
            <FieldLabel htmlFor="input-email">Email</FieldLabel>
            <Input
              id="input-email"
              name="email"
              type="email"
              placeholder="abc@example.com"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <FieldError>{errors.email}</FieldError>}
          </Field>
          <Field data-invalid={!!errors.password || undefined}>
            <FieldLabel htmlFor="input-password">Password</FieldLabel>
            <Input
              id="input-password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <FieldError>{errors.password}</FieldError>}
          </Field>
        </div>

        {loginMutation.isError && (
          <p className="mt-2 text-sm text-destructive">
            {loginMutation.error?.message ?? "Login failed. Please try again."}
          </p>
        )}

        <Button
          type="submit"
          className="mt-6 w-full hover:bg-gray-500/90"
          size="lg"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Signing in…" : "Sign In"}
        </Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RegisterSchema, useAuth, useRegister, type RegisterDto } from "@/features/auth";
import { cn } from "@/lib/utils";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }

  const registerMutation = useRegister();

  const [form, setForm] = useState<RegisterDto>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = RegisterSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    registerMutation.mutate(
      {
        email: result.data.email,
        password: result.data.password,
        firstName: result.data.firstName,
        lastName: result.data.lastName,
      },
      {
        onSuccess: () => {
          toast.success(
            "Check your email to verify your account",
            { duration: 5000 },
          );
          navigate({ to: "/signin" });
        },
      },
    );
  };

  return (
    <div className="bg-blend-darken p-4 bg-gray-100 grow relative">
      <form
        onSubmit={handleSubmit}
        className={cn(
          "absolute top-1/3 left-1/2 min-h-[300px] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 shadow-lg backdrop-blur-sm",
        )}
      >
        <h2>Sign Up</h2>
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
          <Field data-invalid={!!errors.firstName || undefined}>
            <FieldLabel htmlFor="input-first-name">First Name</FieldLabel>
            <Input
              id="input-first-name"
              name="firstName"
              type="text"
              placeholder="John"
              value={form.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <FieldError>{errors.firstName}</FieldError>}
          </Field>
          <Field data-invalid={!!errors.lastName || undefined}>
            <FieldLabel htmlFor="input-last-name">Last Name</FieldLabel>
            <Input
              id="input-last-name"
              name="lastName"
              type="text"
              placeholder="Doe"
              value={form.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <FieldError>{errors.lastName}</FieldError>}
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
            <FieldDescription>
              Must be at least 8 characters.
              <ul className="list-disc list-inside">
                <li>At least one uppercase letter</li>
                <li>At least one lowercase letter</li>
                <li>At least one number</li>
              </ul>
            </FieldDescription>
            {errors.password && <FieldError>{errors.password}</FieldError>}
          </Field>
          <Field data-invalid={!!errors.confirmPassword || undefined}>
            <FieldLabel htmlFor="input-confirm-password">
              Confirm Password
            </FieldLabel>
            <Input
              id="input-confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <FieldError>{errors.confirmPassword}</FieldError>
            )}
          </Field>
        </div>

        {registerMutation.isError && (
          <p className="mt-2 text-sm text-destructive">
            {registerMutation.error?.message ??
              "Registration failed. Please try again."}
          </p>
        )}

        <Button
          type="submit"
          className="mt-6 w-full hover:bg-gray-500/90"
          size="lg"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Signing up…" : "Sign Up"}
        </Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/signin" className="underline underline-offset-4 hover:text-primary">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

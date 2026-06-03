import { verifyEmail } from "@/features/auth";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

const verifyEmailSearchSchema = z.object({
  token: z.string(),
  email: z.string().email(),
});

export const Route = createFileRoute("/verify-email")({
  validateSearch: verifyEmailSearchSchema,
  component: VerifyEmail,
});

function VerifyEmail() {
  const { token, email } = useSearch({
    from: "/verify-email",
  });

  const mutation = useMutation({
    mutationFn: verifyEmail,
  });

  useEffect(() => {
    mutation.mutate({ token, email });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, email]);

  return (
    <div className="container bg-blend-darken p-4 bg-gray-100 grow relative">
      <div
        className={cn(
          "absolute top-1/4 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 shadow-lg backdrop-blur-sm text-center",
        )}
      >
        {mutation.isPending && (
          <div className="flex flex-col items-center gap-4">
            <Spinner className="size-8" />
            <p className="text-muted-foreground">Verifying your email…</p>
          </div>
        )}

        {mutation.isSuccess && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Email Verified!</h2>
            <p className="text-muted-foreground">
              Your account has been verified successfully.
            </p>
            <Link
              to="/signin"
              className="mt-2 inline-block rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Sign In
            </Link>
          </div>
        )}

        {mutation.isError && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Verification Failed</h2>
            <p className="text-muted-foreground">
              {mutation.error?.message ??
                "The verification link is invalid or has expired."}
            </p>
            <Link
              to="/signup"
              className="mt-2 inline-block rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Sign Up Again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

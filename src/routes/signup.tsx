import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  component: SignUp,
});

function SignUp() {
  return (
    <div className="container bg-blend-darken p-4 bg-gray-100 grow relative">
      <div
        className={cn(
          "absolute top-1/3 left-1/2 min-h-[300px] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 shadow-lg backdrop-blur-sm",
        )}
      >
        <h2>Sign Up</h2>
        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="input-username">Username</FieldLabel>
            <Input
              id="input-username"
              type="email"
              placeholder="abc@example.com"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-password">Password</FieldLabel>
            <Input id="input-password" type="password" placeholder="••••••••" />
            <FieldDescription>
              Must be at least 8 characters.
              <ul className="list-disc list-inside">
                <li>At least one uppercase letter</li>
                <li>At least one lowercase letter</li>
                <li>At least one number</li>
              </ul>
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="input-confirm-password">
              Confirm Password
            </FieldLabel>
            <Input
              id="input-confirm-password"
              type="password"
              placeholder="••••••••"
            />
          </Field>
        </div>
        <Button className="mt-6 w-full hover:bg-gray-500/90" size="lg">
          Sign In
        </Button>
      </div>
    </div>
  );
}

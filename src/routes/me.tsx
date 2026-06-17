import {
  ChangePasswordForm,
  ProfileForm,
  useCurrentUser,
} from "@/features/auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/me")({
  component: Me,
});

function Me() {
  const { data: user, isLoading } = useCurrentUser();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    setTimeout(() => {
      navigate({ to: "/signin", search: { from: "/me" } });
    }, 3000);
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          <p>User not found. Please log in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <ProfileForm user={user} />

        <ChangePasswordForm />
      </div>
    </div>
  );
}

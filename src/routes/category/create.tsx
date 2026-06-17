import { CategoryCreate } from "@/components/category/CategoryCreate";
import { useAuth, useIsAdmin } from "@/features/auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/category/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/signin", search: { from: "/category/manage" } });
      return;
    }
    if (!isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate({ to: "/category/manage" });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated || !isAdmin) return null;

  return <CategoryCreate />;
}

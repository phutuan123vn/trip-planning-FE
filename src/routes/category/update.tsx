import { CategoryUpdate } from "@/components/category/CategoryUpdate";
import { useAuth, useIsAdmin } from "@/features/auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

const SearchSchema = z.object({
  id: z.string(),
});

export const Route = createFileRoute("/category/update")({
  component: RouteComponent,
  validateSearch: SearchSchema,
});

function RouteComponent() {
  const { id } = Route.useSearch();
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
  
  return <CategoryUpdate categoryId={id} />;
}

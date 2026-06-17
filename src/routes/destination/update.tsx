import { DestinationUpdate } from "@/components/destination/DestinationUpdate";
import { useAuth, useIsAdmin } from "@/features/auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

const SearchSchema = z.object({
  id: z.string(),
});

export const Route = createFileRoute("/destination/update")({
  component: RouteComponent,
  validateSearch: SearchSchema,
});

function RouteComponent() {
  const { id } = Route.useSearch();
  const { isAuthenticated, isLoading } = useAuth();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/signin", search: { from: "/destination/manage" } });
      return;
    }
    if (!isLoading && !isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate({ to: "/destination/manage" });
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  if (!isAuthenticated || !isAdmin) return null;
  
  return <DestinationUpdate destinationId={id} />;
}

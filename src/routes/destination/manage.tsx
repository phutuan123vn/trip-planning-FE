import { ManageDestinations } from "@/components/destination/MangeDestination";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const SearchSchema = z.object({
  page: z.number().optional(),
});

export const Route = createFileRoute("/destination/manage")({
  component: RouteComponent,
  validateSearch: SearchSchema,
});

function RouteComponent() {
  return <ManageDestinations />;
}

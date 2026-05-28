import { DestinationDashboard } from "@/components/destination/Dashboard";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const SearchSchema = z.object({
  page: z
    .number()
    .int()
    .positive()
    .catch(() => 1),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: SearchSchema,
});

function Index() {
  return <DestinationDashboard />;
}

import { YourTrips } from "@/components/trip/YourTrips";
import { LoginRequired } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const SearchSchema = z.object({
  page: z.number().int().positive().optional(),
});

export const Route = createFileRoute("/trip/your-trips")({
  component: RouteComponent,
  validateSearch: SearchSchema,
  beforeLoad: LoginRequired,
});

function RouteComponent() {
  return <YourTrips />;
}

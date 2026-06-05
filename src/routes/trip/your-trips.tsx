import { YourTrips } from "@/components/trip/YourTrips";
import { getTokenCookie } from "@/lib/cookie";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

const SearchSchema = z.object({
  page: z.number().int().positive().optional(),
});

export const Route = createFileRoute("/trip/your-trips")({
  component: RouteComponent,
  validateSearch: SearchSchema,
  beforeLoad: () => {
    const hasToken = !!getTokenCookie();
    if (!hasToken) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function RouteComponent() {
  return <YourTrips />;
}

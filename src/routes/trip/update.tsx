import { TripUpdate } from '@/components/trip/TripUpdate'
import { useAuth } from '@/features/auth';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'

const SearchSchema = z.object({
  id: z.string(),
})

export const Route = createFileRoute('/trip/update')({
  component: RouteComponent,
  validateSearch: SearchSchema,
})

function RouteComponent() {
  const { id } = Route.useSearch()
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  if (!isAuthenticated) {
    navigate({ to: "/signin", search: { from: "/trip/your-trips" } });
    return null;
  }
  return <TripUpdate tripId={id} />
}

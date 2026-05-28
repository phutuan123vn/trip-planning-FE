import { TripDetails } from '@/components/trip/TripDetails'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trip/$tripId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { tripId } = Route.useParams()
  return <TripDetails tripId={tripId} />
}

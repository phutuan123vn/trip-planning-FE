import { TripCreate } from '@/components/trip/TripCreate'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trip/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TripCreate />
}

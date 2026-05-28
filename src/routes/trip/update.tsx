import { TripUpdate } from '@/components/trip/TripUpdate'
import { createFileRoute } from '@tanstack/react-router'
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
  return <TripUpdate tripId={id} />
}

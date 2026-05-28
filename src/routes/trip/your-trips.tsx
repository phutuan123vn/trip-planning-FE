import { YourTrips } from '@/components/trip/YourTrips'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const SearchSchema = z.object({
  page: z
    .number()
    .int()
    .positive()
    .catch(() => 1),
})

export const Route = createFileRoute('/trip/your-trips')({
  component: RouteComponent,
  validateSearch: SearchSchema,
})

function RouteComponent() {
  return <YourTrips />
}

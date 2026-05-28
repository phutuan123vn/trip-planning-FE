import { DestinationDetails } from '@/components/destination/DestinationDetails'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/destination/$destinationId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { destinationId } = Route.useParams()
  return <DestinationDetails destinationId={destinationId} />
}

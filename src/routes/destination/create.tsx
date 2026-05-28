import { DestinationCreate } from '@/components/destination/DestinationCreate'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/destination/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DestinationCreate />
}

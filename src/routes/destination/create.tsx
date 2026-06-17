import { DestinationCreate } from '@/components/destination/DestinationCreate'
import { useAuth, useIsAdmin } from '@/features/auth';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/destination/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/signin', search: { from: '/destination/manage' } });
      return;
    }
    if (!isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate({ to: '/destination/manage' });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated || !isAdmin) return null;

  return <DestinationCreate />
}

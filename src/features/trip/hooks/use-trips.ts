import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTrip, deleteTrip, getTripById, getTrips, updateTrip } from "../api/trip-api";

export const tripKeys = {
  all: ["trips"] as const,
  list: (page: number, pageSize: number) =>
    ["trips", page, pageSize] as const,
  detail: (id: string) => ["trips", id] as const,
};

export const useTrips = (page: number, pageSize = 10) =>
  useQuery({
    queryKey: tripKeys.list(page, pageSize),
    queryFn: () => getTrips(page, pageSize),
  });

export const useTripDetail = (id: string) =>
  useQuery({
    queryKey: tripKeys.detail(id),
    queryFn: () => getTripById(id),
    enabled: !!id,
  });

export const useCreateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.all });
    },
  });
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string; name: string; startDate: string; endDate: string; destinationIds: string[] }) =>
      updateTrip(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.all });
    },
  });
};

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.all });
    },
  });
};

import type { PaginationParams } from "@/types/PaginationParams";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTrip, deleteTrip, getTripById, getTrips, updateTrip } from "../api/trip-api";
import type { TripUpdateInput } from "../types";

export const tripKeys = {
  all: ["trips"] as const,
  list: (req: PaginationParams) =>
    ["trips", req] as const,
  detail: (id: string) => ["trips", id] as const,
};

export const useTrips = (req: PaginationParams) =>
  useQuery({
    queryKey: tripKeys.list(req),
    queryFn: () => getTrips(req),
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
    mutationFn: ({ id, ...input }: { id: string } & TripUpdateInput) =>
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

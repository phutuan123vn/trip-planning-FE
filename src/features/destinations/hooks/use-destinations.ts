import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDestinations, getDestinationById, createDestination, updateDestination, deleteDestination } from "../api/destinations-api";
import type { PaginationParams } from "@/types/PaginationParams";
import type { DestinationCreateInput } from "../schemas/destination-create-schema";

export const destinationKeys = {
  all: ["destinations"] as const,
  list: (req: PaginationParams) =>
    ["destinations", req] as const,
  detail: (id: string) => ["destinations", id] as const,
};

export const useDestinations = (req: PaginationParams) =>
  useQuery({
    queryKey: destinationKeys.list(req),
    queryFn: () => getDestinations(req),
  });

export const useDestinationDetail = (id: string) =>
  useQuery({
    queryKey: destinationKeys.detail(id),
    queryFn: () => getDestinationById(id),
    enabled: !!id,
  });

export const useCreateDestination = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: DestinationCreateInput) => createDestination(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: destinationKeys.all });
    },
  });
};

export const useUpdateDestination = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: DestinationCreateInput }) =>
      updateDestination(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: destinationKeys.all });
    },
  });
};

export const useDeleteDestination = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDestination(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: destinationKeys.all });
    },
  });
};

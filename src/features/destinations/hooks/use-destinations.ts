import { useQuery } from "@tanstack/react-query";
import { getDestinations } from "../api/destinations-api";
import { getDestinationById } from "../api/destinations-api";
import type { PaginationParams } from "@/types/PaginationParams";

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

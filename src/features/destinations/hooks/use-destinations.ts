import { useQuery } from "@tanstack/react-query";
import { getDestinations } from "../api/destinations-api";
import { getDestinationById } from "../api/destinations-api";

export const destinationKeys = {
  all: ["destinations"] as const,
  list: (page: number, pageSize: number) =>
    ["destinations", page, pageSize] as const,
  detail: (id: string) => ["destinations", id] as const,
};

export const useDestinations = (page: number, pageSize = 12) =>
  useQuery({
    queryKey: destinationKeys.list(page, pageSize),
    queryFn: () => getDestinations(page, pageSize),
  });

export const useDestinationDetail = (id: string) =>
  useQuery({
    queryKey: destinationKeys.detail(id),
    queryFn: () => getDestinationById(id),
    enabled: !!id,
  });

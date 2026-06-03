import api from "@/lib/axios";
import type { PaginatedResponse } from "@/types/Response";
import type { Destination } from "../types/destination";

export const getDestinationById = async (id: string): Promise<Destination> => {
  const { data } = await api.get<Destination>(`/destinations/${id}`);
  return data;
};

export const getDestinations = async (
  page: number,
  pageSize: number
): Promise<PaginatedResponse<Destination>> => {
  const { data } = await api.get<PaginatedResponse<Destination>>("/destinations", {
    params: { page, pageSize },
  });
  return data;
};

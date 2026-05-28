import api from "@/lib/axios";
import type { Response, SingleResponse } from "@/types/Response";
import type { Destination } from "../types/destination";

export const getDestinationById = async (id: string): Promise<SingleResponse<Destination>> => {
  const { data } = await api.get<SingleResponse<Destination>>(`/destinations/${id}`);
  return data;
};

export const getDestinations = async (
  page: number,
  pageSize: number
): Promise<Response<Destination>> => {
  const { data } = await api.get<Response<Destination>>("/destinations", {
    params: { page, pageSize },
  });
  return data;
};

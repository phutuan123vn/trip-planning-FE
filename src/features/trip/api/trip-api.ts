import api from "@/lib/axios";
import type { Response, SingleResponse } from "@/types/Response";
import type { Trip } from "../types";

export const getTrips = async (
  page: number,
  pageSize: number
): Promise<Response<Trip>> => {
  const { data } = await api.get<Response<Trip>>("/trips", {
    params: { page, pageSize },
  });
  return data;
};

export const getTripById = async (id: string): Promise<SingleResponse<Trip>> => {
  const { data } = await api.get<SingleResponse<Trip>>(`/trips/${id}`);
  return data;
};

export const createTrip = async (input: {
  name: string;
  startDate: string;
  endDate: string;
  destinationIds: string[];
}): Promise<SingleResponse<Trip>> => {
  const { data } = await api.post<SingleResponse<Trip>>("/trips", input);
  return data;
};

export const updateTrip = async (
  id: string,
  input: {
    name: string;
    startDate: string;
    endDate: string;
    destinationIds: string[];
  }
): Promise<SingleResponse<Trip>> => {
  const { data } = await api.put<SingleResponse<Trip>>(`/trips/${id}`, input);
  return data;
};

export const deleteTrip = async (id: string): Promise<SingleResponse<null>> => {
  const { data } = await api.delete<SingleResponse<null>>(`/trips/${id}`);
  return data;
};

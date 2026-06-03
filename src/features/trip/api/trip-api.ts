import api from "@/lib/axios";
import type { PaginatedResponse } from "@/types/Response";
import type { Trip } from "../types";

export const getTrips = async (
  page: number,
  pageSize: number
): Promise<PaginatedResponse<Trip>> => {
  const { data } = await api.get<PaginatedResponse<Trip>>("/trips", {
    params: { page, pageSize },
  });
  return data;
};

export const getTripById = async (id: string): Promise<Trip> => {
  const { data } = await api.get<Trip>(`/trips/${id}`);
  return data;
};

export const createTrip = async (input: {
  name: string;
  startDate: string;
  endDate: string;
  destinationIds: string[];
}): Promise<Trip> => {
  const { data } = await api.post<Trip>("/trips", input);
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
): Promise<Trip> => {
  const { data } = await api.put<Trip>(`/trips/${id}`, input);
  return data;
};

export const deleteTrip = async (id: string): Promise<void> => {
  await api.delete(`/trips/${id}`);
};

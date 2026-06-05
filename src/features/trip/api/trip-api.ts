import api from "@/lib/axios";
import type { PaginationParams } from "@/types/PaginationParams";
import type { PaginatedResponse } from "@/types/Response";
import type { Trip, TripCreateInput, TripUpdateInput } from "../types";

const API_PATH = "/trips";

export const getTrips = async (
  req: PaginationParams,
): Promise<PaginatedResponse<Trip>> => {
  const { data } = await api.post<PaginatedResponse<Trip>>(
    `${API_PATH}/list`,
    req,
  );
  return data;
};

export const getTripById = async (id: string): Promise<PaginatedResponse<Trip>> => {
  const { data } = await api.get<PaginatedResponse<Trip>>(`${API_PATH}/${id}`);
  return data;
};

export const createTrip = async (input: TripCreateInput): Promise<Trip> => {
  const { data } = await api.post<Trip>(`${API_PATH}/`, input);
  return data;
};

export const updateTrip = async (
  id: string,
  input: TripUpdateInput,
): Promise<Trip> => {
  const { data } = await api.put<Trip>(`${API_PATH}/${id}`, input);
  return data;
};

export const deleteTrip = async (id: string): Promise<void> => {
  await api.delete(`${API_PATH}/${id}`);
};

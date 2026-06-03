import api from "@/lib/axios";
import type { PaginatedResponse } from "@/types/Response";
import type { Trip } from "../types";

const API_PATH = "/trips";


export const getTrips = async (
  page: number,
  pageSize: number
): Promise<PaginatedResponse<Trip>> => {
  const { data } = await api.post<PaginatedResponse<Trip>>(`${API_PATH}/list`, {
    data: { page, pageSize },
  });
  return data;
};

export const getTripById = async (id: string): Promise<Trip> => {
  const { data } = await api.get<Trip>(`${API_PATH}/${id}`);
  return data;
};

export const createTrip = async (input: {
  name: string;
  startDate: string;
  endDate: string;
  destinationIds: string[];
}): Promise<Trip> => {
  const { data } = await api.post<Trip>(`${API_PATH}`, input);
  return data;
};

export const updateTrip = async (
  id: string,
  input: {
    name: string;
    startDate: string;
    endDate: string;
    destinationIds: string[];
}): Promise<Trip> => {
  const { data } = await api.put<Trip>(`${API_PATH}/${id}`, input);
  return data;
};

export const deleteTrip = async (id: string): Promise<void> => {
  await api.delete(`${API_PATH}/${id}`);
};

import type { Destination } from "../destinations";

export interface Trip {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    destinations: Destination[];
}


export interface TripDetails extends Trip {}


export type TripCreateInput = {
    name: string;
    startDate: string;
    endDate: string;
    destinationIds: string[];
};

export type TripUpdateInput = TripCreateInput & {};
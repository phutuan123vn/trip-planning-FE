import type { Destination } from "../destinations";

export interface Trip {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    destinations: Destination[];
}
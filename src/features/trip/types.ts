import type { DestinationSummary } from "../destinations";

export interface Trip {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    destinations: DestinationSummary[];
}


export interface TripDetails extends Trip {}


export type TripCreateInput = {
    name: string;
    startDate: string;
    endDate: string;
    destinations: {
        id: string;
        startAt: string;
        endAt: string;
    }[];
};

export type TripUpdateInput = TripCreateInput & {};

// ── Wizard types ──────────────────────────────────────────────────────────────

export interface DayDestinationEntry {
    id: string;
    name: string;
    startAt: string;       // "HH:MM"
    endAt: string;         // "HH:MM"
    openingHour: string | null;
    closingHour: string | null;
}

export interface TripDayEntry {
    date: string;          // ISO date string for this calendar day
    destinations: DayDestinationEntry[];
}

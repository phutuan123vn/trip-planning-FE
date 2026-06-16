import { create } from "zustand";
import type { DayDestinationEntry, TripDayEntry } from "../types";

// ── Step 1 form ───────────────────────────────────────────────────────────────

export interface TripInfoForm {
  name: string;
  startDate: string;
  endDate: string;
}

export type TripInfoErrors = Partial<Record<keyof TripInfoForm, string>>;

// ── Store ─────────────────────────────────────────────────────────────────────

interface TripCreateStore {
  step: 1 | 2;
  info: TripInfoForm;
  infoErrors: TripInfoErrors;
  days: TripDayEntry[];

  setInfoField: <K extends keyof TripInfoForm>(key: K, value: TripInfoForm[K]) => void;
  validateInfo: () => boolean;
  goToStep2: () => void;
  goToStep1: () => void;

  addDestinationToDay: (dayIndex: number, dest: DayDestinationEntry) => void;
  removeDestinationFromDay: (dayIndex: number, destId: string) => void;

  reset: () => void;
}

const initialInfo: TripInfoForm = {
  name: "",
  startDate: "",
  endDate: "",
};

function buildDays(startDate: string, endDate: string): TripDayEntry[] {
  const days: TripDayEntry[] = [];
  for (let d = new Date(startDate); d <= new Date(endDate); d.setUTCDate(d.getUTCDate() + 1)) {
    days.push({ date: d.toISOString().slice(0, 10), destinations: [] });
  }
  return days;
}

function validateInfoFields(info: TripInfoForm): TripInfoErrors {
  const errors: TripInfoErrors = {};
  if (!info.name.trim()) errors.name = "Trip name is required";
  if (!info.startDate) errors.startDate = "Start date is required";
  if (!info.endDate) errors.endDate = "End date is required";
  else if (info.startDate && info.endDate <= info.startDate)
    errors.endDate = "End date must be after start date";
  return errors;
}

export const useTripCreateStore = create<TripCreateStore>((set, get) => ({
  step: 1,
  info: initialInfo,
  infoErrors: {},
  days: [],

  setInfoField: (key, value) =>
    set((state) => ({
      info: { ...state.info, [key]: value },
      infoErrors: { ...state.infoErrors, [key]: undefined },
    })),

  validateInfo: () => {
    const errors = validateInfoFields(get().info);
    set({ infoErrors: errors });
    return Object.keys(errors).length === 0;
  },

  goToStep2: () => {
    const { info, validateInfo } = get();
    if (!validateInfo()) return;
    const days = buildDays(info.startDate, info.endDate);
    set({ step: 2, days });
  },

  goToStep1: () => set({ step: 1 }),

  addDestinationToDay: (dayIndex, dest) =>
    set((state) => {
      const days = state.days.map((d, i) =>
        i === dayIndex
          ? { ...d, destinations: [...d.destinations, dest] }
          : d,
      );
      return { days };
    }),

  removeDestinationFromDay: (dayIndex, destId) =>
    set((state) => {
      const days = state.days.map((d, i) =>
        i === dayIndex
          ? { ...d, destinations: d.destinations.filter((dest) => dest.id !== destId) }
          : d,
      );
      return { days };
    }),

  reset: () => set({ step: 1, info: initialInfo, infoErrors: {}, days: [] }),
}));


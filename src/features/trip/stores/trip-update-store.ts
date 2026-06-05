import { create } from "zustand";
import {
  tripUpdateSchema,
  type TripUpdateSchema,
} from "../schemas/trip-update-schema";

type FormErrors = Partial<Record<keyof TripUpdateSchema, string>>;

interface TripUpdateStore {
  values: TripUpdateSchema;
  errors: FormErrors;
  setField: <K extends keyof TripUpdateSchema>(
    key: K,
    value: TripUpdateSchema[K],
  ) => void;
  validate: () => boolean;
  reset: () => void;
}

const initialValues: TripUpdateSchema = {
  name: "",
  startDate: "",
  endDate: "",
  destinationIds: [],
};

export const useTripUpdateStore = create<TripUpdateStore>((set, get) => ({
  values: initialValues,
  errors: {},

  setField: (key, value) =>
    set((state) => ({
      values: { ...state.values, [key]: value },
      errors: { ...state.errors, [key]: undefined },
    })),

  validate: () => {
    const result = tripUpdateSchema.safeParse(get().values);
    if (result.success) {
      set({ errors: {} });
      return true;
    }
    const errors: FormErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof TripUpdateSchema;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    set({ errors });
    return false;
  },

  reset: () => set({ values: initialValues, errors: {} }),
}));

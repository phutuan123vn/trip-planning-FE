import { create } from "zustand";
import {
  tripCreateSchema,
  type TripCreateInput,
} from "../schemas/trip-create-schema";

type FormErrors = Partial<Record<keyof TripCreateInput, string>>;

interface TripCreateStore {
  values: TripCreateInput;
  errors: FormErrors;
  setField: <K extends keyof TripCreateInput>(
    key: K,
    value: TripCreateInput[K]
  ) => void;
  validate: () => boolean;
  reset: () => void;
}

const initialValues: TripCreateInput = {
  name: "",
  startDate: "",
  endDate: "",
  destinationIds: [],
};

export const useTripCreateStore = create<TripCreateStore>((set, get) => ({
  values: initialValues,
  errors: {},

  setField: (key, value) =>
    set((state) => ({
      values: { ...state.values, [key]: value },
      errors: { ...state.errors, [key]: undefined },
    })),

  validate: () => {
    const result = tripCreateSchema.safeParse(get().values);
    if (result.success) {
      set({ errors: {} });
      return true;
    }
    const errors: FormErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof TripCreateInput;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    set({ errors });
    return false;
  },

  reset: () => set({ values: initialValues, errors: {} }),
}));

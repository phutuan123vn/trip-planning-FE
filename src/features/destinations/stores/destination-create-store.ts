import { create } from "zustand";
import {
  destinationCreateSchema,
  type DestinationCreateInput,
} from "../schemas/destination-create-schema";

type FormErrors = Partial<Record<keyof DestinationCreateInput, string>>;

interface DestinationCreateStore {
  values: DestinationCreateInput;
  errors: FormErrors;
  setField: <K extends keyof DestinationCreateInput>(
    key: K,
    value: DestinationCreateInput[K]
  ) => void;
  validate: () => boolean;
  reset: () => void;
}

const initialValues: DestinationCreateInput = {
  name: "",
  city: "",
  country: "",
  description: "",
  rating: "",
  latitude: "",
  longitude: "",
  images: [""],
  categoryIds: [],
};

export const useDestinationCreateStore = create<DestinationCreateStore>(
  (set, get) => ({
    values: initialValues,
    errors: {},

    setField: (key, value) =>
      set((state) => ({
        values: { ...state.values, [key]: value },
        errors: { ...state.errors, [key]: undefined },
      })),

    validate: () => {
      const result = destinationCreateSchema.safeParse(get().values);
      if (result.success) {
        set({ errors: {} });
        return true;
      }
      const errors: FormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof DestinationCreateInput;
        if (key && !errors[key]) errors[key] = issue.message;
      }
      set({ errors });
      return false;
    },

    reset: () => set({ values: initialValues, errors: {} }),
  })
);

import { z } from "zod";

export const tripCreateSchema = z.object({
  name: z.string().min(1, "Trip name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  destinationIds: z.array(z.string()).min(1, "Select at least one destination"),
});

export type TripCreateInput = z.input<typeof tripCreateSchema>;

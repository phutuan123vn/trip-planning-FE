import { z } from "zod";
import type { tripCreateSchema } from "./trip-create-schema";

const destinationSchema = z.object({
  id: z.string(),
  name: z.string(),
});


export const tripUpdateSchema = z.object({
  name: z.string().min(1, "Trip name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  destinationIds: z.array(destinationSchema).min(1, "Select at least one destination"),
});


export type TripUpdateSchema = z.infer<typeof tripUpdateSchema>;

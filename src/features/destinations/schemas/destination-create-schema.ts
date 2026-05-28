import { z } from "zod";

export const destinationCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  description: z.string(),
  rating: z
    .string()
    .min(1, "Rating is required")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 5,
      "Must be between 0 and 5"
    ),
  latitude: z.string(),
  longitude: z.string(),
  images: z.array(z.string()),
  categoryIds: z.array(z.string()).min(1, "Select at least one category"),
});

export type DestinationCreateInput = z.input<typeof destinationCreateSchema>;

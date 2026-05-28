import type { Category } from "@/features/categories";

export interface Destination{
  id: string;
  name: string;
  images: string[];
  city: string;
  country: string;
  description: string;
  rating: number;
  categories: Category[];
  latitude: number;
  longitude: number;
}

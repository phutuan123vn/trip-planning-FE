import type { Category } from "@/features/categories";
import type { ImageResponse } from "@/types/Image";

export interface Destination{
  id: string;
  name: string;
  city: string;
  country: string;
  description: string;
  rating: number;
  categories: Category[];
  latitude: number;
  longitude: number;
  openingHour: string;
  closingHour: string;
}


export interface DestinationDetails extends Destination {
  price: number;
  destinationType: "FREE" | "PAID" | null;
  images: ImageResponse[];
}


export interface DestinationSummary {
  id: string;
  name: string;
  city: string;
  country: string;
  description: string;
  rating: number;
  categories: Category[];
}

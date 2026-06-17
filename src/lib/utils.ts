import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import _ from "lodash";
import { getTokenCookie } from "./cookie";
import { redirect } from "@tanstack/react-router";
import { env } from "./env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uniqueKey(key: string): string {
  return _.uniqueId(`_${key}`);
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate + "T00:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function LoginRequired() {
  const hasToken = !!getTokenCookie();
  if (!hasToken) {
    throw redirect({
      to: "/",
    });
  }
}

export function renderImageUrl(imageUrl: string) {
  if (!imageUrl) {
    return "/images/placeholder.png";
  }
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }
  return `${env.VITE_API_URL}${imageUrl}`;
}

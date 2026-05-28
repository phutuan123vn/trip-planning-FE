import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataPagination } from "@/components/DataPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { DestinationCard } from "@/features/destinations/components/destination-card";
import { useDestinations } from "@/features/destinations/hooks/use-destinations";
import { uniqueKey } from "@/lib/utils";
import { useRouter, useSearch } from "@tanstack/react-router";
import { ChevronDown, Plus } from "lucide-react";
import React, { useState } from "react";

const CATEGORIES = ["Beach", "Mountain", "City", "Countryside", "Cultural"];

const MOCK_DESTINATIONS = [
  {
    id: "1",
    name: "Tegallalang Rice Terraces",
    city: "Ubud",
    country: "Indonesia",
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600",
    ],
    description: "",
    categories: [
      { id: "c1", name: "Nature" },
      { id: "c2", name: "Cultural" },
    ],
    latitude: -8.4,
    longitude: 115.2,
  },
  {
    id: "2",
    name: "Oia Sunset Point",
    city: "Santorini",
    country: "Greece",
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600",
    ],
    description: "",
    categories: [
      { id: "c3", name: "Beach" },
      { id: "c4", name: "City" },
    ],
    latitude: 36.4,
    longitude: 25.3,
  },
  {
    id: "3",
    name: "Arashiyama Bamboo Grove",
    city: "Kyoto",
    country: "Japan",
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600",
    ],
    description: "",
    categories: [
      { id: "c2", name: "Cultural" },
      { id: "c1", name: "Nature" },
    ],
    latitude: 35.0,
    longitude: 135.6,
  },
  {
    id: "4",
    name: "Machu Picchu Citadel",
    city: "Cusco Region",
    country: "Peru",
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600",
    ],
    description: "",
    categories: [
      { id: "c5", name: "Mountain" },
      { id: "c2", name: "Cultural" },
    ],
    latitude: -13.2,
    longitude: -72.5,
  },
  {
    id: "5",
    name: "Positano Village",
    city: "Amalfi Coast",
    country: "Italy",
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1612698093158-e07ac200d44e?w=600",
    ],
    description: "",
    categories: [
      { id: "c3", name: "Beach" },
      { id: "c4", name: "City" },
    ],
    latitude: 40.6,
    longitude: 14.4,
  },
  {
    id: "6",
    name: "Lake Louise",
    city: "Banff",
    country: "Canada",
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600",
    ],
    description: "",
    categories: [
      { id: "c5", name: "Mountain" },
      { id: "c1", name: "Nature" },
    ],
    latitude: 51.4,
    longitude: -116.2,
  },
  {
    id: "7",
    name: "Table Mountain",
    city: "Cape Town",
    country: "South Africa",
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600",
    ],
    description: "",
    categories: [
      { id: "c5", name: "Mountain" },
      { id: "c1", name: "Nature" },
    ],
    latitude: -33.9,
    longitude: 18.4,
  },
  {
    id: "8",
    name: "Central Park",
    city: "New York City",
    country: "USA",
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600",
    ],
    description: "",
    categories: [
      { id: "c4", name: "City" },
      { id: "c1", name: "Nature" },
    ],
    latitude: 40.7,
    longitude: -73.9,
  },
  {
    id: "9",
    name: "Eiffel Tower",
    city: "Paris",
    country: "France",
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600",
    ],
    description: "",
    categories: [
      { id: "c4", name: "City" },
      { id: "c2", name: "Cultural" },
    ],
    latitude: 48.8,
    longitude: 2.3,
  },
  {
    id: "10",
    name: "Ha Long Bay Cruise",
    city: "Quảng Ninh",
    country: "Vietnam",
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600",
    ],
    description: "",
    categories: [
      { id: "c3", name: "Beach" },
      { id: "c1", name: "Nature" },
    ],
    latitude: 20.9,
    longitude: 107.1,
  },
  {
    id: "11",
    name: "Torres del Paine",
    city: "Patagonia",
    country: "Argentina",
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600",
    ],
    description: "",
    categories: [
      { id: "c5", name: "Mountain" },
      { id: "c6", name: "Countryside" },
    ],
    latitude: -50.9,
    longitude: -73.4,
  },
  {
    id: "12",
    name: "Overwater Bungalows",
    city: "Malé",
    country: "Maldives",
    rating: 5.0,
    images: [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600",
    ],
    description: "",
    categories: [{ id: "c3", name: "Beach" }],
    latitude: 4.2,
    longitude: 73.5,
  },
];

const PAGE_SIZE = 12;

function DestinationCardSkeleton() {
  return (
    <Card className="overflow-hidden gap-0">
      <Skeleton className="h-48 w-full rounded-none rounded-t-xl" />
      <CardContent className="pt-3 pb-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export const DestinationDashboard: React.FC = () => {
  const router = useRouter();
  const params = useSearch({
    from: "/",
  });
  const [page, setPage] = useState(params.page || 1);
  const [nearMe, setNearMe] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { data, isLoading, isError, error, refetch } = useDestinations(page, PAGE_SIZE);

  function toggleCategory(category: string) {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  }

  const destinations = data?.data?.length ? data.data : MOCK_DESTINATIONS;
  const pagination = data?.pagination ?? {
    page,
    pageSize: PAGE_SIZE,
    total: PAGE_SIZE * 4, // mock: simulate 4 pages
    hasNext: page < 4,
    hasPrevious: page > 1,
  };

  if (isError) {
    return (
      <div className="container p-4 flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Failed to load destinations</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Something went wrong while fetching destinations."}
          </p>
        </div>
        <Button onClick={() => refetch()}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="container p-4 space-y-6">
      <h3 className="text-xl font-semibold">Destinations</h3>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: filters */}
        <div className="flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-32 justify-between"
              >
                Category
                {selectedCategories.length > 0 && (
                  <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-1.5 py-0.5 leading-none">
                    {selectedCategories.length}
                  </span>
                )}
                <ChevronDown className="size-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {CATEGORIES.map((cat) => (
                <DropdownMenuCheckboxItem
                  key={uniqueKey(`cat-${cat}`)}
                  checked={selectedCategories.includes(cat)}
                  onCheckedChange={() => toggleCategory(cat)}
                >
                  {cat}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
            <Checkbox
              checked={nearMe}
              onCheckedChange={(v) => setNearMe(!!v)}
            />
            Near my location
          </label>
        </div>

        {/* Right: action */}
        <Button
          size="sm"
          className="gap-1"
          onClick={() => router.navigate({ to: '/destination/create' })}
        >
          <Plus className="size-4" />
          Create your trip
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <DestinationCardSkeleton key={uniqueKey(`skeleton-${i}`)} />
            ))
          : destinations.map((destination) => (
              <DestinationCard
                key={uniqueKey(`dest-${destination.id}`)}
                name={destination.name}
                images={destination.images}
                city={destination.city}
                country={destination.country}
                rating={destination.rating}
                categories={destination.categories}
              />
            ))}
      </div>
      {pagination && (
        <DataPagination
          page={page}
          pagination={pagination}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataPagination } from "@/components/DataPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/features/categories";
import { DestinationCard } from "@/features/destinations/components/destination-card";
import { useDestinations } from "@/features/destinations/hooks/use-destinations";
import { uniqueKey } from "@/lib/utils";
import type { PaginationParams } from "@/types/PaginationParams";
import { useRouter, useSearch } from "@tanstack/react-router";
import { ArrowUpDown, ChevronDown, Plus, Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import React, { useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 20;

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
  const [paginatedParams, setPaginatedParams] = useState<PaginationParams>({
    page: params.page || 1,
    pageSize: PAGE_SIZE,
    filters: {},
    sortBy: params.sortBy || undefined,
    sortDirection: params.sortDirection || undefined,
  });

  const [nearMe, setNearMe] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortOption, setSortOption] = useState("");

  const debouncedSearch = useDebounce((value: string) => {
    setPaginatedParams((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        name__like: value ? [value] : undefined,
      },
      page: 1,
    }));
  }, 1000);

  const handleSortChange = (option: string) => {
    setSortOption(option);
    if (!option) {
      setPaginatedParams((prev) => ({
        ...prev,
        sortBy: undefined,
        sortDirection: undefined,
        page: 1,
      }));
      return;
    }
    const lastUnderscore = option.lastIndexOf("_");
    const field = option.slice(0, lastUnderscore);
    const direction = option.slice(lastUnderscore + 1) as "asc" | "desc";
    setPaginatedParams((prev) => ({
      ...prev,
      sortBy: field,
      sortDirection: direction,
      page: 1,
    }));
  };
  const {
    data: destinationRes,
    isLoading,
    isError,
    error,
    refetch,
    isSuccess,
  } = useDestinations(paginatedParams);
  const { data: categoryRes } = useCategories({
    page: 1,
    pageSize: 1000,
    filters: {},
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      const nextCategories = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];

      setPaginatedParams((prevParams) => ({
        ...prevParams,
        filters: {
          ...prevParams.filters,
          "categories.id": nextCategories,
        },
        page: 1,
      }));

      return nextCategories;
    });
  }

  const getCurrentLocation = (v: boolean) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setNearMe(false);
      return;
    }
    if (!v) {
      setNearMe(false);
      setPaginatedParams((prevParams) => ({
        ...prevParams,
        filters: {
          ...prevParams.filters,
          coordinates__near: undefined,
        },
        page: 1,
      }));
      return;
    }
    
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setNearMe(true);
      setPaginatedParams((prevParams) => ({
        ...prevParams,
        filters: {
          ...prevParams.filters,
          coordinates__near: [latitude, longitude, 20],
        },
        page: 1,
      }));
    }, (error) => {
      toast.error("Failed to get your location. Please allow location access and try again.", { duration: 5000 });
      setNearMe(false);
    });
  }

  const destinations = isSuccess ? destinationRes.data : [];
  const categories = categoryRes?.data ?? [];
  const pagination = destinationRes?.pagination ?? {
    page: 1,
    pageSize: PAGE_SIZE,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
    totalPages: 0,
  };

  if (isError) {
    return (
      <div className="mx-auto container p-4 flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
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
            {error instanceof Error
              ? error.message
              : "Something went wrong while fetching destinations."}
          </p>
        </div>
        <Button onClick={() => refetch()}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto container p-4 flex flex-col gap-6 min-h-[calc(100vh-1rem)]">
      <h3 className="text-xl font-semibold">Destinations</h3>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search destinations..."
          className="pl-8 h-9"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            debouncedSearch(e.target.value);
          }}
        />
      </div>

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
              {categories.map((cat) => (
                <DropdownMenuCheckboxItem
                  key={uniqueKey(`cat-${cat.id}`)}
                  checked={selectedCategories.includes(cat.id)}
                  onCheckedChange={() => toggleCategory(cat.id)}
                >
                  {cat.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-40 justify-between">
                <span className="flex items-center gap-1.5">
                  <ArrowUpDown className="size-3.5 opacity-60" />
                  {sortOption
                    ? sortOption === "rating_asc" ? "Rating asc"
                    : sortOption === "rating_desc" ? "Rating desc"
                    : sortOption === "name_asc" ? "Name asc"
                    : "Name desc"
                    : "Sort by"}
                </span>
                <ChevronDown className="size-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuCheckboxItem
                checked={sortOption === "rating_asc"}
                onCheckedChange={() => handleSortChange(sortOption === "rating_asc" ? "" : "rating_asc")}
              >
                Rating asc
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortOption === "rating_desc"}
                onCheckedChange={() => handleSortChange(sortOption === "rating_desc" ? "" : "rating_desc")}
              >
                Rating desc
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortOption === "name_asc"}
                onCheckedChange={() => handleSortChange(sortOption === "name_asc" ? "" : "name_asc")}
              >
                Name asc
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortOption === "name_desc"}
                onCheckedChange={() => handleSortChange(sortOption === "name_desc" ? "" : "name_desc")}
              >
                Name desc
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
            <Checkbox
              checked={nearMe}
              onCheckedChange={getCurrentLocation}
            />
            Near my location
          </label>
        </div>

        {/* Right: action */}
        <Button
          size="sm"
          className="gap-1"
          onClick={() => router.navigate({ to: "/trip/create" })}
        >
          <Plus className="size-4" />
          Create your trip
        </Button>
      </div>
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 content-start">
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
          page={paginatedParams.page}
          pagination={pagination}
          onPageChange={(newPage) =>
            setPaginatedParams({ ...paginatedParams, page: newPage })
          }
        />
      )}
    </div>
  );
};

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiSelect } from "@/components/multi-select";
import { useDestinations } from "@/features/destinations/hooks/use-destinations";
import { useTripDetail } from "@/features/trip/hooks/use-trips";
import { useTripCreateStore } from "@/features/trip/stores/trip-create-store";
import type { TripCreateInput } from "@/features/trip/schemas/trip-create-schema";
import React, { useEffect } from "react";

interface TripUpdateProps {
  tripId: string;
  onSubmit?: (data: TripCreateInput) => void;
  isSubmitting?: boolean;
}

const MOCK_DESTINATIONS = [
  { id: "1", name: "Oia Sunset Point" },
  { id: "2", name: "Tegallalang Rice Terraces" },
  { id: "3", name: "Machu Picchu Citadel" },
  { id: "4", name: "Positano Village" },
  { id: "5", name: "Eiffel Tower" },
  { id: "6", name: "Ha Long Bay Cruise" },
  { id: "7", name: "Arashiyama Bamboo Grove" },
  { id: "8", name: "Lake Louise" },
];

export function TripUpdate({
  tripId,
  onSubmit,
  isSubmitting = false,
}: TripUpdateProps) {
  const { values: form, errors, setField, validate, reset } =
    useTripCreateStore();

  const { data: tripResponse, isPending: tripPending } = useTripDetail(tripId);
  const { data: destinationsResponse, isPending: destinationsPending } =
    useDestinations(1, 100);

  const allDestinations = destinationsResponse?.data?.length
    ? destinationsResponse.data.map((d) => ({ id: d.id, name: d.name }))
    : MOCK_DESTINATIONS;

  useEffect(() => {
    reset();
    return () => reset();
  }, []);

  // Populate form when trip data loads
  useEffect(() => {
    if (tripResponse?.data) {
      const trip = tripResponse.data;
      setField("name", trip.name);
      setField("startDate", trip.startDate);
      setField("endDate", trip.endDate);
      setField(
        "destinationIds",
        trip.destinations.map((d) => d.id)
      );
    }
  }, [tripResponse?.data]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSubmit?.(form);
  }

  if (tripPending) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 p-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-6 p-4"
    >
      <h1 className="text-2xl font-semibold">Update Trip</h1>

      {/* Trip name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">Trip Name</Label>
        <Input
          id="name"
          placeholder="e.g. Summer in Europe"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={form.startDate}
            onChange={(e) => setField("startDate", e.target.value)}
            aria-invalid={!!errors.startDate}
          />
          {errors.startDate && (
            <p className="text-xs text-destructive">{errors.startDate}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={form.endDate}
            onChange={(e) => setField("endDate", e.target.value)}
            aria-invalid={!!errors.endDate}
          />
          {errors.endDate && (
            <p className="text-xs text-destructive">{errors.endDate}</p>
          )}
        </div>
      </div>

      {/* Destinations */}
      <div className="space-y-1.5">
        <Label>Destinations</Label>
        <MultiSelect
          options={allDestinations.map((d) => ({
            value: d.id,
            label: d.name,
          }))}
          value={form.destinationIds}
          onChange={(ids) => setField("destinationIds", ids)}
          placeholder="Select destinations…"
          isLoading={destinationsPending}
        />
        {errors.destinationIds && (
          <p className="text-xs text-destructive">{errors.destinationIds}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Updating…" : "Update Trip"}
      </Button>
    </form>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { DestinationMultiSelect } from "@/features/destinations";
import { useTripUpdateStore } from "@/features/trip";
import { useTripDetail, useUpdateTrip } from "@/features/trip/hooks/use-trips";
import { useEffect, type SubmitEvent } from "react";
import { toast } from "sonner";
import { DatePickerInput } from "../ui/date-picker";

interface TripUpdateProps {
  tripId: string;
}

export function TripUpdate({ tripId }: TripUpdateProps) {
  const {
    values: form,
    errors,
    setField,
    validate,
    reset,
  } = useTripUpdateStore();

  const { data: tripResponse, isPending: tripPending } = useTripDetail(tripId);
  const { mutateAsync: onSubmit, isPending: isSubmitting } = useUpdateTrip();

  // Populate form when trip data loads
  useEffect(() => {
    if (tripResponse) {
      const trip = tripResponse.data?.[0] || null;
      if (!trip) throw new Error("Trip not found");
      setField("name", trip.name);
      setField("startDate", trip.startDate);
      setField("endDate", trip.endDate);
      setField(
        "destinationIds",
        trip.destinations?.map((d) => ({ id: d.id, name: d.name })) || [],
      );
    }
  }, [tripResponse]);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix validation errors");
      return;
    }
    const destinationIds = form.destinationIds.map((d) => d.id);
    onSubmit({
      id: tripId,
      ...form,
      destinationIds,
    })
      .then(() => {
        toast.success("Trip updated successfully");
      })
      .catch(() => {
        toast.error("Failed to update trip");
      });
  }

  if (tripPending) {
    return (
      <div className="container max-w-2xl mx-auto space-y-6 p-4">
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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 p-4">
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
          <DatePickerInput
            label="End Date"
            value={form.startDate ? new Date(form.startDate) : undefined}
            onChange={(date) =>
              setField("startDate", date ? date.toISOString() : "")
            }
            utc
          />
          {errors.startDate && (
            <p className="text-xs text-destructive">{errors.startDate}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <DatePickerInput
            label="End Date"
            value={form.endDate ? new Date(form.endDate) : undefined}
            onChange={(date) =>
              setField("endDate", date ? date.toISOString() : "")
            }
            utc
          />
          {errors.endDate && (
            <p className="text-xs text-destructive">{errors.endDate}</p>
          )}
        </div>
      </div>

      {/* Destinations */}
      <div className="space-y-1.5 min-w-104">
        <Label>Destinations</Label>
        <DestinationMultiSelect
          value={form.destinationIds}
          onChange={(ids) => setField("destinationIds", ids)}
          placeholder="Select destinations…"
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth";
import { LoginDialog } from "@/features/auth/components/login-dialog";
import { useCreateTrip } from "@/features/trip";
import { TripDaySection } from "@/features/trip/components/trip-day-section";
import { useTripCreateStore } from "@/features/trip/stores/trip-create-store";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DatePickerInput } from "../ui/date-picker";

export function TripCreate() {
  const {
    step,
    info: form,
    infoErrors: errors,
    days,
    setInfoField,
    goToStep2,
    goToStep1,
    addDestinationToDay,
    removeDestinationFromDay,
    reset,
  } = useTripCreateStore();

  const { isAuthenticated } = useAuth();
  const { mutate: createTrip, isPending } = useCreateTrip();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  useEffect(() => {
    reset();
    return () => reset();
  }, []);

  // ── Step 1: Next ──────────────────────────────────────────────────────────

  function handleNext(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    goToStep2();
  }

  // ── Step 2: Create Trip ───────────────────────────────────────────────────

  function buildPayload() {
    const { name, startDate, endDate } = form;

    const destinations = days.flatMap((day) =>
      day.destinations.map((d) => ({
        id: d.id,
        startAt: `${d.startAt}:00`,
        endAt: `${d.endAt}:00`,
      })),
    );

    return { name, startDate, endDate, destinations };
  }

  function handleCreateClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }
    createTrip(buildPayload(), {
      onSuccess: () => {
        toast.success("Trip created successfully!");
        reset();
      },
      onError: (error) => {
        toast.error("Failed to create trip. Please try again.");
        console.error("Create trip error:", error);
      },
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <form className="max-w-5xl mx-auto space-y-6 p-4 text-left">
      <h1 className="text-2xl font-semibold !text-black">Create Trip</h1>

      {/* ── Step 1 ─────────────────────────────────────────────────────────── */}
      {step === 1 && (
        <>
          {/* Trip name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Trip Name</Label>
            <Input
              id="name"
              placeholder="e.g. Summer in Europe"
              value={form.name}
              onChange={(e) => setInfoField("name", e.target.value)}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Start date */}
          <div className="space-y-1.5">
            <DatePickerInput
              label="Start Date"
              value={form.startDate ? new Date(form.startDate) : undefined}
              onChange={(date) =>
                setInfoField(
                  "startDate",
                  date ? date.toISOString() : "",
                )
              }
              utc
            />
            {errors.startDate && (
              <p className="text-xs text-destructive">{errors.startDate}</p>
            )}
          </div>

          {/* End date */}
          <div className="space-y-1.5">
            <DatePickerInput
              label="End Date"
              value={form.endDate ? new Date(form.endDate) : undefined}
              onChange={(date) =>
                setInfoField(
                  "endDate",
                  date ? new Date(date.setUTCHours(23, 59, 59, 999)).toISOString() : "",
                )
              }
              utc
            />
            {errors.endDate && (
              <p className="text-xs text-destructive">{errors.endDate}</p>
            )}
          </div>

          <Button type="button" className="w-full" onClick={handleNext}>
            Next
          </Button>
        </>
      )}

      {/* ── Step 2 ─────────────────────────────────────────────────────────── */}
      {step === 2 && (
        <>
          <button
            type="button"
            onClick={goToStep1}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>

          <div className="space-y-4">
            {days.map((day, i) => (
              <TripDaySection
                key={day.date}
                dayIndex={i}
                day={day}
                onAddDestination={addDestinationToDay}
                onRemoveDestination={removeDestinationFromDay}
              />
            ))}
          </div>

          <Button
            type="button"
            disabled={isPending}
            className="w-full"
            onClick={handleCreateClick}
          >
            {isPending ? "Creating…" : "Create Trip"}
          </Button>
        </>
      )}

      <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </form>
  );
}

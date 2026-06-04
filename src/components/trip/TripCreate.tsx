import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DestinationMultiSelect } from "@/features/destinations/components/destination-multi-select";
import { useTripCreateStore } from "@/features/trip/stores/trip-create-store";
import { useEffect, useState, type SubmitEvent } from "react";
import { DatePickerInput } from "../ui/date-picker";
import { useCreateTrip } from "@/features/trip";
import { LoginDialog } from "@/features/auth/components/login-dialog";
import { useAuth } from "@/features/auth";
import { toast } from "sonner";

export function TripCreate() {
  const {
    values: form,
    errors,
    setField,
    validate,
    reset,
  } = useTripCreateStore();

  const {isAuthenticated} = useAuth();

  const { mutate: createTrip, isPending } = useCreateTrip();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  useEffect(() => {
    reset();
    return () => reset();
  }, []);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (validate()) createTrip?.(form);
  }

  function handleCreateClick() {
    if(validate() && !isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }
    if (validate() && isAuthenticated) {
      createTrip?.(form);
      toast.success("Trip created successfully!");
      reset();
      return;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-semibold !text-black">Create Trip</h1>

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
              setField(
                "startDate",
                date ? date.toISOString() :"",
              )
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

      

      <Button
        type="button"
        disabled={isPending}
        className="w-full"
        onClick={handleCreateClick}
      >
        {isPending ? "Creating…" : "Create Trip"}
      </Button>

      <LoginDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
      />
    </form>
  );
}

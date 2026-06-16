import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddDestinationDialog } from "./add-destination-dialog";
import type { DayDestinationEntry, TripDayEntry } from "../types";
import { formatDate } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface TripDaySectionProps {
  dayIndex: number;
  day: TripDayEntry;
  onAddDestination: (dayIndex: number, dest: DayDestinationEntry) => void;
  onRemoveDestination: (dayIndex: number, destId: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TripDaySection({
  dayIndex,
  day,
  onAddDestination,
  onRemoveDestination,
}: TripDaySectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3 text-left w-100">
      {/* Day header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Day {dayIndex + 1}
          </p>
          <h3 className="font-semibold text-sm">{formatDate(day.date)}</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          {day.destinations.length} stop{day.destinations.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Destination list */}
      {day.destinations.length > 0 && (
        <div className="space-y-2">
          {day.destinations.map((dest, i) => (
            <div key={`${dest.id}-${i}`}>
              {i > 0 && <Separator className="my-2" />}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{dest.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      <span>{dest.startAt} – {dest.endAt}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${dest.name}`}
                  onClick={() => onRemoveDestination(dayIndex, dest.id)}
                  className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full gap-1.5"
        onClick={() => setDialogOpen(true)}
      >
        <Plus className="size-3.5" />
        Add Destination
      </Button>

      <AddDestinationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        dayDate={formatDate(day.date)}
        existingDestinations={day.destinations}
        onAdd={(dest) => {
          onAddDestination(dayIndex, dest);
          setDialogOpen(false);
        }}
      />
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDestinationById, useInfiniteDestinations } from "@/features/destinations";
import { useDebounce } from "@/hooks/use-debounce";
import { cn, uniqueKey } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { ChevronDown, Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { DayDestinationEntry } from "../types";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Parse "HH:MM" into total minutes since midnight */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** True when [aStart,aEnd) overlaps [bStart,bEnd) */
function timesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  const aS = toMinutes(aStart);
  const aE = toMinutes(aEnd);
  const bS = toMinutes(bStart);
  const bE = toMinutes(bEnd);
  return aS < bE && bS < aE;
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface AddDestinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayDate: string;
  existingDestinations: DayDestinationEntry[];
  onAdd: (dest: DayDestinationEntry) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AddDestinationDialog({
  open,
  onOpenChange,
  dayDate,
  existingDestinations,
  onAdd,
}: AddDestinationDialogProps) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string>("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Destination search ────────────────────────────────────────────────────

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasNextPageRef = useRef(false);
  const isFetchingNextPageRef = useRef(false);

  const updateDebouncedSearch = useDebounce(
    (val: string) => setDebouncedSearch(val),
    400,
  );

  const filters = useMemo(
    () => (debouncedSearch ? { name__ilike: [debouncedSearch] } : undefined),
    [debouncedSearch],
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteDestinations(filters);

  hasNextPageRef.current = !!hasNextPage;
  isFetchingNextPageRef.current = isFetchingNextPage;

  const destinations = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  function handleSelectDestination(id: string, name: string) {
    setSelectedId(id);
    setSelectedName(name);
    setDropdownOpen(false);
    setErrors((e) => ({ ...e, destination: undefined as unknown as string }));
  }

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    if (nearBottom && hasNextPageRef.current && !isFetchingNextPageRef.current) {
      fetchNextPage();
    }
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    updateDebouncedSearch(e.target.value);
  }

  // ── Validation & submit ───────────────────────────────────────────────────

  const HH_MM = /^([01]\d|2[0-3]):([0-5]\d)$/;

  async function handleAdd() {
    const newErrors: Record<string, string> = {};

    if (!selectedId) newErrors.destination = "Please select a destination";
    if (!startAt) newErrors.startAt = "Start time is required";
    else if (!HH_MM.test(startAt)) newErrors.startAt = "Use HH:MM format (e.g. 08:00)";
    if (!endAt) newErrors.endAt = "End time is required";
    else if (!HH_MM.test(endAt)) newErrors.endAt = "Use HH:MM format (e.g. 10:00)";

    if (!newErrors.startAt && !newErrors.endAt) {
      if (toMinutes(startAt) >= toMinutes(endAt)) {
        newErrors.endAt = "End time must be after start time";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Fetch destination details for opening/closing hour validation
      const details = destinations.find((d) => d.id === selectedId) ?? (() => { throw new Error("Selected destination not found"); })();
      const openingHour = details.openingHour ?? null;
      const closingHour = details.closingHour ?? null;

      // Check against destination operating hours (only when both exist)
      if (openingHour && closingHour) {
        if (toMinutes(startAt) < toMinutes(openingHour)) {
          setErrors({ startAt: `Destination opens at ${openingHour}` });
          setIsSubmitting(false);
          return;
        }
        if (toMinutes(endAt) > toMinutes(closingHour)) {
          setErrors({ endAt: `Destination closes at ${closingHour}` });
          setIsSubmitting(false);
          return;
        }
      }

      // Check for time conflicts with existing destinations on this day
      for (const existing of existingDestinations) {
        if (timesOverlap(startAt, endAt, existing.startAt, existing.endAt)) {
          setErrors({
            startAt: `Conflicts with "${existing.name}" (${existing.startAt}–${existing.endAt})`,
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Check that new destination starts after all existing endings
      for (const existing of existingDestinations) {
        if (toMinutes(startAt) < toMinutes(existing.endAt)) {
          setErrors({
            startAt: `Must start after "${existing.name}" ends at ${existing.endAt}`,
          });
          setIsSubmitting(false);
          return;
        }
      }

      onAdd({
        id: selectedId,
        name: selectedName,
        startAt,
        endAt,
        openingHour,
        closingHour,
      });

      handleClose();
    } catch {
      setErrors({ destination: "Failed to load destination details. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    setSelectedId("");
    setSelectedName("");
    setStartAt("");
    setEndAt("");
    setErrors({});
    setSearch("");
    setDebouncedSearch("");
    onOpenChange(false);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-black!">Add Destination — {dayDate}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Destination selector */}
          <div className="space-y-1.5">
            <Label>Destination</Label>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex min-h-8 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                    errors.destination && "border-destructive",
                  )}
                >
                  {selectedId ? (
                    <Badge variant="secondary" className="text-xs">{selectedName}</Badge>
                  ) : (
                    <span className="text-muted-foreground">Select a destination…</span>
                  )}
                  <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="w-(--radix-dropdown-menu-trigger-width) p-0"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <div className="flex items-center gap-2 border-b px-2 py-1.5">
                  <Search className="size-3.5 shrink-0 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search…"
                    className="h-7 border-0 p-0 text-sm shadow-none focus-visible:ring-0"
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
                <div
                  ref={scrollContainerRef}
                  className="max-h-52 overflow-y-auto"
                  onScroll={handleScroll}
                >
                  {isLoading ? (
                    <div className="flex justify-center py-3">
                      <Spinner className="size-4" />
                    </div>
                  ) : destinations.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-muted-foreground">No results</p>
                  ) : (
                    destinations.map((d) => (
                      <DropdownMenuCheckboxItem
                        key={uniqueKey(`add-dst-${d.id}`)}
                        checked={selectedId === d.id}
                        onCheckedChange={() => handleSelectDestination(d.id, d.name)}
                        className="text-sm"
                      >
                        <span className="font-medium">{d.name}</span>
                        <span className="ml-1 text-muted-foreground">
                          {d.city}, {d.country}
                        </span>
                      </DropdownMenuCheckboxItem>
                    ))
                  )}
                  {isFetchingNextPage && (
                    <div className="flex justify-center py-2">
                      <Spinner className="size-3" />
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            {errors.destination && (
              <p className="text-xs text-destructive">{errors.destination}</p>
            )}
          </div>

          {/* Time fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="add-dest-start">Start Time</Label>
              <Input
                id="add-dest-start"
                type="time"
                placeholder="08:00"
                value={startAt}
                onChange={(e) => {
                  setStartAt(e.target.value);
                  setErrors((err) => ({ ...err, startAt: undefined as unknown as string }));
                }}
                aria-invalid={!!errors.startAt}
                className={cn(errors.startAt && "border-destructive")}
              />
              {errors.startAt && (
                <p className="text-xs text-destructive">{errors.startAt}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-dest-end">End Time</Label>
              <Input
                id="add-dest-end"
                type="time"
                placeholder="10:00"
                value={endAt}
                onChange={(e) => {
                  setEndAt(e.target.value);
                  setErrors((err) => ({ ...err, endAt: undefined as unknown as string }));
                }}
                aria-invalid={!!errors.endAt}
                className={cn(errors.endAt && "border-destructive")}
              />
              {errors.endAt && (
                <p className="text-xs text-destructive">{errors.endAt}</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={isSubmitting}>
            {isSubmitting ? "Checking…" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

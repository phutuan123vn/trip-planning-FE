import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataPagination } from "@/components/DataPagination";
import { useTrips } from "@/features/trip/hooks/use-trips";
import { uniqueKey } from "@/lib/utils";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { CalendarDays, MapPin, Pencil, Plus, Trash2 } from "lucide-react";

const MOCK_TRIPS = [
  {
    id: "1",
    name: "Summer in Europe",
    startDate: "2026-07-01",
    endDate: "2026-07-21",
    destinations: [
      { id: "1", name: "Oia Sunset Point", city: "Santorini", country: "Greece", rating: 4.9, images: [], description: "", categories: [], latitude: 0, longitude: 0 },
      { id: "2", name: "Positano Village", city: "Amalfi Coast", country: "Italy", rating: 4.8, images: [], description: "", categories: [], latitude: 0, longitude: 0 },
      { id: "3", name: "Eiffel Tower", city: "Paris", country: "France", rating: 4.7, images: [], description: "", categories: [], latitude: 0, longitude: 0 },
    ],
  },
  {
    id: "2",
    name: "Asia Adventure",
    startDate: "2026-09-10",
    endDate: "2026-09-25",
    destinations: [
      { id: "4", name: "Tegallalang Rice Terraces", city: "Ubud", country: "Indonesia", rating: 4.8, images: [], description: "", categories: [], latitude: 0, longitude: 0 },
      { id: "5", name: "Ha Long Bay Cruise", city: "Quảng Ninh", country: "Vietnam", rating: 4.8, images: [], description: "", categories: [], latitude: 0, longitude: 0 },
    ],
  },
  {
    id: "3",
    name: "South America Trek",
    startDate: "2026-11-01",
    endDate: "2026-11-14",
    destinations: [
      { id: "6", name: "Machu Picchu Citadel", city: "Cusco Region", country: "Peru", rating: 4.9, images: [], description: "", categories: [], latitude: 0, longitude: 0 },
    ],
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function tripDuration(start: string, end: string) {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function YourTrips() {
  const search = useSearch({ strict: false }) as { page?: number };
  const page = search.page ?? 1;
  const pageSize = 10;
  const navigate = useNavigate();

  const { data: response, isPending, isError } = useTrips(page, pageSize);

  function handleDelete(tripId: string) {
    // TODO: integrate with delete API
    console.log("Delete trip:", tripId);
  }

  const trips = response?.data?.length ? response.data : MOCK_TRIPS;
  const pagination = response?.pagination ?? {
    page,
    pageSize,
    total: MOCK_TRIPS.length,
    hasNext: false,
    hasPrevious: page > 1,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Trips</h1>
        <Button
          onClick={() => navigate({ to: "/trip/create" })}
          className="gap-1.5"
        >
          <Plus className="size-4" />
          New Trip
        </Button>
      </div>

      {/* Table */}
      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={uniqueKey(`skel-${i}`)} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          Failed to load trips.
        </div>
      ) : trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
          <p>No trips yet. Start planning your next adventure!</p>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/trip/create" })}
          >
            Create your first trip
          </Button>
        </div>
      ) : (
        <>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Trip Name</TableHead>
                  <TableHead className="w-[280px]">Dates</TableHead>
                  <TableHead className="w-[100px]">Duration</TableHead>
                  <TableHead className="w-[150px]">Destinations</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={uniqueKey(`trip-${trip.id}`)}>
                    <TableCell className="font-medium text-left">{trip.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <CalendarDays className="size-3.5 shrink-0" />
                        <span>
                          {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {tripDuration(trip.startDate, trip.endDate)} days
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="text-sm">
                          {trip.destinations.length}{" "}
                          {trip.destinations.length === 1
                            ? "destination"
                            : "destinations"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            navigate({
                              to: "/trip/update",
                              search: { id: trip.id },
                            })
                          }
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(trip.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.total > pageSize && (
            <DataPagination
              page={page}
              pagination={pagination}
              onPageChange={(newPage) =>
                navigate({
                  to: "/trip/your-trips",
                  search: { page: newPage },
                })
              }
            />
          )}
        </>
      )}
    </div>
  );
}

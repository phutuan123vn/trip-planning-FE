import { DataPagination } from "@/components/DataPagination";
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
import { useTrips } from "@/features/trip/hooks/use-trips";
import { uniqueKey } from "@/lib/utils";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { CalendarDays, MapPin, Pencil, Plus, Trash2 } from "lucide-react";

const PAGE_SIZE = 5;

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
  const navigate = useNavigate();
  const search = useSearch({ from: "/trip/your-trips" });
  const paginationParams = {
    page: search.page ? Number(search.page) : 1,
    pageSize: PAGE_SIZE,
    filters: {},
  };

  const {
    data: response,
    isPending,
    isError,
    refetch,
  } = useTrips(paginationParams);

  function handleDelete(tripId: string) {
    // TODO: integrate with delete API
    console.log("Delete trip:", tripId);
  }

  const trips = response?.data?.length ? response.data : [];

  return (
    <div className="container max-w-5xl mx-auto space-y-6 p-4">
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
            <Skeleton
              key={uniqueKey(`skel-${i}`)}
              className="h-14 w-full rounded-lg"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          Failed to load trips.
          <Button variant="link" onClick={() => refetch()} className="ml-2">
            Retry
          </Button>
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
        <div className="space-y-4 min-h-101 flex flex-col justify-between">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Trip Name</TableHead>
                  <TableHead className="w-[280px]">Dates</TableHead>
                  <TableHead className="w-[100px]">Duration</TableHead>
                  <TableHead className="w-[150px]">Destinations</TableHead>
                  <TableHead className="w-[120px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={uniqueKey(`trip-${trip.id}`)}>
                    <TableCell className="font-medium text-left">
                      {trip.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <CalendarDays className="size-3.5 shrink-0" />
                        <span>
                          {formatDate(trip.startDate)} –{" "}
                          {formatDate(trip.endDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-left">
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

          <DataPagination
            page={paginationParams.page}
            pagination={response.pagination}
            onPageChange={(newPage) =>
              navigate({
                to: "/trip/your-trips",
                search: { page: newPage },
              })
            }
          />
        </div>
      )}
    </div>
  );
}

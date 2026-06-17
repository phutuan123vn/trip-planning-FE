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
import { useIsAdmin } from "@/features/auth";
import { useDestinations } from "@/features/destinations/hooks/use-destinations";
import { uniqueKey } from "@/lib/utils";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Eye, MapPin, Pencil, Plus, Star } from "lucide-react";

const PAGE_SIZE = 5;

export function ManageDestinations() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/destination/manage" });
  const isAdmin = useIsAdmin();
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
  } = useDestinations(paginationParams);

  const destinations = response?.data?.length ? response.data : [];

  return (
    <div className="container max-w-6xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Destinations</h1>
        {isAdmin && (
          <Button
            onClick={() => navigate({ to: "/destination/create" })}
            className="gap-1.5"
          >
            <Plus className="size-4" />
            New Destination
          </Button>
        )}
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
          Failed to load destinations.
          <Button variant="link" onClick={() => refetch()} className="ml-2">
            Retry
          </Button>
        </div>
      ) : destinations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
          <p>No destinations yet. Add your first one!</p>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/destination/create" })}
          >
            Create your first destination
          </Button>
        </div>
      ) : (
        <div className="space-y-4 min-h-101 flex flex-col justify-between">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-50">Name</TableHead>
                  <TableHead className="w-50">Location</TableHead>
                  <TableHead className="w-25">Rating</TableHead>
                  <TableHead className="w-62.5">Categories</TableHead>
                  <TableHead className="w-30 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {destinations.map((destination) => (
                  <TableRow key={uniqueKey(`destination-${destination.id}`)}>
                    <TableCell className="font-medium text-left">
                      {destination.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-3.5 shrink-0" />
                        <span>
                          {destination.city}, {destination.country}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="flex items-center gap-1">
                        <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{destination.rating.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {destination.categories.map((category) => (
                          <Badge
                            key={uniqueKey(`cat-${category.id}`)}
                            variant="secondary"
                            className="text-xs"
                          >
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            navigate({
                              to: "/destination/$destinationId",
                              params: { destinationId: destination.id },
                            })
                          }
                        >
                          <Eye className="size-3.5" />
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              navigate({
                                to: "/destination/update",
                                search: { id: destination.id },
                              })
                            }
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                        )}
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
                to: "/destination/manage",
                search: { page: newPage },
              })
            }
          />
        </div>
      )}
    </div>
  );
}

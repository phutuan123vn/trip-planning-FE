import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useTripDetail } from "@/features/trip/hooks/use-trips";
import { uniqueKey } from "@/lib/utils";
import {
  CalendarDays,
  Clock,
  MapPin,
  Navigation,
  Star,
} from "lucide-react";

const DEFAULT_IMAGE = "https://placehold.co/400x250?text=No+Image";

interface TripDetailsProps {
  tripId: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function tripDuration(start: string, end: string) {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

const MOCK_TRIP = {
  id: "1",
  name: "Summer in Europe",
  startDate: "2026-07-01",
  endDate: "2026-07-21",
  destinations: [
    {
      id: "1",
      name: "Oia Sunset Point",
      city: "Santorini",
      country: "Greece",
      rating: 4.9,
      images: ["https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600"],
      description: "Watch the world-famous sunset over the caldera from the picturesque village of Oia.",
      categories: [{ id: "c1", name: "Beach" }, { id: "c2", name: "Cultural" }],
      latitude: 36.4,
      longitude: 25.3,
    },
    {
      id: "2",
      name: "Positano Village",
      city: "Amalfi Coast",
      country: "Italy",
      rating: 4.8,
      images: ["https://images.unsplash.com/photo-1612698093158-e07ac200d44e?w=600"],
      description: "A stunning cliffside village on Italy's Amalfi Coast with colorful houses cascading down to the sea.",
      categories: [{ id: "c1", name: "Beach" }, { id: "c3", name: "City" }],
      latitude: 40.6,
      longitude: 14.4,
    },
    {
      id: "3",
      name: "Eiffel Tower",
      city: "Paris",
      country: "France",
      rating: 4.7,
      images: ["https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600"],
      description: "The iconic iron lattice tower on the Champ de Mars, symbol of Paris and French culture.",
      categories: [{ id: "c3", name: "City" }, { id: "c2", name: "Cultural" }],
      latitude: 48.8,
      longitude: 2.3,
    },
  ],
};

export function TripDetails({ tripId }: TripDetailsProps) {
  const { data: response, isPending, isError } = useTripDetail(tripId);

  if (isPending) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={uniqueKey(`skel-${i}`)} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const trip = response?.data ?? MOCK_TRIP;

  if (isError || (!response?.data && !MOCK_TRIP)) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        Trip not found.
      </div>
    );
  }

  const days = tripDuration(trip.startDate, trip.endDate);
  const countries = [...new Set(trip.destinations.map((d) => d.country))];

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {/* Trip header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">{trip.name}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            <span>
              {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-4" />
            <span>{days} days</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="size-4" />
            <span>
              {trip.destinations.length}{" "}
              {trip.destinations.length === 1 ? "stop" : "stops"}
            </span>
          </div>
        </div>

        {/* Country badges */}
        <div className="flex flex-wrap gap-2">
          {countries.map((country) => (
            <Badge key={uniqueKey(`country-${country}`)} variant="outline">
              <Navigation className="size-3 mr-1" />
              {country}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Itinerary timeline */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Itinerary</h2>
        <p className="text-sm text-muted-foreground">
          Here's everywhere you'll be visiting on this trip.
        </p>

        <div className="relative space-y-6 pl-8 before:absolute before:left-3 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
          {trip.destinations.map((destination, index) => (
            <div
              key={uniqueKey(`dest-${destination.id}`)}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute -left-8 top-0 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {index + 1}
              </div>

              <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-48 shrink-0">
                    <img
                      src={
                        destination.images.length > 0
                          ? destination.images[0]
                          : DEFAULT_IMAGE
                      }
                      alt={destination.name}
                      className="h-48 w-full object-cover sm:h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                      }}
                    />
                  </div>

                  {/* Content */}
                  <CardContent className="flex-1 p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold leading-snug">
                        {destination.name}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0 text-amber-500">
                        <Star className="size-4 fill-amber-500" />
                        <span className="text-sm font-medium text-foreground">
                          {destination.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" />
                      <span>
                        {destination.city}, {destination.country}
                      </span>
                    </div>

                    {destination.description && (
                      <p className="text-sm text-foreground/80 line-clamp-2">
                        {destination.description}
                      </p>
                    )}

                    {destination.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {destination.categories.map((cat) => (
                          <Badge
                            key={uniqueKey(`cat-${cat.id}`)}
                            variant="secondary"
                            className="text-xs"
                          >
                            {cat.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Summary footer */}
      {trip.destinations.length > 0 && (
        <>
          <Separator />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <SummaryCard
              label="Total Stops"
              value={trip.destinations.length.toString()}
            />
            <SummaryCard label="Duration" value={`${days} days`} />
            <SummaryCard
              label="Countries"
              value={countries.length.toString()}
            />
            <SummaryCard
              label="Avg. Rating"
              value={
                (
                  trip.destinations.reduce((s, d) => s + d.rating, 0) /
                  trip.destinations.length
                ).toFixed(1)
              }
            />
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4 text-center space-y-1">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useDestinationDetail } from "@/features/destinations";
import { renderImageUrl, uniqueKey } from "@/lib/utils";
import type { ImageResponse } from "@/types/Image";
import {
  Clock3,
  Compass,
  File,
  MapPin,
  Sparkles,
  Star,
  Ticket,
} from "lucide-react";

const DEFAULT_IMAGE: ImageResponse = {
  id: "00000000-0000-0000-0000-000000000000",
  url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
  fileName: "default.jpg",
};

interface DestinationDetailsProps {
  destinationId: string;
}

export function DestinationDetails({ destinationId }: DestinationDetailsProps) {
  const {
    data: response,
    isPending,
    isError,
  } = useDestinationDetail(destinationId);

  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <Skeleton className="h-72 w-full rounded-2xl lg:h-108" />
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !response) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        Destination not found.
      </div>
    );
  }

  const destination = response;
  const displayImages =
    destination.images.length > 0 ? destination.images : [DEFAULT_IMAGE];
  const hasMultiple = displayImages.length > 1;
  const isPaidDestination = destination.destinationType === "PAID";
  const typeLabel =
    destination.destinationType === "FREE"
      ? "Free entry"
      : destination.destinationType === "PAID"
        ? "Ticket required"
        : "Type unavailable";
  const feeLabel = isPaidDestination
    ? `$${destination.price.toFixed(2)}`
    : "No entry fee";
  const coordinatesLabel = `${destination.latitude.toFixed(5)}, ${destination.longitude.toFixed(5)}`;
  const googleMapsUrl = `https://www.google.com/maps?q=${destination.latitude},${destination.longitude}`;
  const visitingHours =
    destination.openingHour && destination.closingHour
      ? `${destination.openingHour} - ${destination.closingHour}`
      : "Hours unavailable";

  return (
    <div className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top_left,oklch(0.97_0.05_210)_0%,transparent_50%),radial-gradient(circle_at_top_right,oklch(0.95_0.04_140)_0%,transparent_55%)]" />

      <div className="mx-auto w-full max-w-6xl px-4 py-6 text-left sm:px-6 lg:px-8 lg:py-10">
        <section className="grid items-start gap-6 lg:grid-cols-[1.65fr_1fr] lg:gap-8">
          <div className="space-y-4">
            <Carousel className="w-full rounded-2xl border border-border/60 bg-card/70 p-2 shadow-sm backdrop-blur-sm">
              <CarouselContent className="ml-0">
                {displayImages.map((src, index) => (
                  <CarouselItem
                    key={uniqueKey(`detail-img-${index}`)}
                    className="pl-0"
                  >
                    <img
                      src={`${renderImageUrl(src.url)}?w=1200`}
                      alt={`${destination.name} - image ${index + 1}`}
                      className="h-72 w-full rounded-xl object-cover sm:h-96 lg:h-108"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `${DEFAULT_IMAGE.url}?w=1200`;
                      }}
                      loading="lazy"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-background/90 backdrop-blur-sm" />
              <CarouselNext className="right-4 bg-background/90 backdrop-blur-sm" />
            </Carousel>

            {destination.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {destination.categories.map((cat) => (
                  <Badge
                    key={uniqueKey(`cat-${cat.id}`)}
                    className="rounded-full border border-foreground/15 bg-background/90 px-3 py-1 text-xs font-medium text-foreground"
                    variant="secondary"
                  >
                    {cat.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-border/70 bg-card/90 p-5 shadow-sm backdrop-blur-sm lg:sticky lg:top-24 lg:p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-amber-500" />
              Curated destination profile
            </div>

            <div className="mt-4 flex items-start justify-between gap-3">
              <h1 className="m-0! text-3xl! font-semibold! leading-tight! tracking-tight! text-foreground! sm:text-4xl!">
                {destination.name}
              </h1>
              <div className="flex shrink-0 items-center gap-1 rounded-full border border-amber-300/40 bg-amber-100/55 px-2.5 py-1 text-amber-700 dark:bg-amber-300/15 dark:text-amber-300">
                <Star className="size-4 fill-current" />
                <span className="text-sm font-semibold">
                  {destination.rating.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              <span>
                {destination.city}, {destination.country}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-border/70 bg-background/80 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock3 className="size-4" />
                  Visiting hours
                </div>
                <span className="text-sm font-medium text-foreground">
                  {visitingHours}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/70 bg-background/80 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Ticket className="size-4" />
                  Entry
                </div>
                <span className="text-sm font-medium text-foreground">
                  {typeLabel}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/70 bg-background/80 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Compass className="size-4" />
                  Estimated fee
                </div>
                <span className="text-sm font-medium text-foreground">
                  {feeLabel}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-dashed border-border/70 bg-muted/25 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Coordinates
              </p>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex text-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                aria-label={`Open ${destination.name} location on Google Maps`}
              >
                Open in Google Maps ({coordinatesLabel})
              </a>
            </div>
          </aside>
        </section>

        {destination.description && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-border/70 shadow-sm">
            <div className="flex items-center gap-3 border-b border-border/60 bg-muted/30 px-6 py-4 sm:px-8">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <File className="size-4" />
              </div>
              <h2 className="text-sm! font-semibold! tracking-wide! text-foreground! uppercase">
                About this destination
              </h2>
            </div>
            <div className="bg-card/70 px-6 py-6 backdrop-blur-sm sm:px-8 sm:py-7">
              <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/75">
                {destination.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

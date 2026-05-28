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
import { uniqueKey } from "@/lib/utils";
import { MapPin, Star } from "lucide-react";

const DEFAULT_IMAGE = "https://placehold.co/800x500?text=No+Image";

interface DestinationDetailsProps {
  destinationId: string;
}

export function DestinationDetails({ destinationId }: DestinationDetailsProps) {
  const { data: response, isPending, isError } = useDestinationDetail(destinationId);

  if (isPending) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 p-4">
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        Destination not found.
      </div>
    );
  }

  const destination = response.data;
  const displayImages =
    destination.images.length > 0 ? destination.images : [DEFAULT_IMAGE];
  const hasMultiple = displayImages.length > 1;

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      {/* Image carousel */}
      <Carousel className="w-full">
        <CarouselContent className="ml-0">
          {displayImages.map((src, index) => (
            <CarouselItem key={uniqueKey(`detail-img-${index}`)} className="pl-0">
              <img
                src={src}
                alt={`${destination.name} - image ${index + 1}`}
                className="h-72 w-full object-cover rounded-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {hasMultiple && (
          <>
            <CarouselPrevious className="left-3" />
            <CarouselNext className="right-3" />
          </>
        )}
      </Carousel>

      {/* Name + rating */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold leading-snug">{destination.name}</h1>
        <div className="flex items-center gap-1 shrink-0 text-amber-500 mt-1">
          <Star className="size-5 fill-amber-500" />
          <span className="text-lg font-medium text-foreground">
            {destination.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <MapPin className="size-4 shrink-0" />
        <span className="text-sm">
          {destination.city}, {destination.country}
        </span>
      </div>

      {/* Categories */}
      {destination.categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {destination.categories.map((cat) => (
            <Badge key={uniqueKey(`cat-${cat.id}`)} variant="secondary">
              {cat.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Description */}
      {destination.description && (
        <p className="text-sm leading-relaxed text-foreground/80">
          {destination.description}
        </p>
      )}
    </div>
  );
}

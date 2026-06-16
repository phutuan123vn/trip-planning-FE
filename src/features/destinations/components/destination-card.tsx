import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { uniqueKey } from "@/lib/utils";
import { type ImageResponse } from "@/types/Image";
import { MapPin, Star } from "lucide-react";
import type { DestinationDetails } from "../types/destination";
import type { HTMLProps } from "react";
import type React from "react";

// const DEFAULT_IMAGE = "https://placehold.co/600x600?text=No+Image";

const DEFAULT_IMAGE: ImageResponse = {
  id: "00000000-0000-0000-0000-000000000000",
  url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
  fileName: "default.jpg",
};

type DestinationCardProps = Pick<
  DestinationDetails,
  "name" | "images" | "city" | "country" | "rating" | "categories"
> & React.ComponentPropsWithoutRef<"div">;

export function DestinationCard({
  name,
  images,
  city,
  country,
  rating,
  categories,
  ...props
}: DestinationCardProps) {
  const displayImages = images.length > 0 ? images : [DEFAULT_IMAGE];
  const hasMultiple = displayImages.length > 1;

  return (
    <Card className="overflow-hidden gap-0 pt-0 " {...props}>
      <Carousel className="w-full" onClick={(e) => e.stopPropagation()}>
        <CarouselContent className="ml-0">
          {displayImages.map((src, index) => (
            <CarouselItem key={uniqueKey(`image-${index}`)} className="pl-0">
              <img
                src={`${src.url}?w=600`}
                alt={`${name} - image ${index + 1}`}
                className="w-full aspect-video object-cover rounded-t-xl h-48"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `${DEFAULT_IMAGE.url}?600`;
                }}
                loading="lazy"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {hasMultiple && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>
      <CardContent className="pt-3 pb-4 space-y-2">
        {/* Name + rating */}
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-sm leading-snug line-clamp-2">
            {name}
          </p>
          <div className="flex items-center gap-0.5 shrink-0 text-amber-500">
            <Star className="size-3.5 fill-amber-500" />
            <span className="text-xs font-medium text-foreground">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
        {/* City, Country */}
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="size-3 shrink-0" />
          <span className="text-xs">
            {city}, {country}
          </span>
        </div>
        {/* Category tags */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {categories.slice(0, 3).map((cat) => (
              <Badge key={uniqueKey(`category-${cat.id}`)} variant="secondary">
                {cat.name}
              </Badge>
            ))}
            {categories.length > 3 && (
              <Badge key={uniqueKey(`category-more`)} variant="outline">
                +{categories.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

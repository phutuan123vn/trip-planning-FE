import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Destination } from "../types/destination";
import { MapPin, Star } from "lucide-react";
import { uniqueKey } from "@/lib/utils";

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=No+Image";

type DestinationCardProps = Pick<Destination, "name" | "images" | "city" | "country" | "rating" | "categories">;

export function DestinationCard({ name, images, city, country, rating, categories }: DestinationCardProps) {
    const displayImages = images.length > 0 ? images.slice(0, 3) : [DEFAULT_IMAGE];
    const hasMultiple = displayImages.length > 1;

    return (
        <Card className="overflow-hidden gap-0">
            <Carousel className="w-full">
                <CarouselContent className="ml-0">
                    {displayImages.map((src, index) => (
                        <CarouselItem key={uniqueKey(`image-${index}`)} className="pl-0">
                            <img
                                src={src}
                                alt={`${name} - image ${index + 1}`}
                                className="h-48 w-full object-cover rounded-t-xl"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                                }}
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
                    <p className="font-medium text-sm leading-snug line-clamp-2">{name}</p>
                    <div className="flex items-center gap-0.5 shrink-0 text-amber-500">
                        <Star className="size-3.5 fill-amber-500" />
                        <span className="text-xs font-medium text-foreground">{rating.toFixed(1)}</span>
                    </div>
                </div>
                {/* City, Country */}
                <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="size-3 shrink-0" />
                    <span className="text-xs">{city}, {country}</span>
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
                            <Badge key={uniqueKey(`category-more`)} variant="outline">+{categories.length - 3}</Badge>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

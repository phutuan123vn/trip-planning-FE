import { Button } from "@/components/ui/button";
import { ImageUploadDialog } from "@/components/ui/image-upload-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useDestinationDetail, useUpdateDestination } from "@/features/destinations/hooks/use-destinations";
import { destinationCreateSchema, type DestinationCreateInput } from "@/features/destinations/schemas/destination-create-schema";
import { deleteImage } from "@/lib/api/image-api";
import { renderImageUrl } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface DestinationUpdateProps {
  destinationId: string;
}

export function DestinationUpdate({ destinationId }: DestinationUpdateProps) {
  const navigate = useNavigate();
  const { data: destination, isPending: destinationPending } = useDestinationDetail(destinationId);
  const { mutate: updateDestination, isPending: isSubmitting } = useUpdateDestination();
  const { data: categoriesResponse, isPending: categoriesPending } = useCategories({
    page: 1,
    pageSize: 100,
    filters: {},
  });

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [imagesList, setImagesList] = useState<Array<{ id: string; url: string }>>([]);

  const form = useForm<DestinationCreateInput>({
    resolver: zodResolver(destinationCreateSchema),
    defaultValues: {
      name: "",
      city: "",
      country: "",
      description: "",
      rating: "",
      latitude: "",
      longitude: "",
      imageIds: [],
      categoryIds: [],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    watch,
  } = form;

  const imageIds = watch("imageIds");

  // Populate form when destination data loads
  useEffect(() => {
    if (destination) {
      const images = destination.images || [];
      setImagesList(images.map(img => ({ id: img.id, url: img.url })));
      
      reset({
        name: destination.name,
        city: destination.city,
        country: destination.country,
        description: destination.description,
        rating: destination.rating.toString(),
        latitude: destination.latitude.toString(),
        longitude: destination.longitude.toString(),
        imageIds: images.map(img => img.id),
        categoryIds: destination.categories?.map(c => c.id) || [],
      });
    }
  }, [destination, reset]);

  function onSubmit(data: DestinationCreateInput) {
    updateDestination(
      { id: destinationId, dto: data },
      {
        onSuccess: () => {
          toast.success("Destination updated successfully!");
          navigate({ to: "/destination/manage" });
        },
        onError: (error) => {
          toast.error("Failed to update destination. Please try again.");
          console.error("Update destination error:", error);
        },
      }
    );
  }

  function handleUploadSuccess(imageId: string, imageUrl: string) {
    setImagesList(prev => [...prev, { id: imageId, url: imageUrl }]);
    setValue("imageIds", [...imageIds, imageId]);
  }

  function handleRemoveImage(imageId: string) {
    setImagesList(prev => prev.filter(img => img.id !== imageId));
    setValue("imageIds", imageIds.filter(id => id !== imageId));
    
    deleteImage(imageId).catch(err => {
      console.error("Failed to delete image:", err);
      toast.error("Image removed from destination but failed to delete from server");
    });
  }

  if (destinationPending) {
    return (
      <div className="container max-w-2xl mx-auto space-y-6 p-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  const allCategories = categoriesResponse?.data || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Update Destination</h1>

      {/* Basic info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="e.g. Santorini"
            {...register("name")}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rating">Rating (0–5)</Label>
          <Input
            id="rating"
            type="number"
            placeholder="4.5"
            min={0}
            max={5}
            step={0.1}
            {...register("rating")}
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-invalid={!!errors.rating}
          />
          {errors.rating && <p className="text-xs text-destructive">{errors.rating.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="e.g. Oia"
            {...register("city")}
            aria-invalid={!!errors.city}
          />
          {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            placeholder="e.g. Greece"
            {...register("country")}
            aria-invalid={!!errors.country}
          />
          {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe this destination…"
          {...register("description")}
          className="h-auto w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
        />
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            placeholder="36.4618"
            step="any"
            {...register("latitude")}
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            placeholder="25.3753"
            step="any"
            {...register("longitude")}
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label>Images</Label>
        
        {/* Display existing images */}
        {imagesList.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {imagesList.map((image) => (
              <div
                key={image.id}
                className="relative group rounded-lg border overflow-hidden bg-muted aspect-video"
              >
                <img
                  src={renderImageUrl(image.url)}
                  alt="Destination"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 size-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveImage(image.id)}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add image button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setUploadDialogOpen(true)}
          className="gap-1"
        >
          <Plus className="size-3.5" />
          Add image
        </Button>
        
        {imagesList.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No images yet. Click "Add image" to upload.
          </p>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-1.5">
        <Label>Categories</Label>
        <Controller
          name="categoryIds"
          control={control}
          render={({ field }) => (
            <MultiSelect
              options={allCategories.map((c) => ({ value: c.id, label: c.name }))}
              value={field.value}
              onChange={field.onChange}
              placeholder="Select categories…"
              isLoading={categoriesPending}
            />
          )}
        />
        {errors.categoryIds && (
          <p className="text-xs text-destructive">{errors.categoryIds.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/destination/manage" })}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Updating…" : "Update Destination"}
        </Button>
      </div>

      {/* Upload Dialog */}
      <ImageUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadSuccess={handleUploadSuccess}
      />
    </form>
  );
}

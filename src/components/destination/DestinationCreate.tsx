import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/multi-select";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useDestinationCreateStore } from "@/features/destinations/stores/destination-create-store";
import type { DestinationCreateInput } from "@/features/destinations/schemas/destination-create-schema";
import { uniqueKey } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import React, { useEffect } from "react";

interface DestinationCreateProps {
  onSubmit?: (data: DestinationCreateInput) => void;
  isSubmitting?: boolean;
}

const MOCK_CATEGORIES = [
  { id: "c1", name: "Beach" },
  { id: "c2", name: "Mountain" },
  { id: "c3", name: "City" },
  { id: "c4", name: "Countryside" },
  { id: "c5", name: "Cultural" },
  { id: "c6", name: "Nature" },
  { id: "c7", name: "Adventure" },
  { id: "c8", name: "Historical" },
];

export function DestinationCreate({
  onSubmit,
  isSubmitting = false,
}: DestinationCreateProps) {
  const { values: form, errors, setField, validate, reset } =
    useDestinationCreateStore();
  const { data: categoriesResponse, isPending: categoriesPending } = useCategories();
  const allCategories = categoriesResponse?.data?.length
    ? categoriesResponse.data
    : MOCK_CATEGORIES;

  useEffect(() => {
    reset();
    return () => reset();
  }, []);

  function handleImageChange(index: number, value: string) {
    const updated = form.images.map((img, i) => (i === index ? value : img));
    setField("images", updated);
  }

  function addImage() {
    setField("images", [...form.images, ""]);
  }

  function removeImage(index: number) {
    setField("images", form.images.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSubmit?.(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-6 p-4"
    >
      <h1 className="text-2xl font-semibold">Add Destination</h1>

      {/* Basic info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="e.g. Santorini"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
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
            value={form.rating}
            onChange={(e) => setField("rating", e.target.value)}
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-invalid={!!errors.rating}
          />
          {errors.rating && <p className="text-xs text-destructive">{errors.rating}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="e.g. Oia"
            value={form.city}
            onChange={(e) => setField("city", e.target.value)}
            aria-invalid={!!errors.city}
          />
          {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            placeholder="e.g. Greece"
            value={form.country}
            onChange={(e) => setField("country", e.target.value)}
            aria-invalid={!!errors.country}
          />
          {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe this destination…"
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
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
            value={form.latitude}
            onChange={(e) => setField("latitude", e.target.value)}
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
            value={form.longitude}
            onChange={(e) => setField("longitude", e.target.value)}
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label>Images (URLs)</Label>
        {form.images.map((url, index) => (
          <div key={uniqueKey(`img-field-${index}`)} className="flex gap-2">
            <Input
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={(e) => handleImageChange(index, e.target.value)}
            />
            {form.images.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeImage(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addImage}
          className="gap-1"
        >
          <Plus className="size-3.5" />
          Add image
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-1.5">
        <Label>Categories</Label>
        <MultiSelect
          options={allCategories.map((c) => ({ value: c.id, label: c.name }))}
          value={form.categoryIds}
          onChange={(ids) => setField("categoryIds", ids)}
          placeholder="Select categories…"
          isLoading={categoriesPending}
        />
        {errors.categoryIds && (
          <p className="text-xs text-destructive">{errors.categoryIds}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving…" : "Create Destination"}
      </Button>
    </form>
  );
}

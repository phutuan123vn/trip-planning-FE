import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategoryDetail, useUpdateCategory } from "@/features/categories/hooks/use-categories";
import { UpdateCategorySchema, type UpdateCategoryDto } from "@/features/categories/schemas/category-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CategoryUpdateProps {
  categoryId: string;
}

export function CategoryUpdate({ categoryId }: CategoryUpdateProps) {
  const navigate = useNavigate();
  const { data: category, isPending: categoryPending } = useCategoryDetail(categoryId);
  const { mutate: updateCategory, isPending: isSubmitting } = useUpdateCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateCategoryDto>({
    resolver: zodResolver(UpdateCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  // Populate form when category data loads
  useEffect(() => {
    if (category) {
      reset({ name: category.name });
    }
  }, [category, reset]);

  function onSubmit(data: UpdateCategoryDto) {
    updateCategory(
      { id: categoryId, dto: data },
      {
        onSuccess: () => {
          toast.success("Category updated successfully!");
          navigate({ to: "/category/manage" });
        },
        onError: (error) => {
          toast.error("Failed to update category. Please try again.");
          console.error("Update category error:", error);
        },
      }
    );
  }

  if (categoryPending) {
    return (
      <div className="container max-w-2xl mx-auto space-y-6 p-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Update Category</h1>

      {/* Category name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          placeholder="e.g. Museums, Parks, Restaurants"
          {...register("name")}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/category/manage" })}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Updating…" : "Update Category"}
        </Button>
      </div>
    </form>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCategory } from "@/features/categories/hooks/use-categories";
import { CreateCategorySchema, type CreateCategoryDto } from "@/features/categories/schemas/category-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CategoryCreate() {
  const navigate = useNavigate();
  const { mutate: createCategory, isPending } = useCreateCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategoryDto>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(data: CreateCategoryDto) {
    createCategory(data, {
      onSuccess: () => {
        toast.success("Category created successfully!");
        navigate({ to: "/category/manage" });
      },
      onError: (error) => {
        toast.error("Failed to create category. Please try again.");
        console.error("Create category error:", error);
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Create Category</h1>

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
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "Creating…" : "Create Category"}
        </Button>
      </div>
    </form>
  );
}

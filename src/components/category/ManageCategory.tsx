import { DataPagination } from "@/components/DataPagination";
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
import { useCategories, useDeleteCategory } from "@/features/categories/hooks/use-categories";
import { uniqueKey } from "@/lib/utils";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const PAGE_SIZE = 5;

export function ManageCategories() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/category/manage" });
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
  } = useCategories(paginationParams);

  const { mutate: deleteCategory } = useDeleteCategory();

  function handleDelete(categoryId: string) {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory(categoryId, {
        onSuccess: () => {
          toast.success("Category deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete category");
        },
      });
    }
  }

  const categories = response?.data?.length ? response.data : [];

  return (
    <div className="container max-w-5xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Categories</h1>
        {isAdmin && (
          <Button
            onClick={() => navigate({ to: "/category/create" })}
            className="gap-1.5"
          >
            <Plus className="size-4" />
            New Category
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
          Failed to load categories.
          <Button variant="link" onClick={() => refetch()} className="ml-2">
            Retry
          </Button>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
          <p>No categories yet. Create your first one!</p>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/category/create" })}
          >
            Create your first category
          </Button>
        </div>
      ) : (
        <div className="space-y-4 min-h-101 flex flex-col justify-between">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-100">Category Name</TableHead>
                  {isAdmin && (
                    <TableHead className="w-30 text-right">
                      Actions
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={uniqueKey(`category-${category.id}`)}>
                    <TableCell className="font-medium text-left">
                      {category.name}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              navigate({
                                to: "/category/update",
                                search: { id: category.id },
                              })
                            }
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(category.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
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
                to: "/category/manage",
                search: { page: newPage },
              })
            }
          />
        </div>
      )}
    </div>
  );
}

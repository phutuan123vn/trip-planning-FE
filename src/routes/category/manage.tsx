import { ManageCategories } from "@/components/category/ManageCategory";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const SearchSchema = z.object({
  page: z.number().optional(),
});

export const Route = createFileRoute("/category/manage")({
  component: RouteComponent,
  validateSearch: SearchSchema,
});

function RouteComponent() {
  return <ManageCategories />;
}

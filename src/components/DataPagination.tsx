import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { uniqueKey } from "@/lib/utils";
import type { Pagination as PaginationData } from "@/types/Response";

interface DataPaginationProps {
  page: number;
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

function getPaginationRange(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const range: (number | "ellipsis")[] = [1];
  if (current > 3) range.push("ellipsis");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    range.push(i);
  }
  if (current < total - 2) range.push("ellipsis");
  range.push(total);
  return range;
}

export function DataPagination({ page, pagination, onPageChange }: DataPaginationProps) {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);
  const range = getPaginationRange(page, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, page - 1))}
            aria-disabled={!pagination.hasPrevious}
            className={!pagination.hasPrevious ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
        {range.map((item, i) =>
          item === "ellipsis" ? (
            <PaginationItem key={uniqueKey(`ellipsis-${i}`)}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={uniqueKey(`page-${item}`)}>
              <PaginationLink
                isActive={item === page}
                onClick={() => onPageChange(item)}
                className="cursor-pointer"
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            aria-disabled={!pagination.hasNext}
            className={!pagination.hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

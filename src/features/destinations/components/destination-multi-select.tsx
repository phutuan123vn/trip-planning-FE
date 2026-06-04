import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "@/hooks/use-debounce";
import { cn, uniqueKey } from "@/lib/utils";
import { ChevronDown, Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useInfiniteDestinations } from "../hooks/use-infinite-destinations";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DestinationMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxDisplay?: number;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DestinationMultiSelect({
  value,
  onChange,
  placeholder = "Select destinations…",
  maxDisplay = 3,
  className,
}: DestinationMultiSelectProps) {

  // ── State ──────────────────────────────────────────────────────────────────

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // ── Refs ───────────────────────────────────────────────────────────────────

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasNextPageRef = useRef(false);
  const isFetchingNextPageRef = useRef(false);

  // ── Search / debounce ──────────────────────────────────────────────────────

  const updateDebouncedSearch = useDebounce((val: string) => setDebouncedSearch(val), 500);

  const filters = useMemo(
    () => (debouncedSearch ? { name__ilike: [debouncedSearch] } : undefined),
    [debouncedSearch]
  );

  // ── Data fetching ──────────────────────────────────────────────────────────

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteDestinations(filters);

  hasNextPageRef.current = !!hasNextPage;
  isFetchingNextPageRef.current = isFetchingNextPage;

  const destinations = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data]
  );

  // ── Derived values ─────────────────────────────────────────────────────────

  const overflow = value.length - maxDisplay;

  const selectedLabels = useMemo(() => {
    const map: Record<string, string> = {};
    for (const d of destinations) {
      if (value.includes(d.id)) map[d.id] = d.name;
    }
    return map;
  }, [destinations, value]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) setSearch("");
  }

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    if (nearBottom && hasNextPageRef.current && !isFetchingNextPageRef.current) {
      fetchNextPage();
    }
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    updateDebouncedSearch(e.target.value);
  }

  // ── Effects ────────────────────────────────────────────────────────────────

  // (no effects needed — scroll-based infinite loading via handleScroll)

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex min-h-8 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            className
          )}
        >
          <span className="flex flex-wrap items-center gap-1 overflow-hidden">
            {value.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {value.slice(0, maxDisplay).map((id) => (
                  <Badge key={uniqueKey(`dst-sel-${id}`)} variant="secondary" className="text-xs">
                    {selectedLabels[id] ?? id}
                  </Badge>
                ))}
                {overflow > 0 && (
                  <Badge key="dst-overflow" variant="outline" className="text-xs">
                    +{overflow}
                  </Badge>
                )}
              </>
            )}
          </span>
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-(--radix-dropdown-menu-trigger-width) p-0"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {/* Search */}
        <div className="flex items-center gap-2 border-b px-2 py-1.5">
          <Search className="size-3.5 shrink-0 text-muted-foreground" />
          <Input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search…"
            className="h-7 border-0 p-0 text-sm shadow-none focus-visible:ring-0"
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>

        {/* List */}
        <div ref={scrollContainerRef} onScroll={handleScroll} className="max-h-56 overflow-y-auto p-1">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Spinner className="size-4" />
            </div>
          ) : destinations.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">
              No destinations found
            </p>
          ) : (
            <>
              {destinations.map((d) => (
                <DropdownMenuCheckboxItem
                  key={uniqueKey(`dst-opt-${d.id}`)}
                  checked={value.includes(d.id)}
                  onCheckedChange={() => toggle(d.id)}
                >
                  {d.name}
                </DropdownMenuCheckboxItem>
              ))}

              {/* Loading indicator */}
              {isFetchingNextPage && (
                <div className="py-1 flex justify-center">
                  <Spinner className="size-4" />
                </div>
              )}
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, uniqueKey } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  isLoading?: boolean;
  maxDisplay?: number;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  isLoading = false,
  maxDisplay = 3,
  className,
}: MultiSelectProps) {
  function toggle(id: string) {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    );
  }

  if (isLoading) {
    return <Skeleton className={cn("h-8 w-full rounded-lg", className)} />;
  }

  const overflow = value.length - maxDisplay;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-8 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            className
          )}
        >
          <span className="flex flex-wrap items-center gap-1 overflow-hidden">
            {value.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {value.slice(0, maxDisplay).map((id) => {
                  const opt = options.find((o) => o.value === id);
                  return opt ? (
                    <Badge key={uniqueKey(`multi-select-${id}`)} variant="secondary" className="text-xs">
                      {opt.label}
                    </Badge>
                  ) : null;
                })}
                {overflow > 0 && (
                  <Badge key={uniqueKey(`multi-select-overflow`)} variant="outline" className="text-xs">
                    +{overflow}
                  </Badge>
                )}
              </>
            )}
          </span>
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((opt) => (
          <DropdownMenuCheckboxItem
            key={uniqueKey(`multi-select-value-${opt.value}`)}
            checked={value.includes(opt.value)}
            onCheckedChange={() => toggle(opt.value)}
            className="data-highlighted:bg-zinc-400"
          >
            {opt.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

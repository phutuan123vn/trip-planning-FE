export type PaginationParams = {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    filters?: Record<string, Array<unknown>>;
}
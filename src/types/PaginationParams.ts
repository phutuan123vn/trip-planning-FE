export type PaginationParams = {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
    filters?: FilterParams;
}


export type FilterParams = Record<string, Array<unknown> | undefined>;
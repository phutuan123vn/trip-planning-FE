export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

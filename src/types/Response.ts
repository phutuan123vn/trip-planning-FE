export type Pagination = {
  page: number;
  pageSize: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
  totalPages: number;
};

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

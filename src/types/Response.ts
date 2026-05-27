export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export interface Response<T> {
  success: boolean;
  data: T[] | null;
  message: string;
  error: string | null;
  pagination: Pagination;
}

export type TResponse = Response<unknown>;

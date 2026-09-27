export interface PaginationQueryDto {
  page?: number;
  limit?: number;
}

export interface PaginatedResultDto<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

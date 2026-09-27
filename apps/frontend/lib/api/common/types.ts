/**
 * Unified API response shapes.
 *
 * NestJS returns either the raw payload or an error body.
 * We normalize everything here.
 */

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginatedMeta;
}

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip attaching the Authorization header (for public endpoints) */
  skipAuth?: boolean;
  /** Skip auto-refresh on 401 */
  skipRefresh?: boolean;
  /** Next.js fetch cache options */
  next?: RequestInit["next"];
  /** Cache strategy shortcut */
  cache?: RequestCache;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

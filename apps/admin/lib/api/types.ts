export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface ApiRequestOptions extends RequestInit {
  body?: any;
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

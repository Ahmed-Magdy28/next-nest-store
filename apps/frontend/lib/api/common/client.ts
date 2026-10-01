import type { ApiError, ApiRequestOptions } from "./types";
import { tokenStorage } from "./token-storage";

export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  if (typeof window !== "undefined") {
    try {
      const parsed = new URL(envUrl);
      if (
        (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1"
      ) {
        return `${parsed.protocol}//${window.location.hostname}:${parsed.port || "3000"}`;
      }
    } catch {
      // fallback
    }
  }

  return envUrl;
}

/**
 * Custom error thrown by the API client.
 * Carries the HTTP status and the parsed response body.
 */
export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly payload: ApiError,
  ) {
    super(ApiClientError.extractMessage(payload, status));
    this.name = "ApiClientError";
  }

  private static extractMessage(payload: ApiError, status: number): string {
    if (Array.isArray(payload.message)) return payload.message.join(", ");
    if (typeof payload.message === "string") return payload.message;
    return `Request failed with status ${status}`;
  }

  /** Convenience helpers for the UI */
  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isValidation() {
    return this.status === 400 || this.status === 422;
  }
}

// ─── Refresh token mutex (prevent parallel refresh storms) ───

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        tokenStorage.clear();
        return null;
      }

      const data = (await res.json()) as {
        accessToken?: string;
        refreshToken: string;
      };

      if (!data.accessToken) {
        tokenStorage.clear();
        return null;
      }

      tokenStorage.setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch {
      tokenStorage.clear();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ─── Core request function ───

async function request<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    body,
    skipAuth = false,
    skipRefresh = false,
    headers: customHeaders,
    ...rest
  } = options;

  const buildHeaders = (token: string | null): HeadersInit => {
    const headers = new Headers(customHeaders);

    // JSON body by default (unless FormData)
    if (body && !(body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    if (token && !skipAuth) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Accept", "application/json");
    return headers;
  };

  const baseUrl = getApiBaseUrl();
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  const send = (token: string | null) =>
    fetch(url, {
      ...rest,
      headers: buildHeaders(token),
      credentials: "include", // send guest cart cookie
      body:
        body instanceof FormData
          ? body
          : body !== undefined
            ? JSON.stringify(body)
            : undefined,
    });

  const token = skipAuth ? null : tokenStorage.getAccessToken();
  let response = await send(token);

  // Auto-refresh on 401 (once)
  if (response.status === 401 && !skipRefresh && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await send(newToken);
    }
  }

  // ─── Handle response ───

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorPayload: ApiError =
      typeof payload === "object" && payload !== null
        ? (payload as ApiError)
        : { statusCode: response.status, message: String(payload) };

    throw new ApiClientError(response.status, errorPayload);
  }

  return payload as T;
}

// ─── Public API ───

export const apiClient = {
  get<T>(path: string, options?: ApiRequestOptions) {
    return request<T>(path, { ...options, method: "GET" });
  },

  post<T>(path: string, body?: unknown, options?: ApiRequestOptions) {
    return request<T>(path, { ...options, method: "POST", body });
  },

  patch<T>(path: string, body?: unknown, options?: ApiRequestOptions) {
    return request<T>(path, { ...options, method: "PATCH", body });
  },

  put<T>(path: string, body?: unknown, options?: ApiRequestOptions) {
    return request<T>(path, { ...options, method: "PUT", body });
  },

  delete<T>(path: string, options?: ApiRequestOptions) {
    return request<T>(path, { ...options, method: "DELETE" });
  },
};

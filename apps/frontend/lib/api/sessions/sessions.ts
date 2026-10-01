import type { SessionSummaryDto } from "@repo/shared/dtos/sessions";
import { apiClient } from "../common/client";

export const sessionsApi = {
  list: () => apiClient.get<SessionSummaryDto[]>("/auth/sessions"),
  revoke: (id: string) => apiClient.delete<void>(`/auth/sessions/${id}`),
  delete: (id: string) =>
    apiClient.delete<void>(`/auth/sessions/${id}?permanent=true`),
  revokeOthers: () => apiClient.delete<void>("/auth/sessions?othersOnly=true"),
  deleteOthers: () =>
    apiClient.delete<void>("/auth/sessions?othersOnly=true&permanent=true"),
  revokeAll: () => apiClient.delete<void>("/auth/sessions"),
};

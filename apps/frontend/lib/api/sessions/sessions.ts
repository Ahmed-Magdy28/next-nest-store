import type { SessionSummaryDto } from "@repo/shared/dtos/sessions";
import { apiClient } from "../common/client";

export const sessionsApi = {
  list: () => apiClient.get<SessionSummaryDto[]>("/auth/sessions"),
  revoke: (id: string) => apiClient.delete<void>(`/auth/sessions/${id}`),
  revokeAll: () => apiClient.delete<void>("/auth/sessions"),
};

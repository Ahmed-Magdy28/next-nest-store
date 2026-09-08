import type { SessionStatus } from "@repo/database";

export interface SessionSummaryDto {
  id: string;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  lastUsedAt: Date | null;
  deviceName: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  isCurrent: boolean;
}

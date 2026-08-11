import type { Session } from "@repo/database";

import type { SessionSummaryDto } from "../dto";

export class SessionMapper {
  static toSummary(
    session: Session,
    currentSessionId?: string,
  ): SessionSummaryDto {
    return {
      id: session.id,
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt,
      lastUsedAt: session.lastUsedAt,
      deviceName: session.deviceName,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      isCurrent: currentSessionId ? session.id === currentSessionId : false,
    };
  }
}

import { UserRole } from "@repo/database";

export interface SessionSummary {
  id: string;
  status: "PENDING" | "ACTIVE" | "REVOKED";
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  revokedAt: string | null;
  lastUsedAt: string | null;
  deviceName: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  isCurrent: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken?: string;
  refreshToken: string;
  session: SessionSummary;
}

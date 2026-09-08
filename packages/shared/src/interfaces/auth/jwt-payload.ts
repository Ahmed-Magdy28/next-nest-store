import type { UserRole } from "@repo/database";

export interface BaseJwtPayload {
  sub: string;
  email: string;
  username: string;
  role: UserRole;
  jti: string;
}

export interface AccessTokenPayload extends BaseJwtPayload {
  type: "access";
  sessionId: string;
}

export interface RefreshTokenPayload extends BaseJwtPayload {
  type: "refresh";
  sessionId: string;
}

export type JwtPayload = AccessTokenPayload | RefreshTokenPayload;

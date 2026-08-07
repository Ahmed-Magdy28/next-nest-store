import type { UserRole } from "@repo/database";

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: UserRole;
  type: "access" | "refresh";
  jti: string;
}

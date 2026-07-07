import { UserRole } from "@repo/database";

export interface JwtUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
}

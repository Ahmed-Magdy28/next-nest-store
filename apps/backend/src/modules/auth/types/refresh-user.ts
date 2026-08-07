import type { JwtUser } from "./jwt-user";

export interface RefreshUser extends JwtUser {
  refreshToken: string;
}

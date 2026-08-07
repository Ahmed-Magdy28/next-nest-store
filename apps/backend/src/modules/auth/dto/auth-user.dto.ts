import { UserRole } from "@repo/database";

export interface AuthUserDto {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

import { UserRole } from "@repo/database";

export interface UserProfileDto {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

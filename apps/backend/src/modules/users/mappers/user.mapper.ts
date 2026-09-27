import type { User } from "@repo/database";
import type { UserProfileDto } from "@repo/shared/dtos/users";

export class UserMapper {
  static toProfileDto(user: User): UserProfileDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

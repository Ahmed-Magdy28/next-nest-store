import type { User } from "@repo/database";

import type { AuthUserDto } from "@repo/shared/dtos/auth";
import type { JwtUser } from "@repo/shared/interfaces";

export class AuthMapper {
  static toAuthUserDto(user: User): AuthUserDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toJwtUser(user: User, sessionId: string): JwtUser {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      sessionId,
    };
  }
}

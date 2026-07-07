import type { User } from "@repo/database";

import type { AuthUserDto } from "../dto";
import type { JwtUser } from "../types";

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

  static toJwtUser(user: User): JwtUser {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }
}

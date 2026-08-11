import type { User } from "@repo/database";

import type { AuthUserDto } from "../dto";
import type { JwtUser } from "../types";
import type { UserProfileDto } from "../../users/dto";

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

  static toUserProfileDto(user: User): UserProfileDto {
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

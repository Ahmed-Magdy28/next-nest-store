import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import type { User } from "@repo/database";

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(user: User): Promise<string> {
    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });
  }
}

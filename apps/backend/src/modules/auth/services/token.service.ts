import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_TYPE,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_TYPE,
} from "../../../common/security";

import { AuthTokensDto, AuthUserDto } from "../dto";
import type { AccessTokenPayload, RefreshTokenPayload } from "../types";

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(user: AuthUserDto, sessionId: string): Promise<string> {
    const payload: Omit<AccessTokenPayload, "jti"> = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      type: ACCESS_TOKEN_TYPE,
      sessionId,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      jwtid: randomUUID(),
    });
  }

  generateRefreshToken(user: AuthUserDto, sessionId: string): Promise<string> {
    const payload: Omit<RefreshTokenPayload, "jti"> = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      type: REFRESH_TOKEN_TYPE,
      sessionId,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      jwtid: randomUUID(),
    });
  }

  async generateAuthTokens(
    user: AuthUserDto,
    sessionId: string,
  ): Promise<AuthTokensDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user, sessionId),
      this.generateRefreshToken(user, sessionId),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}

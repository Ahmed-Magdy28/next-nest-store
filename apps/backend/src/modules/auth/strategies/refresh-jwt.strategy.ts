import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { SessionStatus } from "@repo/database";

import { UsersService } from "../../users/users.service";

import { AuthMapper } from "../mappers/auth.mapper";
import type { JwtPayload, RefreshUser } from "../types";
import { Request } from "express";
import { SessionsService } from "../../sessions/sessions.service";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("jwtSecret"),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload): Promise<RefreshUser> {
    if (payload.type !== "refresh") {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const session = await this.sessionsService.findById(payload.sessionId);

    if (!session) {
      throw new UnauthorizedException();
    }
    if (session.status !== SessionStatus.ACTIVE) {
      throw new UnauthorizedException("Invalid session");
    }
    if (session.revokedAt) {
      throw new UnauthorizedException("Session revoked");
    }

    if (session.expiresAt <= new Date()) {
      throw new UnauthorizedException("Session expired");
    }

    const user = await this.usersService.findById(session.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    return {
      ...AuthMapper.toJwtUser(user, session.id),
      refreshToken,
      sessionId: session.id,
    };
  }
}

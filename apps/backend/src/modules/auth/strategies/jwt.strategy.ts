import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { UsersService } from "../../users/users.service";

import { AuthMapper } from "../mappers/auth.mapper";
import { JwtPayload, JwtUser } from "../types";
import { SessionsService } from "../../sessions/sessions.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: configService.getOrThrow<string>("jwtSecret"),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtUser> {
    if (payload.type !== "access") {
      throw new UnauthorizedException("Invalid token");
    }

    const session = await this.sessionsService.findById(payload.sessionId);

    if (!session) {
      throw new UnauthorizedException("Invalid session");
    }

    if (session.revokedAt) {
      throw new UnauthorizedException("Session revoked");
    }

    if (session.expiresAt <= new Date()) {
      throw new UnauthorizedException("Session expired");
    }

    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return AuthMapper.toJwtUser(user, payload.sessionId);
  }
}

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";

import { UsersModule } from "../users/users.module";

import { PasswordService } from "./services/password.service";
import { TokenService } from "./services/token.service";
import { RefreshJwtStrategy } from "./strategies/refresh-jwt.strategy";
import { ACCESS_TOKEN_EXPIRES_IN } from "../../common/security";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [
    UsersModule,
    SessionsModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>("jwtSecret"),

        signOptions: {
          expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    PasswordService,
    TokenService,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
})
export class AuthModule {}

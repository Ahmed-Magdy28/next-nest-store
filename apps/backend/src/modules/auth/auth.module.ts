import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";

import { UsersModule } from "../users/users.module";

import { PasswordService } from "./services/password.service";
import { TokenService } from "./services/token.service";

@Module({
  imports: [
    UsersModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>("jwtSecret"),

        signOptions: {
          expiresIn: "15m",
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, PasswordService, TokenService, JwtStrategy],
})
export class AuthModule {}

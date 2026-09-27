import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  HttpStatus,
  Headers,
  HttpCode,
  Req,
  UnauthorizedException,
} from "@nestjs/common";

import type { Request } from "express";

import { AuthService } from "./auth.service";

import { UseZodValidation } from "../../common/decorators/use-zod-validation.decorator";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./schemas";
import type {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  AuthResponseDto,
} from "@repo/shared/dtos/auth";

import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public, Swagger } from "../../common/decorators";

import type { JwtUser, RefreshUser } from "@repo/shared/interfaces";
import { RefreshJwtGuard } from "../../common/guards";
import { type SessionSummaryDto } from "@repo/shared/dtos/sessions";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  @Swagger("register")
  @UseZodValidation(registerSchema)
  register(
    @Body() body: RegisterDto,
    @Req() req: Request,
  ): Promise<AuthResponseDto> {
    const userAgent = req.headers["user-agent"] || "Unknown";
    const ipAddress = req.ip || req.socket.remoteAddress || "Unknown";
    return this.authService.register(body, { userAgent, ipAddress });
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @Swagger("login")
  @UseZodValidation(loginSchema)
  login(@Body() body: LoginDto, @Req() req: Request): Promise<AuthResponseDto> {
    const userAgent = req.headers["user-agent"] || "Unknown";
    const ipAddress = req.ip || req.socket.remoteAddress || "Unknown";

    return this.authService.login(body, { userAgent, ipAddress });
  }

  @Public()
  @Post("login-admin")
  @HttpCode(HttpStatus.OK)
  @Swagger("login-admin")
  @UseZodValidation(loginSchema)
  loginAdmin(
    @Body() body: LoginDto,
    @Req() req: Request,
  ): Promise<AuthResponseDto> {
    const userAgent = req.headers["user-agent"] || "Unknown";
    const ipAddress = req.ip || req.socket.remoteAddress || "Unknown";

    return this.authService.login(body, { userAgent, ipAddress });
  }

  @Public()
  @Swagger("register-admin")
  @Post("register-admin")
  @HttpCode(HttpStatus.CREATED)
  @UseZodValidation(registerSchema)
  async registerAdmin(
    @Body() body: RegisterDto,
    @Headers("x-admin-secret") secret: string,
  ): Promise<AuthResponseDto> {
    const expectedSecret = process.env.ADMIN_SECRET;

    if (!expectedSecret || secret !== expectedSecret) {
      throw new UnauthorizedException("Invalid admin secret");
    }

    return this.authService.registerAdmin(body);
  }

  @Get("me")
  @Swagger("me")
  me(@CurrentUser() user: JwtUser): JwtUser {
    return user;
  }

  @Public()
  @Post("refresh")
  @Swagger("refresh")
  @UseGuards(RefreshJwtGuard)
  refresh(@CurrentUser() user: RefreshUser): Promise<AuthResponseDto> {
    return this.authService.refresh(user);
  }

  @Post("logout")
  @Swagger("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@CurrentUser() user: JwtUser): Promise<void> {
    if (!user?.sessionId) {
      throw new UnauthorizedException("No active session");
    }
    return this.authService.logout(user.sessionId);
  }

  @Get("sessions")
  @Swagger("sessions")
  async sessions(@CurrentUser() user: JwtUser): Promise<SessionSummaryDto[]> {
    return this.authService.listSessions(user.id, user.sessionId);
  }

  @Delete("sessions/:id")
  @Swagger("revoke-session")
  @HttpCode(HttpStatus.NO_CONTENT)
  async revokeSession(
    @CurrentUser() user: JwtUser,
    @Param("id") id: string,
  ): Promise<void> {
    await this.authService.revokeSession(user.id, id);
  }

  @Delete("sessions")
  @Swagger("revoke-all-sessions")
  @HttpCode(HttpStatus.NO_CONTENT)
  async revokeAllSessions(@CurrentUser() user: JwtUser): Promise<void> {
    await this.authService.revokeAllSessions(user.id);
  }

  @Public()
  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @UseZodValidation(forgotPasswordSchema)
  @Swagger("forgot-password")
  async forgotPassword(
    @Body() body: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.requestPasswordReset(body.email);

    return {
      message: "If the email exists, a reset link has been sent.",
    };
  }

  @Public()
  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @UseZodValidation(resetPasswordSchema)
  @Swagger("reset-password")
  async resetPassword(
    @Body() body: ResetPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(body.token, body.password);

    return {
      message: "Password reset successful.",
    };
  }
}

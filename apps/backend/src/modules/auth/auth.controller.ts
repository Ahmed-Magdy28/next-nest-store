import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";

import { AuthService } from "./auth.service";

import { registerSchema, type RegisterDto } from "./schemas/register.schema";

import { UseZodValidation } from "../../common/decorators/use-zod-validation.decorator";
import { type LoginDto, loginSchema } from "./schemas";

import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public, Swagger } from "../../common/decorators";

import type { JwtUser, RefreshUser } from "./types";
import { AuthResponseDto } from "./dto";
import { RefreshJwtGuard } from "../../common/guards";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  @Swagger("register")
  @UseZodValidation(registerSchema)
  register(@Body() body: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(body);
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @Swagger("login")
  @UseZodValidation(loginSchema)
  login(@Body() body: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(body);
  }

  @Get("me")
  @Swagger("me")
  me(@CurrentUser() user: JwtUser): JwtUser {
    return user;
  }

  @ApiBearerAuth("refresh-token")
  @Public()
  @Post("refresh")
  @UseGuards(RefreshJwtGuard)
  refresh(@CurrentUser() user: RefreshUser): Promise<AuthResponseDto> {
    return this.authService.refresh(user);
  }

  @ApiBearerAuth("access-token")
  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@CurrentUser() user: JwtUser): Promise<void> {
    return this.authService.logout(user.sessionId);
  }
}

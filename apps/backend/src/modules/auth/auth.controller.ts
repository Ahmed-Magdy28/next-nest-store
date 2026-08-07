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
import { Public } from "../../common/decorators";

import type { JwtUser, RefreshUser } from "./types";
import { AuthResponseDto } from "./dto";
import { RefreshJwtGuard } from "../../common/guards";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  @UseZodValidation(registerSchema)
  register(@Body() body: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(body);
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UseZodValidation(loginSchema)
  login(@Body() body: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(body);
  }

  @Get("me")
  me(@CurrentUser() user: JwtUser): JwtUser {
    return user;
  }

  @Public()
  @Post("refresh")
  @UseGuards(RefreshJwtGuard)
  refresh(@CurrentUser() user: RefreshUser): Promise<AuthResponseDto> {
    return this.authService.refresh(user);
  }
}

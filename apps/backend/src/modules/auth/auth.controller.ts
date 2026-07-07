import { Body, Controller, Post, Get } from "@nestjs/common";

import { AuthService } from "./auth.service";

import { registerSchema, type RegisterDto } from "./schemas/register.schema";

import { UseZodValidation } from "../../common/decorators/use-zod-validation.decorator";
import { type LoginDto, loginSchema } from "./schemas";

import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators";

import type { JwtUser } from "./types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  @UseZodValidation(registerSchema)
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Public()
  @Post("login")
  @UseZodValidation(loginSchema)
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get("me")
  me(@CurrentUser() user: JwtUser) {
    return user;
  }
}

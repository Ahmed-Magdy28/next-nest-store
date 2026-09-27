import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from "@nestjs/common";

import {
  CurrentUser,
  Public,
  Swagger,
  UseZodValidation,
} from "../../common/decorators";

import type { JwtUser } from "@repo/shared/interfaces";

import { UpdateProfileResult, UsersService } from "./users.service";

import {
  changePasswordSchema,
  updateEmailSchema,
  updateMeSchema,
  updateUsernameSchema,
  verifyEmailSchema,
} from "./schemas";

import {
  UpdateUsernameDto,
  UpdateMeDto,
  UpdateEmailDto,
  UserProfileDto,
} from "@repo/shared/dtos/users";
import { VerifyEmailDto, ChangePasswordDto } from "@repo/shared/dtos/auth";
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @Swagger("get-my-profile")
  me(@CurrentUser() user: JwtUser): Promise<UserProfileDto> {
    return this.usersService.getProfile(user.id);
  }

  @Patch("me")
  @Swagger("update-my-profile")
  @UseZodValidation(updateMeSchema)
  updateMe(
    @CurrentUser() user: JwtUser,
    @Body() body: UpdateMeDto,
  ): Promise<UpdateProfileResult> {
    return this.usersService.updateProfile(user.sessionId, body);
  }

  @Patch("me/username")
  @Swagger("update-my-username")
  @UseZodValidation(updateUsernameSchema)
  updateUsername(
    @CurrentUser() user: JwtUser,
    @Body() body: UpdateUsernameDto,
  ): Promise<{ user: UserProfileDto }> {
    return this.usersService.updateUsername(user.sessionId, body.username);
  }

  @Patch("me/email")
  @Swagger("update-my-email")
  @UseZodValidation(updateEmailSchema)
  requestEmailChange(
    @CurrentUser() user: JwtUser,
    @Body() body: UpdateEmailDto,
  ): Promise<UpdateProfileResult> {
    return this.usersService.requestEmailChange(user.sessionId, body.email);
  }

  @Public()
  @Post("me/email/verify")
  @HttpCode(HttpStatus.OK)
  @Swagger("verify-email")
  @UseZodValidation(verifyEmailSchema)
  verifyEmail(@Body() body: VerifyEmailDto): Promise<{ user: UserProfileDto }> {
    return this.usersService.verifyEmailChange(body.token);
  }

  @Patch("me/password")
  @Swagger("change-password")
  @UseZodValidation(changePasswordSchema)
  @HttpCode(HttpStatus.NO_CONTENT)
  changePassword(
    @CurrentUser() user: JwtUser,
    @Body() body: ChangePasswordDto,
  ): Promise<void> {
    return this.usersService.changePassword(user.sessionId, body);
  }
}

import { randomBytes } from "node:crypto";

import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";

import {
  CurrentUser,
  Public,
  Swagger,
  UseZodValidation,
} from "../../common/decorators";
import { sha256 } from "../../common/security";
import { PasswordService } from "../auth/services/password.service";
import { AuthMapper } from "../auth/mappers/auth.mapper";
import type { JwtUser } from "../auth/types";
import { SessionsService } from "../sessions/sessions.service";

import { UsersService } from "./users.service";
import { EMAIL_VERIFICATION_TOKEN_TTL } from "../../common/security";
import {
  changePasswordSchema,
  updateEmailSchema,
  updateMeSchema,
  updateUsernameSchema,
  verifyEmailSchema,
} from "./schemas";
import type {
  ChangePasswordDto,
  UpdateEmailDto,
  UpdateMeDto,
  UpdateUsernameDto,
  VerifyEmailDto,
} from "./schemas";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Get("me")
  @Swagger("get-my-profile")
  me(@CurrentUser() user: JwtUser) {
    return this.getProfile(user.id);
  }

  @Patch("me")
  @UseZodValidation(updateMeSchema)
  @Swagger("update-my-profile")
  async updateMe(
    @CurrentUser() user: JwtUser,
    @Body() body: UpdateMeDto,
  ): Promise<{
    user: ReturnType<typeof AuthMapper.toUserProfileDto>;
    verificationToken?: string;
  }> {
    return this.updateUserProfile(user, body);
  }

  @Patch("me/username")
  @Swagger("update-my-username")
  @UseZodValidation(updateUsernameSchema)
  updateUsername(
    @CurrentUser() user: JwtUser,
    @Body() body: UpdateUsernameDto,
  ): Promise<{ user: ReturnType<typeof AuthMapper.toUserProfileDto> }> {
    return this.updateUsernameOnly(user, body.username);
  }

  @Patch("me/email")
  @Swagger("update-my-email")
  @UseZodValidation(updateEmailSchema)
  requestEmailChange(
    @CurrentUser() user: JwtUser,
    @Body() body: UpdateEmailDto,
  ): Promise<{
    user: ReturnType<typeof AuthMapper.toUserProfileDto>;
    verificationToken?: string;
  }> {
    return this.requestEmailChangeOnly(user, body.email);
  }

  @Public()
  @Post("me/email/verify")
  @Swagger("verify-email")
  @UseZodValidation(verifyEmailSchema)
  verifyEmail(
    @Body() body: VerifyEmailDto,
  ): Promise<{ user: ReturnType<typeof AuthMapper.toUserProfileDto> }> {
    return this.verifyEmailChange(body.token);
  }

  @Patch("me/password")
  @Swagger("change-password")
  @UseZodValidation(changePasswordSchema)
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @CurrentUser() user: JwtUser,
    @Body() body: ChangePasswordDto,
  ): Promise<void> {
    const currentUser = await this.resolveCurrentUser(user);

    const isPasswordValid = await this.passwordService.compare(
      body.currentPassword,
      currentUser.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid current password");
    }

    const newPasswordHash = await this.passwordService.hash(body.newPassword);

    await this.usersService.updatePasswordHash(currentUser.id, newPasswordHash);
    await this.sessionsService.revokeAllByUserId(currentUser.id);
  }

  private async resolveCurrentUser(user: JwtUser) {
    const session = await this.sessionsService.findById(user.sessionId);

    if (!session) {
      throw new UnauthorizedException();
    }

    const currentUser = await this.usersService.findById(session.userId);

    if (!currentUser) {
      throw new UnauthorizedException();
    }

    return currentUser;
  }

  private async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return AuthMapper.toUserProfileDto(user);
  }

  private async updateUsernameOnly(user: JwtUser, username: string) {
    const currentUser = await this.resolveCurrentUser(user);

    if (currentUser.username !== username) {
      const existingUser = await this.usersService.findByUsername(username);

      if (existingUser && existingUser.id !== currentUser.id) {
        throw new ConflictException("Username already exists");
      }
    }

    const updatedUser = await this.usersService.updateById(currentUser.id, {
      username,
    });

    return {
      user: AuthMapper.toUserProfileDto(updatedUser),
    };
  }

  private async requestEmailChangeOnly(user: JwtUser, email: string) {
    const currentUser = await this.resolveCurrentUser(user);

    if (currentUser.email === email) {
      throw new BadRequestException("Email is already current");
    }

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser && existingUser.id !== currentUser.id) {
      throw new ConflictException("Email already exists");
    }

    const verificationToken = randomBytes(32).toString("hex");

    const updatedUser = await this.usersService.updateById(currentUser.id, {
      pendingEmail: email,
      emailVerificationTokenHash: sha256(verificationToken),
      emailVerificationTokenExpiresAt: new Date(
        Date.now() + EMAIL_VERIFICATION_TOKEN_TTL,
      ),
      emailVerificationTokenUsedAt: null,
      isVerified: false,
    });

    return {
      user: AuthMapper.toUserProfileDto(updatedUser),
      ...(process.env.NODE_ENV !== "production" ? { verificationToken } : {}),
    };
  }

  private async updateUserProfile(
    user: JwtUser,
    body: UpdateMeDto,
  ): Promise<{
    user: ReturnType<typeof AuthMapper.toUserProfileDto>;
    verificationToken?: string;
  }> {
    let response: {
      user: ReturnType<typeof AuthMapper.toUserProfileDto>;
      verificationToken?: string;
    } = await this.getProfile(user.id).then((profile) => ({ user: profile }));

    if (body.username) {
      response = await this.updateUsernameOnly(user, body.username);
    }

    if (body.email) {
      response = await this.requestEmailChangeOnly(user, body.email);
    }

    return response;
  }

  private async verifyEmailChange(token: string) {
    const tokenHash = sha256(token);
    const user =
      await this.usersService.findByEmailVerificationTokenHash(tokenHash);

    if (
      !user ||
      !user.emailVerificationTokenHash ||
      !user.emailVerificationTokenExpiresAt ||
      user.emailVerificationTokenUsedAt ||
      user.emailVerificationTokenExpiresAt <= new Date() ||
      !user.pendingEmail
    ) {
      throw new UnauthorizedException("Invalid email verification token");
    }

    const sameEmailUser = await this.usersService.findByEmail(
      user.pendingEmail,
    );

    if (sameEmailUser && sameEmailUser.id !== user.id) {
      throw new ConflictException("Email already exists");
    }

    const updatedUser = await this.usersService.updateById(user.id, {
      email: user.pendingEmail,
      pendingEmail: null,
      emailVerificationTokenHash: null,
      emailVerificationTokenExpiresAt: null,
      emailVerificationTokenUsedAt: new Date(),
      isVerified: true,
    });

    return {
      user: AuthMapper.toUserProfileDto(updatedUser),
    };
  }
}

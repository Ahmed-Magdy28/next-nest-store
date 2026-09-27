import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { randomBytes } from "node:crypto";
import type { Prisma, User } from "@repo/database";

import { UsersRepository } from "./repositories/users.repository";
import { CreateUserInput } from "@repo/shared/interfaces";
import { PasswordService } from "../../common/services/password.service";
import { SessionsService } from "../sessions/sessions.service";
import { UserMapper } from "./mappers/user.mapper";
import { sha256, EMAIL_VERIFICATION_TOKEN_TTL } from "../../common/security";
import type { UpdateMeDto, UserProfileDto } from "@repo/shared/dtos/users";
import type { ChangePasswordDto } from "@repo/shared/dtos/auth";

export interface UpdateProfileResult {
  user: UserProfileDto;
  verificationToken?: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
    private readonly sessionsService: SessionsService,
  ) {}

  // ─────────────────────────────────────────────────────────────
  //  Basic CRUD (للـ AuthService)
  // ─────────────────────────────────────────────────────────────

  create(data: CreateUserInput): Promise<User> {
    return this.usersRepository.create(data);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findByUsername(username);
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  findByPasswordResetTokenHash(tokenHash: string): Promise<User | null> {
    return this.usersRepository.findByPasswordResetTokenHash(tokenHash);
  }

  findByEmailVerificationTokenHash(tokenHash: string): Promise<User | null> {
    return this.usersRepository.findByEmailVerificationTokenHash(tokenHash);
  }

  updateById(userId: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.usersRepository.updateById(userId, data);
  }

  updatePasswordHash(userId: string, passwordHash: string): Promise<User> {
    return this.usersRepository.updatePasswordHash(userId, passwordHash);
  }

  // ─────────────────────────────────────────────────────────────
  //  Profile
  // ─────────────────────────────────────────────────────────────

  async getProfile(userId: string): Promise<UserProfileDto> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new UnauthorizedException();
    return UserMapper.toProfileDto(user);
  }

  async updateProfile(
    sessionId: string,
    body: UpdateMeDto,
  ): Promise<UpdateProfileResult> {
    const currentUser = await this.resolveBySession(sessionId);
    let user = currentUser;
    let verificationToken: string | undefined;

    if (body.username && body.username !== user.username) {
      await this.assertUsernameAvailable(body.username, user.id);
      user = await this.usersRepository.updateById(user.id, {
        username: body.username,
      });
    }

    if (body.email && body.email !== user.email) {
      await this.assertEmailAvailable(body.email, user.id);

      verificationToken = randomBytes(32).toString("hex");
      user = await this.usersRepository.updateById(user.id, {
        pendingEmail: body.email,
        emailVerificationTokenHash: sha256(verificationToken),
        emailVerificationTokenExpiresAt: new Date(
          Date.now() + EMAIL_VERIFICATION_TOKEN_TTL,
        ),
        emailVerificationTokenUsedAt: null,
        isVerified: false,
      });
    }

    return {
      user: UserMapper.toProfileDto(user),
      ...(verificationToken && process.env.NODE_ENV !== "production"
        ? { verificationToken }
        : {}),
    };
  }

  async updateUsername(
    sessionId: string,
    username: string,
  ): Promise<{ user: UserProfileDto }> {
    const currentUser = await this.resolveBySession(sessionId);

    if (currentUser.username !== username) {
      await this.assertUsernameAvailable(username, currentUser.id);
    }

    const user = await this.usersRepository.updateById(currentUser.id, {
      username,
    });

    return { user: UserMapper.toProfileDto(user) };
  }

  async requestEmailChange(
    sessionId: string,
    email: string,
  ): Promise<UpdateProfileResult> {
    const currentUser = await this.resolveBySession(sessionId);

    if (currentUser.email === email) {
      throw new BadRequestException("Email is already current");
    }

    await this.assertEmailAvailable(email, currentUser.id);

    const verificationToken = randomBytes(32).toString("hex");

    const user = await this.usersRepository.updateById(currentUser.id, {
      pendingEmail: email,
      emailVerificationTokenHash: sha256(verificationToken),
      emailVerificationTokenExpiresAt: new Date(
        Date.now() + EMAIL_VERIFICATION_TOKEN_TTL,
      ),
      emailVerificationTokenUsedAt: null,
      isVerified: false,
    });

    return {
      user: UserMapper.toProfileDto(user),
      ...(process.env.NODE_ENV !== "production" ? { verificationToken } : {}),
    };
  }

  // ─────────────────────────────────────────────────────────────
  //  Email verification
  // ─────────────────────────────────────────────────────────────

  async verifyEmailChange(token: string): Promise<{ user: UserProfileDto }> {
    const tokenHash = sha256(token);
    const user =
      await this.usersRepository.findByEmailVerificationTokenHash(tokenHash);

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

    const existing = await this.usersRepository.findByEmail(user.pendingEmail);
    if (existing && existing.id !== user.id) {
      throw new ConflictException("Email already exists");
    }

    const updated = await this.usersRepository.updateById(user.id, {
      email: user.pendingEmail,
      pendingEmail: null,
      emailVerificationTokenHash: null,
      emailVerificationTokenExpiresAt: null,
      emailVerificationTokenUsedAt: new Date(),
      isVerified: true,
    });

    return { user: UserMapper.toProfileDto(updated) };
  }

  // ─────────────────────────────────────────────────────────────
  //  Password
  // ─────────────────────────────────────────────────────────────

  async changePassword(
    sessionId: string,
    body: ChangePasswordDto,
  ): Promise<void> {
    const currentUser = await this.resolveBySession(sessionId);

    const isValid = await this.passwordService.compare(
      body.currentPassword,
      currentUser.passwordHash,
    );
    if (!isValid) {
      throw new UnauthorizedException("Invalid current password");
    }

    const newHash = await this.passwordService.hash(body.newPassword);

    await this.usersRepository.updatePasswordHash(currentUser.id, newHash);
    await this.sessionsService.revokeAllByUserId(currentUser.id);
  }

  // ─────────────────────────────────────────────────────────────
  //  Helpers (private)
  // ─────────────────────────────────────────────────────────────

  private async resolveBySession(sessionId: string): Promise<User> {
    const session = await this.sessionsService.findById(sessionId);
    if (!session) throw new UnauthorizedException();

    const user = await this.usersRepository.findById(session.userId);
    if (!user) throw new UnauthorizedException();

    return user;
  }

  private async assertUsernameAvailable(
    username: string,
    currentUserId: string,
  ): Promise<void> {
    const existing = await this.usersRepository.findByUsername(username);
    if (existing && existing.id !== currentUserId) {
      throw new ConflictException("Username already exists");
    }
  }

  private async assertEmailAvailable(
    email: string,
    currentUserId: string,
  ): Promise<void> {
    const existing = await this.usersRepository.findByEmail(email);
    if (existing && existing.id !== currentUserId) {
      throw new ConflictException("Email already exists");
    }
  }
}

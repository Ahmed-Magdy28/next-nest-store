import {
  ConflictException,
  Injectable,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";

import { type Session, SessionStatus } from "@repo/database";
import { randomBytes } from "node:crypto";

import {
  PASSWORD_RESET_TOKEN_TTL,
  REFRESH_TOKEN_SESSION_TTL,
  sha256,
} from "../../common/security";
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  AuthUserDto,
} from "@repo/shared/dtos/auth";
import { UsersService } from "../users/users.service";
import { PasswordService } from "../../common/services/password.service";
import { AuthMapper } from "./mappers/auth.mapper";
import { TokenService } from "./services/token.service";
import { RefreshUser } from "@repo/shared/interfaces";
import { SessionsService } from "../sessions/sessions.service";

import { SessionMapper } from "../sessions/mappers/session.mapper";
import type { SessionSummaryDto } from "@repo/shared/dtos/sessions";
import {
  MAX_ACTIVE_SESSIONS,
  MAX_REVOKED_SESSIONS,
  MAX_PENDING_SESSIONS,
} from "@repo/shared/constants";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly sessionsService: SessionsService,
  ) {}

  // ─────────────────────────────────────────────────────────────
  //  Session helpers
  // ─────────────────────────────────────────────────────────────

  private async createSession(
    userId: string,
    deviceInfo: { userAgent: string; ipAddress: string },
  ): Promise<Session> {
    // 1. ننضّف الجلسات القديمة الأول
    await this.cleanupSessions(userId);

    // 2. نحسب الحالة
    const activeCount = await this.sessionsService.countActiveByUserId(userId);
    const pendingCount =
      await this.sessionsService.countPendingByUserId(userId);

    let status: SessionStatus;

    if (activeCount < MAX_ACTIVE_SESSIONS) {
      status = SessionStatus.ACTIVE;
    } else if (pendingCount < MAX_PENDING_SESSIONS) {
      status = SessionStatus.PENDING;
    } else {
      throw new ConflictException(
        "Maximum number of sessions reached. Please revoke an existing session first.",
      );
    }

    return this.sessionsService.create({
      userId,
      refreshTokenHash: null,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_SESSION_TTL),
      status,
      userAgent: deviceInfo?.userAgent ?? null,
      ipAddress: deviceInfo?.ipAddress ?? null,
    });
  }

  private async cleanupSessions(userId: string): Promise<void> {
    // نمسح الجلسات الملغية الزيادة
    const revokedCount =
      await this.sessionsService.countRevokedByUserId(userId);
    if (revokedCount >= MAX_REVOKED_SESSIONS) {
      await this.sessionsService.deleteOldestRevoked(
        userId,
        revokedCount - MAX_REVOKED_SESSIONS + 1,
      );
    }

    // نمسح أي جلسات منتهية الصلاحية
    await this.sessionsService.deleteExpiredByUserId(userId);
  }

  private async generateSessionTokens(
    user: AuthUserDto,
    session: Session,
  ): Promise<{
    accessToken?: string;
    refreshToken: string;
  }> {
    const tokens = await this.tokenService.generateAuthTokens(user, session.id);

    await this.saveRefreshToken(session.id, tokens.refreshToken);

    // لو الجلسة PENDING، منرجّعش accessToken
    if (session.status === SessionStatus.PENDING) {
      return {
        refreshToken: tokens.refreshToken,
      };
    }

    return tokens;
  }

  private async saveRefreshToken(
    sessionId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedToken = sha256(refreshToken);
    const hash = await this.passwordService.hash(hashedToken);

    await this.sessionsService.updateRefreshTokenHash(sessionId, hash);
  }

  async registerAdmin(data: RegisterDto): Promise<AuthResponseDto> {
    const existingEmail = await this.usersService.findByEmail(data.email);
    if (existingEmail) {
      throw new ConflictException("Email already exists");
    }

    const existingUsername = await this.usersService.findByUsername(
      data.username,
    );
    if (existingUsername) {
      throw new ConflictException("Username already exists");
    }

    const passwordHash = await this.passwordService.hash(data.password);

    const user = await this.usersService.create({
      email: data.email,
      username: data.username,
      passwordHash,
      role: "ADMIN",
    });

    const authUser = AuthMapper.toAuthUserDto(user);

    const session = await this.createSession(user.id, {
      userAgent: "admin-registration",
      ipAddress: "0.0.0.0",
    });
    const tokens = await this.generateSessionTokens(authUser, session);

    return {
      user: authUser,
      session: SessionMapper.toSummary(session, session.id),
      ...tokens,
    };
  }

  // ─────────────────────────────────────────────────────────────
  //  Device-based session reuse
  // ─────────────────────────────────────────────────────────────

  /**
   * لو فيه جلسة ACTIVE على نفس الجهاز، نرجّعها.
   * غير كده، نرجّع null عشان الـ caller يعمل جلسة جديدة.
   */
  private async findReusableSession(
    userId: string,
    deviceInfo: { userAgent: string; ipAddress: string },
  ): Promise<Session | null> {
    if (!deviceInfo?.userAgent) return null;

    const session = await this.sessionsService.findActiveByDevice(
      userId,
      deviceInfo.userAgent,
      deviceInfo.ipAddress,
    );

    return session;
  }

  private async reuseSession(
    authUser: AuthUserDto,
    session: Session,
  ): Promise<AuthResponseDto> {
    // tokens جديدة
    const tokens = await this.generateSessionTokens(authUser, session);

    // نحدّث آخر استخدام
    const updatedSession = await this.sessionsService.touchLastUsed(session.id);

    return {
      user: authUser,
      session: SessionMapper.toSummary(updatedSession, session.id),
      ...tokens,
    };
  }

  // ─────────────────────────────────────────────────────────────
  //  Register
  // ─────────────────────────────────────────────────────────────

  async register(
    data: RegisterDto,
    deviceInfo: { userAgent: string; ipAddress: string },
  ): Promise<AuthResponseDto> {
    const existingEmail = await this.usersService.findByEmail(data.email);
    if (existingEmail) {
      throw new ConflictException("Email already exists");
    }

    const existingUsername = await this.usersService.findByUsername(
      data.username,
    );
    if (existingUsername) {
      throw new ConflictException("Username already exists");
    }

    const passwordHash = await this.passwordService.hash(data.password);

    const user = await this.usersService.create({
      email: data.email,
      username: data.username,
      passwordHash,
    });

    const authUser = AuthMapper.toAuthUserDto(user);

    // أول register لمستخدم جديد — مستحيل يكون فيه جلسة،
    // فمش محتاجين نتحقق من findReusableSession.
    // بس ممكن نضيفها للأمان لو حابب.

    const session = await this.createSession(user.id, deviceInfo);
    const tokens = await this.generateSessionTokens(authUser, session);

    return {
      user: authUser,
      session: SessionMapper.toSummary(session, session.id),
      ...tokens,
    };
  }

  // ─────────────────────────────────────────────────────────────
  //  Login
  // ─────────────────────────────────────────────────────────────

  async login(
    data: LoginDto,
    deviceInfo: { userAgent: string; ipAddress: string },
  ): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await this.passwordService.compare(
      data.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const authUser = AuthMapper.toAuthUserDto(user);

    const reusable = await this.findReusableSession(user.id, deviceInfo);
    if (reusable) {
      return this.reuseSession(authUser, reusable);
    }

    const session = await this.createSession(user.id, deviceInfo);
    const tokens = await this.generateSessionTokens(authUser, session);

    return {
      user: authUser,
      session: SessionMapper.toSummary(session, session.id),
      ...tokens,
    };
  }

  // ─────────────────────────────────────────────────────────────
  //  Refresh
  // ─────────────────────────────────────────────────────────────

  async refresh(user: RefreshUser): Promise<AuthResponseDto> {
    const dbUser = await this.usersService.findById(user.id);
    if (!dbUser) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const session = await this.sessionsService.findById(user.sessionId);
    if (!session) {
      throw new UnauthorizedException("Invalid session");
    }

    if (session.userId !== user.id) {
      throw new UnauthorizedException("Invalid session");
    }

    if (session.status !== SessionStatus.ACTIVE) {
      throw new UnauthorizedException("Session is not active");
    }

    if (session.revokedAt) {
      throw new UnauthorizedException("Session revoked");
    }

    if (session.expiresAt <= new Date()) {
      throw new UnauthorizedException("Session expired");
    }

    if (!session.refreshTokenHash) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const hashedToken = sha256(user.refreshToken);
    const isValid = await this.passwordService.compare(
      hashedToken,
      session.refreshTokenHash,
    );

    if (!isValid) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const authUser = AuthMapper.toAuthUserDto(dbUser);

    const tokens = await this.tokenService.generateAuthTokens(
      authUser,
      session.id,
    );

    await this.saveRefreshToken(session.id, tokens.refreshToken);
    const updatedSession = await this.sessionsService.touchLastUsed(session.id);

    return {
      user: authUser,
      session: SessionMapper.toSummary(updatedSession, session.id),
      ...tokens,
    };
  }

  // ─────────────────────────────────────────────────────────────
  //  Sessions listing / revoking
  // ─────────────────────────────────────────────────────────────

  listSessions(
    userId: string,
    currentSessionId?: string,
  ): Promise<SessionSummaryDto[]> {
    return this.sessionsService
      .findByUserId(userId)
      .then((sessions) =>
        sessions.map((session) =>
          SessionMapper.toSummary(session, currentSessionId),
        ),
      );
  }

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    const session = await this.sessionsService.findById(sessionId);

    if (!session) {
      throw new NotFoundException("Session not found");
    }

    if (session.userId !== userId) {
      throw new ForbiddenException("You cannot revoke another user's session");
    }

    if (session.status === SessionStatus.REVOKED) {
      return;
    }

    if (session.status === SessionStatus.ACTIVE) {
      await this.sessionsService.revokeAndActivatePending(userId, sessionId);
      return;
    }

    await this.sessionsService.revoke(sessionId);
  }

  async deleteSession(userId: string, sessionId: string): Promise<void> {
    const session = await this.sessionsService.findById(sessionId);

    if (!session) {
      throw new NotFoundException("Session not found");
    }

    if (session.userId !== userId) {
      throw new ForbiddenException("You cannot delete another user's session");
    }

    await this.sessionsService.deleteById(sessionId);
  }

  async revokeOtherSessions(
    userId: string,
    currentSessionId: string,
  ): Promise<void> {
    await this.sessionsService.revokeOtherSessions(userId, currentSessionId);
  }

  async deleteOtherSessions(
    userId: string,
    currentSessionId: string,
  ): Promise<void> {
    await this.sessionsService.deleteOtherSessions(userId, currentSessionId);
  }

  async revokeAllSessions(userId: string): Promise<void> {
    await this.sessionsService.revokeAllByUserId(userId);
  }

  async deleteAllSessions(userId: string): Promise<void> {
    await this.sessionsService.deleteAllByUserId(userId);
  }

  // ─────────────────────────────────────────────────────────────
  //  Password reset
  // ─────────────────────────────────────────────────────────────

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return;

    const resetToken = randomBytes(32).toString("hex");
    const now = new Date();

    await this.usersService.updateById(user.id, {
      passwordResetTokenHash: sha256(resetToken),
      passwordResetTokenExpiresAt: new Date(
        now.getTime() + PASSWORD_RESET_TOKEN_TTL,
      ),
      passwordResetTokenUsedAt: null,
    });

    if (process.env.NODE_ENV !== "production") {
      this.logger.debug(`Password reset token for ${email}: ${resetToken}`);
    }

    // TODO: في production، ابعت الإيميل هنا

    return;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = sha256(token);
    const user =
      await this.usersService.findByPasswordResetTokenHash(tokenHash);

    if (
      !user ||
      !user.passwordResetTokenHash ||
      !user.passwordResetTokenExpiresAt ||
      user.passwordResetTokenUsedAt ||
      user.passwordResetTokenExpiresAt <= new Date()
    ) {
      throw new UnauthorizedException("Invalid password reset token");
    }

    const passwordHash = await this.passwordService.hash(newPassword);

    await this.usersService.updateById(user.id, {
      passwordHash,
      passwordResetTokenHash: null,
      passwordResetTokenExpiresAt: null,
      passwordResetTokenUsedAt: new Date(),
    });

    await this.sessionsService.revokeAllByUserId(user.id);
  }

  async logout(sessionId: string): Promise<void> {
    await this.sessionsService.revoke(sessionId);
  }
}

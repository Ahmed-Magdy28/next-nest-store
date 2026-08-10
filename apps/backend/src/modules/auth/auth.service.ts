import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Session } from "@repo/database";
import { REFRESH_TOKEN_SESSION_TTL, sha256 } from "../../common/security";
import { RegisterDto, LoginDto } from "./schemas";
import { UsersService } from "../users/users.service";
import { PasswordService } from "./services/password.service";
import { AuthMapper } from "./mappers/auth.mapper";
import { TokenService } from "./services/token.service";
import type { AuthResponseDto } from "./dto";
import { RefreshUser } from "./types";
import { SessionsService } from "../sessions/sessions.service";
import { MAX_SESSIONS } from "../../common/constants";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly SessionsService: SessionsService,
  ) {}
  private async createSession(userId: string): Promise<Session> {
    const activeSessions =
      await this.SessionsService.countActiveByUserId(userId);

    const status = activeSessions < MAX_SESSIONS ? "ACTIVE" : "PENDING";

    return this.SessionsService.create({
      userId,
      refreshTokenHash: null,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_SESSION_TTL),
      status,
    });
  }

  private async saveRefreshToken(
    sessionId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedToken = sha256(refreshToken);
    const hash = await this.passwordService.hash(hashedToken);

    await this.SessionsService.updateRefreshTokenHash(sessionId, hash);
  }

  async register(data: RegisterDto): Promise<AuthResponseDto> {
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

    const session = await this.createSession(user.id);

    const tokens = await this.tokenService.generateAuthTokens(
      authUser,
      session.id,
    );

    await this.saveRefreshToken(session.id, tokens.refreshToken);

    return {
      user: authUser,
      ...tokens,
    };
  }

  async login(data: LoginDto): Promise<AuthResponseDto> {
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

    const session = await this.createSession(user.id);

    const tokens = await this.tokenService.generateAuthTokens(
      authUser,
      session.id,
    );

    await this.saveRefreshToken(session.id, tokens.refreshToken);

    return {
      user: authUser,
      ...tokens,
    };
  }

  async refresh(user: RefreshUser): Promise<AuthResponseDto> {
    const dbUser = await this.usersService.findById(user.id);

    if (!dbUser) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const session = await this.SessionsService.findById(user.sessionId);

    if (!session) {
      throw new UnauthorizedException("Invalid session");
    }

    if (session.userId !== user.id) {
      throw new UnauthorizedException("Invalid session");
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

    return {
      user: authUser,
      ...tokens,
    };
  }

  async logout(sessionId: string): Promise<void> {
    await this.SessionsService.revoke(sessionId);
  }
}

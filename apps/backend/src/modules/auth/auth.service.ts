import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { sha256 } from "../../common/security";
import { RegisterDto, LoginDto } from "./schemas";
import { UsersService } from "../users/users.service";
import { PasswordService } from "./services/password.service";
import { AuthMapper } from "./mappers/auth.mapper";
import { TokenService } from "./services/token.service";
import type { AuthResponseDto } from "./dto";
import { RefreshUser } from "./types";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = sha256(refreshToken);
    const hash = await this.passwordService.hash(hashedToken);

    await this.usersService.updateRefreshTokenHash(userId, hash);
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
    const tokens = await this.tokenService.generateAuthTokens(authUser);

    await this.saveRefreshToken(user.id, tokens.refreshToken);

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
    const tokens = await this.tokenService.generateAuthTokens(authUser);

    await this.saveRefreshToken(user.id, tokens.refreshToken);

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

    if (!dbUser.refreshTokenHash) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const hashedToken = sha256(user.refreshToken);
    const isValid = await this.passwordService.compare(
      hashedToken,
      dbUser.refreshTokenHash,
    );

    if (!isValid) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const authUser = AuthMapper.toAuthUserDto(dbUser);

    const tokens = await this.tokenService.generateAuthTokens(authUser);

    await this.saveRefreshToken(dbUser.id, tokens.refreshToken);

    return {
      user: authUser,
      ...tokens,
    };
  }
}

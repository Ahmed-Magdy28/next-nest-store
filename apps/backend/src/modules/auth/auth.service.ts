import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { RegisterDto, LoginDto } from "./schemas";
import { UsersService } from "../users/users.service";
import { PasswordService } from "./services/password.service";
import { AuthMapper } from "./mappers/auth.mapper";
import { TokenService } from "./services/token.service";
import type { AuthResponseDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

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
    const accessToken = await this.tokenService.generateAccessToken(user);

    return {
      user: AuthMapper.toAuthUserDto(user),
      accessToken,
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

    const accessToken = await this.tokenService.generateAccessToken(user);

    return {
      user: AuthMapper.toAuthUserDto(user),
      accessToken,
    };
  }
}

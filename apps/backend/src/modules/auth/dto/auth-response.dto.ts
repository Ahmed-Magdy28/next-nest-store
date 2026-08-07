import type { AuthUserDto } from "./auth-user.dto";

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponseDto extends AuthTokensDto {
  user: AuthUserDto;
}

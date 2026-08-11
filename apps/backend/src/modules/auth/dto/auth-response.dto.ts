import type { AuthUserDto } from "./auth-user.dto";
import type { SessionSummaryDto } from "../../sessions/dto";

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponseDto extends AuthTokensDto {
  user: AuthUserDto;
  session: SessionSummaryDto;
}

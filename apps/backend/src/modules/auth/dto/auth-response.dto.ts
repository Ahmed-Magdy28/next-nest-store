import type { AuthUserDto } from "./auth-user.dto";

export interface AuthResponseDto {
  user: AuthUserDto;
  accessToken: string;
}

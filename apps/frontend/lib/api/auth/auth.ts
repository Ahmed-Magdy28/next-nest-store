import type {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "@repo/shared/dtos/auth";
import type { JwtUser } from "@repo/shared/interfaces";

import { apiClient } from "../common/client";
import { tokenStorage } from "../common/token-storage";

/**
 * Auth API.
 * - `register` و `login` بيحفظوا التوكنز تلقائيًا.
 * - `logout` بيمسح التوكنز.
 */
export const authApi = {
  async register(body: RegisterDto): Promise<AuthResponseDto> {
    const res = await apiClient.post<AuthResponseDto>("/auth/register", body, {
      skipAuth: true,
      skipRefresh: true,
    });
    if (res.accessToken) {
      tokenStorage.setTokens(res.accessToken, res.refreshToken);
    }
    return res;
  },

  async login(body: LoginDto): Promise<AuthResponseDto> {
    const res = await apiClient.post<AuthResponseDto>("/auth/login", body, {
      skipAuth: true,
      skipRefresh: true,
    });
    if (res.accessToken) {
      tokenStorage.setTokens(res.accessToken, res.refreshToken);
    }
    return res;
  },

  async me(): Promise<JwtUser> {
    return apiClient.get<JwtUser>("/auth/me");
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post<void>("/auth/logout");
    } catch {
      // حتى لو فشل، نمسح محليًا
    } finally {
      tokenStorage.clear();
    }
  },

  async forgotPassword(body: ForgotPasswordDto): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>("/auth/forgot-password", body, {
      skipAuth: true,
      skipRefresh: true,
    });
  },

  async resetPassword(body: ResetPasswordDto): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>("/auth/reset-password", body, {
      skipAuth: true,
      skipRefresh: true,
    });
  },
};

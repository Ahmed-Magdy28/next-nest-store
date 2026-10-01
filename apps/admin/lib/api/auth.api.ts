import { apiClient } from "./client";
import { tokenStorage } from "./token-storage";
import type { LoginDto, AuthResponseDto } from "@repo/shared/dtos/auth";
import type { JwtUser } from "@repo/shared/interfaces";

export const authApi = {
  async loginAdmin(data: LoginDto): Promise<AuthResponseDto> {
    const res = await apiClient.post<AuthResponseDto>("/auth/login-admin", data, {
      skipAuth: true,
    });
    if (res.accessToken) {
      tokenStorage.setTokens(res.accessToken, res.refreshToken);
    }
    return res;
  },

  async getMe(): Promise<JwtUser> {
    return apiClient.get<JwtUser>("/auth/me");
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      tokenStorage.clear();
    }
  },
};

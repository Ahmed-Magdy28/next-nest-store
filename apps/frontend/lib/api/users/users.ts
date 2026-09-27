import type {
  UserProfileDto,
  UpdateMeDto,
  UpdateUsernameDto,
  UpdateEmailDto,
} from "@repo/shared/dtos/users";
import type { ChangePasswordDto, VerifyEmailDto } from "@repo/shared/dtos/auth";
import { apiClient } from "../common/client";

export const usersApi = {
  me: () => apiClient.get<UserProfileDto>("/users/me"),

  updateMe: (body: UpdateMeDto) =>
    apiClient.patch<{ user: UserProfileDto; verificationToken?: string }>(
      "/users/me",
      body,
    ),

  updateUsername: (body: UpdateUsernameDto) =>
    apiClient.patch<{ user: UserProfileDto }>("/users/me/username", body),

  requestEmailChange: (body: UpdateEmailDto) =>
    apiClient.patch<{ user: UserProfileDto; verificationToken?: string }>(
      "/users/me/email",
      body,
    ),

  verifyEmail: (body: VerifyEmailDto) =>
    apiClient.post<{ user: UserProfileDto }>("/users/me/email/verify", body, {
      skipAuth: true,
      skipRefresh: true,
    }),

  changePassword: (body: ChangePasswordDto) =>
    apiClient.patch<void>("/users/me/password", body),
};

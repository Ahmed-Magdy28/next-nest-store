import { apiClient } from "./client";

export interface UserStatsDto {
  totalUsers: number;
  activeUsers: number;
}

export const usersApi = {
  /**
   * Get user statistics (total users, active users)
   */
  async getUserStats(): Promise<UserStatsDto> {
    return apiClient.get<UserStatsDto>("/users/stats");
  },
};

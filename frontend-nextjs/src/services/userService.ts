import { backendApi } from "./api";
import {
  User,
  UserProfileFormData,
  UserStatistics,
  ApiResponse,
} from "@/types";

export class UserService {
  static async getCurrentUser(): Promise<User> {
    return backendApi.get<User>("/api/auth/me");
  }

  static async updateProfile(
    userId: number,
    data: UserProfileFormData
  ): Promise<User> {
    return backendApi.put<User>(`/api/user/${userId}/profile`, data);
  }

  static async updateLanguage(userId: number, language: string): Promise<void> {
    return backendApi.put<void>(`/api/user/${userId}/language`, { language });
  }

  static async updateLocation(location: {
    latitude: number;
    longitude: number;
  }): Promise<void> {
    return backendApi.put<void>("/api/user/location", location);
  }

  static async getUserStatistics(userId: number): Promise<UserStatistics> {
    return backendApi.get<UserStatistics>(`/api/user/${userId}/statistics`);
  }

  static async deactivateAccount(userId: number): Promise<void> {
    return backendApi.delete<void>(`/api/user/${userId}`);
  }

  static async uploadAvatar(
    userId: number,
    file: File
  ): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append("avatar", file);
    return backendApi.upload<{ imageUrl: string }>(
      `/api/user/${userId}/avatar`,
      formData
    );
  }
}

export default UserService;

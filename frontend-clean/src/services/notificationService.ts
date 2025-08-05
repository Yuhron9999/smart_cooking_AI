import { backendApi } from "./api";
import { Notification, ApiResponse } from "../types";

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newRecipes: boolean;
  comments: boolean;
  follows: boolean;
  achievements: boolean;
  systemUpdates: boolean;
  aiSuggestions: boolean;
}

export const notificationService = {
  /**
   * Lấy tất cả thông báo cho người dùng đã đăng nhập
   */
  getAll: async (): Promise<Notification[]> => {
    try {
      const response = await backendApi.get<Notification[]>("/api/notifications");
      return response;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  /**
   * Đánh dấu một thông báo đã đọc
   */
  markAsRead: async (
    id: string
  ): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      const response = await backendApi.post<ApiResponse<{ success: boolean }>>(`/api/notifications/${id}/read`);
      return response;
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      throw error;
    }
  },

  /**
   * Đánh dấu tất cả thông báo đã đọc
   */
  markAllAsRead: async (): Promise<
    ApiResponse<{ success: boolean; count: number }>
  > => {
    try {
      const response = await backendApi.post<ApiResponse<{ success: boolean; count: number }>>("/api/notifications/mark-all-read");
      return response;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  /**
   * Đánh dấu một thông báo là quan trọng/không quan trọng
   */
  toggleImportant: async (
    id: string
  ): Promise<ApiResponse<{ success: boolean; isImportant: boolean }>> => {
    try {
      const response = await backendApi.post<ApiResponse<{ success: boolean; isImportant: boolean }>>(
        `/api/notifications/${id}/toggle-important`
      );
      return response;
    } catch (error) {
      console.error(`Error toggling importance for notification ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa một thông báo
   */
  delete: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      const response = await backendApi.delete<ApiResponse<{ success: boolean }>>(`/api/notifications/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error);
      throw error;
    }
  },

  /**
   * Lấy số lượng thông báo chưa đọc
   */
  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await backendApi.get<{ count: number }>("/api/notifications/unread-count");
      return response.count;
    } catch (error) {
      console.error("Error fetching unread notifications count:", error);
      return 0; // Fallback value
    }
  },

  /**
   * Cài đặt tùy chọn thông báo của người dùng
   */
  getSettings: async (): Promise<ApiResponse<NotificationSettings>> => {
    try {
      const response = await backendApi.get<ApiResponse<NotificationSettings>>("/api/user/notification-settings");
      return response;
    } catch (error) {
      console.error("Error fetching notification settings:", error);
      throw error;
    }
  },

  updateSettings: async (
    settings: NotificationSettings
  ): Promise<ApiResponse<NotificationSettings>> => {
    try {
      const response = await backendApi.put<ApiResponse<NotificationSettings>>(
        "/api/user/notification-settings",
        settings
      );
      return response;
    } catch (error) {
      console.error("Error updating notification settings:", error);
      throw error;
    }
  },
};

export default notificationService;

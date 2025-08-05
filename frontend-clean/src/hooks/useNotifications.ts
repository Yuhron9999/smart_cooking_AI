import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import notificationService, {
  NotificationSettings,
} from "../services/notificationService";
import { Notification } from "../types";

export const useNotifications = () => {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (status !== "authenticated") return;

    setLoading(true);
    setError(null);

    try {
      const data = await notificationService.getAll();
      setNotifications(data);

      // Update unread count
      const unread = data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Lỗi khi tải thông báo";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [status]);

  const fetchUnreadCount = useCallback(async () => {
    if (status !== "authenticated") return;

    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  }, [status]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      const response = await notificationService.markAsRead(id);

      if (response.success) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === id
              ? { ...notification, isRead: true }
              : notification
          )
        );

        // Decrease unread count
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      return response.success;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Lỗi khi đánh dấu đã đọc";
      setError(errorMessage);
      return false;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await notificationService.markAllAsRead();

      if (response.success) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        );

        // Reset unread count
        setUnreadCount(0);
      }

      return response.success;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Lỗi khi đánh dấu tất cả đã đọc";
      setError(errorMessage);
      return false;
    }
  }, []);

  const toggleImportant = useCallback(async (id: string) => {
    try {
      const response = await notificationService.toggleImportant(id);

      if (response.success) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === id
              ? {
                  ...notification,
                  isImportant:
                    response.data?.isImportant ?? !notification.isImportant,
                }
              : notification
          )
        );
      }

      return response.success;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Lỗi khi thay đổi trạng thái quan trọng";
      setError(errorMessage);
      return false;
    }
  }, []);

  const deleteNotification = useCallback(
    async (id: string) => {
      try {
        const response = await notificationService.delete(id);

        if (response.success) {
          setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.id !== id)
          );

          // Update unread count if needed
          const wasUnread =
            notifications.find((n) => n.id === id)?.isRead === false;
          if (wasUnread) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
        }

        return response.success;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Lỗi khi xóa thông báo";
        setError(errorMessage);
        return false;
      }
    },
    [notifications]
  );

  const fetchSettings = useCallback(async () => {
    if (status !== "authenticated") return;

    try {
      const response = await notificationService.getSettings();
      setSettings(response.data ?? null);
    } catch (err) {
      console.error("Error fetching notification settings:", err);
    }
  }, [status]);

  const updateSettings = useCallback(
    async (newSettings: NotificationSettings) => {
      try {
        const response = await notificationService.updateSettings(newSettings);

        if (response.success) {
          setSettings(response.data ?? null);
        }

        return response.success;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Lỗi khi cập nhật cài đặt thông báo";
        setError(errorMessage);
        return false;
      }
    },
    []
  );

  // Load notifications when user is authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetchNotifications();
      fetchSettings();
    }
  }, [status, fetchNotifications, fetchSettings]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    settings,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    toggleImportant,
    deleteNotification,
    updateSettings,
  };
};

export default useNotifications;

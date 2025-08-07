import apiService, { ApiResponse } from './apiService';

/**
 * Interface cho dữ liệu đồng bộ từ Mobile
 */
export interface MobileSyncData {
  userId: number;
  deviceId: string;
  lastSyncTimestamp?: string;
  data: any;
}

/**
 * Interface cho cấu hình Mobile
 */
export interface MobileAppConfig {
  apiVersion: string;
  minAppVersion: string;
  recommendedAppVersion: string;
  forceUpdate: boolean;
  features: {
    enableVoiceCommands: boolean;
    enableImageRecognition: boolean;
    enableOfflineMode: boolean;
    enableNotifications: boolean;
  };
  endpoints: {
    auth: string;
    recipes: string;
    users: string;
    media: string;
  };
}

/**
 * MobileIntegrationService - Dịch vụ tích hợp với ứng dụng Mobile Flutter
 * 
 * Service này cung cấp các phương thức để tích hợp dữ liệu giữa web frontend và mobile app
 * đảm bảo sự đồng bộ và chia sẻ dữ liệu giữa các nền tảng.
 */
class MobileIntegrationService {
  /**
   * Đăng ký thiết bị mới
   */
  public async registerDevice(deviceInfo: {
    deviceId: string;
    platform: 'iOS' | 'Android';
    osVersion: string;
    appVersion: string;
    pushToken?: string;
  }): Promise<ApiResponse<{ deviceToken: string }>> {
    try {
      return await apiService.post<{ deviceToken: string }>('/mobile/devices/register', deviceInfo);
    } catch (error) {
      console.error('Error registering mobile device:', error);
      return {
        success: false,
        message: 'Không thể đăng ký thiết bị mobile.',
        errorCode: 'DEVICE_REGISTRATION_ERROR',
        data: null
      };
    }
  }

  /**
   * Đồng bộ dữ liệu từ mobile lên server
   */
  public async syncFromMobile(syncData: MobileSyncData): Promise<ApiResponse<{
    lastSyncTimestamp: string;
    updatedData: any;
  }>> {
    try {
      return await apiService.post<{
        lastSyncTimestamp: string;
        updatedData: any;
      }>('/mobile/sync', syncData);
    } catch (error) {
      console.error('Error syncing data from mobile:', error);
      return {
        success: false,
        message: 'Không thể đồng bộ dữ liệu từ mobile.',
        errorCode: 'MOBILE_SYNC_ERROR',
        data: null
      };
    }
  }

  /**
   * Lấy cấu hình cho mobile app
   */
  public async getMobileConfig(): Promise<ApiResponse<MobileAppConfig>> {
    try {
      return await apiService.get<MobileAppConfig>('/mobile/config');
    } catch (error) {
      console.error('Error getting mobile configuration:', error);
      return {
        success: false,
        message: 'Không thể lấy cấu hình cho ứng dụng di động.',
        errorCode: 'MOBILE_CONFIG_ERROR',
        data: null
      };
    }
  }

  /**
   * Báo cáo lỗi từ mobile app
   */
  public async reportMobileError(errorData: {
    deviceId: string;
    userId?: number;
    errorMessage: string;
    stackTrace?: string;
    appVersion: string;
    timestamp: string;
    screenName?: string;
  }): Promise<ApiResponse<boolean>> {
    try {
      return await apiService.post<boolean>('/mobile/errors/report', errorData);
    } catch (error) {
      console.error('Error reporting mobile error:', error);
      return {
        success: false,
        message: 'Không thể báo cáo lỗi từ ứng dụng di động.',
        errorCode: 'ERROR_REPORTING_FAILED',
        data: null
      };
    }
  }

  /**
   * Gửi thông báo đến thiết bị di động cụ thể
   */
  public async sendPushNotification(notification: {
    userId?: number;
    deviceId?: string;
    title: string;
    body: string;
    data?: any;
    topic?: string;
    priority?: 'high' | 'normal';
  }): Promise<ApiResponse<{ messageId: string }>> {
    try {
      return await apiService.post<{ messageId: string }>('/mobile/notifications/send', notification);
    } catch (error) {
      console.error('Error sending push notification:', error);
      return {
        success: false,
        message: 'Không thể gửi thông báo đến thiết bị di động.',
        errorCode: 'PUSH_NOTIFICATION_ERROR',
        data: null
      };
    }
  }

  /**
   * Xác thực token từ ứng dụng di động
   */
  public async validateMobileToken(token: string): Promise<ApiResponse<{
    valid: boolean;
    userId?: number;
    permissions?: string[];
  }>> {
    try {
      return await apiService.post<{
        valid: boolean;
        userId?: number;
        permissions?: string[];
      }>('/mobile/auth/validate', { token });
    } catch (error) {
      console.error('Error validating mobile token:', error);
      return {
        success: false,
        message: 'Không thể xác thực token từ ứng dụng di động.',
        errorCode: 'TOKEN_VALIDATION_ERROR',
        data: null
      };
    }
  }

  /**
   * Đăng nhập từ ứng dụng di động
   */
  public async mobileLogin(credentials: {
    email: string;
    password: string;
    deviceId: string;
  }): Promise<ApiResponse<{
    accessToken: string;
    refreshToken: string;
    user: any;
  }>> {
    try {
      return await apiService.post<{
        accessToken: string;
        refreshToken: string;
        user: any;
      }>('/mobile/auth/login', credentials);
    } catch (error) {
      console.error('Error during mobile login:', error);
      return {
        success: false,
        message: 'Không thể đăng nhập từ ứng dụng di động.',
        errorCode: 'MOBILE_LOGIN_ERROR',
        data: null
      };
    }
  }
}

// Export singleton instance
const mobileIntegrationService = new MobileIntegrationService();
export default mobileIntegrationService;

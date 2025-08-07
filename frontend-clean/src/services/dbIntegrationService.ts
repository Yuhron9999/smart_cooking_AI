import apiService, { ApiResponse } from './apiService';
import { backendApi } from './api';
import { User } from '@/types';

/**
 * DatabaseIntegrationService - Dịch vụ tích hợp giữa frontend và backend SpringBoot với MySQL
 * 
 * Service này cung cấp các phương thức để gọi trực tiếp đến các endpoint SpringBoot
 * và xử lý dữ liệu từ cơ sở dữ liệu MySQL.
 */
class DatabaseIntegrationService {
  /**
   * Kiểm tra kết nối đến backend SpringBoot
   */
  public async checkBackendConnection(): Promise<ApiResponse<{ status: string }>> {
    try {
      return await apiService.get<{ status: string }>('/health');
    } catch (error) {
      console.error('Error checking backend connection:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến backend.',
        errorCode: 'CONNECTION_ERROR',
        data: null
      };
    }
  }

  /**
   * Kiểm tra kết nối MySQL
   */
  public async checkDatabaseConnection(): Promise<ApiResponse<{ status: string }>> {
    try {
      return await apiService.get<{ status: string }>('/db/health');
    } catch (error) {
      console.error('Error checking database connection:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến cơ sở dữ liệu.',
        errorCode: 'DB_CONNECTION_ERROR',
        data: null
      };
    }
  }

  /**
   * Đồng bộ dữ liệu người dùng giữa frontend và backend
   */
  public async syncUserData(userId: number): Promise<ApiResponse<User>> {
    try {
      return await apiService.post<User>('/users/sync', { userId });
    } catch (error) {
      console.error('Error syncing user data:', error);
      return {
        success: false,
        message: 'Không thể đồng bộ dữ liệu người dùng.',
        errorCode: 'SYNC_ERROR',
        data: null
      };
    }
  }

  /**
   * Cập nhật cấu hình cho mobile app
   */
  public async updateMobileConfig(config: any): Promise<ApiResponse<boolean>> {
    try {
      return await apiService.post<boolean>('/mobile/config', config);
    } catch (error) {
      console.error('Error updating mobile config:', error);
      return {
        success: false,
        message: 'Không thể cập nhật cấu hình mobile.',
        errorCode: 'MOBILE_CONFIG_ERROR',
        data: null
      };
    }
  }

  /**
   * Lấy thông tin cấu hình từ backend cho mobile app
   */
  public async getMobileConfig(): Promise<ApiResponse<any>> {
    try {
      return await apiService.get<any>('/mobile/config');
    } catch (error) {
      console.error('Error getting mobile config:', error);
      return {
        success: false,
        message: 'Không thể lấy cấu hình mobile.',
        errorCode: 'MOBILE_CONFIG_ERROR',
        data: null
      };
    }
  }

  /**
   * Đồng bộ dữ liệu giữa MySQL và MongoDB (nếu có)
   */
  public async syncDatabases(): Promise<ApiResponse<{ status: string }>> {
    try {
      return await apiService.post<{ status: string }>('/admin/sync-databases', {});
    } catch (error) {
      console.error('Error syncing databases:', error);
      return {
        success: false,
        message: 'Không thể đồng bộ cơ sở dữ liệu.',
        errorCode: 'DB_SYNC_ERROR',
        data: null
      };
    }
  }

  /**
   * Gửi dữ liệu từ Mobile App Flutter lên backend
   */
  public async sendMobileData(data: any): Promise<ApiResponse<{ received: boolean }>> {
    try {
      return await apiService.post<{ received: boolean }>('/mobile/data', data);
    } catch (error) {
      console.error('Error sending mobile data:', error);
      return {
        success: false,
        message: 'Không thể gửi dữ liệu từ mobile.',
        errorCode: 'MOBILE_DATA_ERROR',
        data: null
      };
    }
  }
  
  /**
   * Thực hiện truy vấn SQL trực tiếp (chỉ dùng cho admin hoặc debug)
   */
  public async executeQuery(query: string): Promise<ApiResponse<any>> {
    try {
      return await apiService.post<any>('/admin/execute-query', { query });
    } catch (error) {
      console.error('Error executing SQL query:', error);
      return {
        success: false,
        message: 'Không thể thực thi truy vấn SQL.',
        errorCode: 'SQL_QUERY_ERROR',
        data: null
      };
    }
  }
  
  /**
   * Tải dữ liệu từ backend để sử dụng trong Flutter
   */
  public async getMobileAppData(): Promise<ApiResponse<any>> {
    try {
      return await apiService.get<any>('/mobile/app-data');
    } catch (error) {
      console.error('Error loading mobile app data:', error);
      return {
        success: false,
        message: 'Không thể tải dữ liệu cho ứng dụng di động.',
        errorCode: 'MOBILE_DATA_ERROR',
        data: null
      };
    }
  }

  /**
   * Kiểm tra API endpoint cụ thể có hoạt động không
   */
  public async testApiEndpoint(endpoint: string, method: 'GET' | 'POST' = 'GET', data?: any): Promise<ApiResponse<any>> {
    try {
      if (method === 'GET') {
        return await apiService.get<any>(`/test/${endpoint}`);
      } else {
        return await apiService.post<any>(`/test/${endpoint}`, data);
      }
    } catch (error) {
      console.error(`Error testing API endpoint ${endpoint}:`, error);
      return {
        success: false,
        message: `Endpoint ${endpoint} không hoạt động hoặc gặp lỗi.`,
        errorCode: 'ENDPOINT_ERROR',
        data: null
      };
    }
  }
}

// Export singleton instance
const dbIntegrationService = new DatabaseIntegrationService();
export default dbIntegrationService;

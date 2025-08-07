import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * ApiService class - Quản lý các cuộc gọi API đến backend
 */
class ApiService {
  private axiosInstance: AxiosInstance;
  private language: string = 'vi';
  private token: string | null = null;

  constructor() {
    // Tạo instance Axios với cấu hình mặc định
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': this.language,
      },
    });

    // Thêm interceptor cho request
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Thêm token vào header nếu có
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Thêm interceptor cho response
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Xử lý refresh token nếu token hết hạn (401)
        if (error.response?.status === 401) {
          // Thử refresh token
          try {
            const refreshed = await this.refreshToken();
            if (refreshed) {
              // Thử gọi lại request ban đầu
              return this.axiosInstance(error.config);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // Redirect đến trang login
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Set token xác thực
   */
  public setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  /**
   * Lấy token từ localStorage khi khởi động
   */
  public loadToken(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.token = token;
    }
  }

  /**
   * Xóa token khi logout
   */
  public clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  /**
   * Set ngôn ngữ cho API calls
   */
  public setLanguage(lang: string): void {
    this.language = lang;
    this.axiosInstance.defaults.headers['Accept-Language'] = lang;
  }

  /**
   * Refresh token
   */
  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        return false;
      }

      const response = await axios.post(
        `${this.axiosInstance.defaults.baseURL}/auth/refresh`,
        { refreshToken }
      );

      if (response.data?.data?.token) {
        this.setToken(response.data.data.token);
        localStorage.setItem('refresh_token', response.data.data.refreshToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  /**
   * GET request
   */
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST request
   */
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PUT request
   */
  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETE request
   */
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Xử lý lỗi API
   */
  private handleError(error: any): ApiResponse<any> {
    console.error('API Error:', error);
    
    // Nếu có response từ server
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || 'Lỗi từ server',
        errorCode: error.response.data?.errorCode || 'UNKNOWN_ERROR',
        data: null
      };
    }
    
    // Lỗi kết nối hoặc timeout
    return {
      success: false,
      message: error.message || 'Không thể kết nối đến server',
      errorCode: 'CONNECTION_ERROR',
      data: null
    };
  }
}

// Interface cho API Response từ server
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errorCode?: string;
  data: T | null;
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;

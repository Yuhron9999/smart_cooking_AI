import apiService, { ApiResponse } from './apiService';
import { User } from '@/types';

/**
 * Interface cho dữ liệu đăng nhập
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Interface cho dữ liệu đăng ký
 */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  language?: string;
}

/**
 * Interface cho đổi mật khẩu
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Interface cho kết quả đăng nhập
 */
export interface AuthResult {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  user: User;
}

/**
 * AuthService - Dịch vụ xác thực người dùng
 * 
 * Service này cung cấp các phương thức để xác thực người dùng, đăng ký tài khoản,
 * và quản lý phiên đăng nhập thông qua Spring Boot backend.
 */
class AuthService {
  /**
   * Đăng nhập với email và mật khẩu
   */
  public async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResult>> {
    try {
      const response = await apiService.post<AuthResult>('/auth/login', credentials);
      
      // Lưu token vào ApiService để tự động đính kèm trong các request sau này
      if (response.success && response.data?.accessToken) {
        apiService.setToken(response.data.accessToken);
        
        // Lưu refresh token nếu có
        if (response.data.refreshToken) {
          localStorage.setItem('refresh_token', response.data.refreshToken);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.',
        errorCode: 'LOGIN_ERROR',
        data: null
      };
    }
  }

  /**
   * Đăng nhập với Google
   */
  public async loginWithGoogle(token: string): Promise<ApiResponse<AuthResult>> {
    try {
      const response = await apiService.post<AuthResult>('/auth/google', { token });
      
      // Lưu token vào ApiService để tự động đính kèm trong các request sau này
      if (response.success && response.data?.accessToken) {
        apiService.setToken(response.data.accessToken);
        
        // Lưu refresh token nếu có
        if (response.data.refreshToken) {
          localStorage.setItem('refresh_token', response.data.refreshToken);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Google login error:', error);
      return {
        success: false,
        message: 'Đăng nhập với Google thất bại.',
        errorCode: 'GOOGLE_LOGIN_ERROR',
        data: null
      };
    }
  }

  /**
   * Đăng ký tài khoản mới
   */
  public async register(data: RegisterData): Promise<ApiResponse<User>> {
    try {
      return await apiService.post<User>('/auth/register', data);
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'Đăng ký tài khoản thất bại.',
        errorCode: 'REGISTER_ERROR',
        data: null
      };
    }
  }

  /**
   * Đăng xuất
   */
  public async logout(): Promise<ApiResponse<boolean>> {
    try {
      const response = await apiService.post<boolean>('/auth/logout', {});
      
      // Xóa token khỏi ApiService
      apiService.clearToken();
      localStorage.removeItem('refresh_token');
      
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      // Vẫn xóa token mặc dù có lỗi
      apiService.clearToken();
      localStorage.removeItem('refresh_token');
      
      return {
        success: true, // Đánh dấu logout thành công dù server có lỗi
        message: 'Đã đăng xuất khỏi thiết bị này.',
        data: true
      };
    }
  }

  /**
   * Quên mật khẩu - gửi email đặt lại
   */
  public async forgotPassword(email: string): Promise<ApiResponse<boolean>> {
    try {
      return await apiService.post<boolean>('/auth/forgot-password', { email });
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: 'Không thể gửi email đặt lại mật khẩu.',
        errorCode: 'FORGOT_PASSWORD_ERROR',
        data: null
      };
    }
  }

  /**
   * Đặt lại mật khẩu với token
   */
  public async resetPassword(token: string, password: string): Promise<ApiResponse<boolean>> {
    try {
      return await apiService.post<boolean>('/auth/reset-password', {
        token,
        password
      });
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Không thể đặt lại mật khẩu.',
        errorCode: 'RESET_PASSWORD_ERROR',
        data: null
      };
    }
  }

  /**
   * Lấy thông tin người dùng hiện tại
   */
  public async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      return await apiService.get<User>('/auth/me');
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        message: 'Không thể lấy thông tin người dùng.',
        errorCode: 'GET_USER_ERROR',
        data: null
      };
    }
  }

  /**
   * Đổi mật khẩu
   */
  public async changePassword(data: ChangePasswordData): Promise<ApiResponse<boolean>> {
    try {
      return await apiService.post<boolean>('/auth/change-password', data);
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Không thể đổi mật khẩu.',
        errorCode: 'CHANGE_PASSWORD_ERROR',
        data: null
      };
    }
  }

  /**
   * Kích hoạt tài khoản từ email
   */
  public async activateAccount(token: string): Promise<ApiResponse<boolean>> {
    try {
      return await apiService.post<boolean>('/auth/activate', { token });
    } catch (error) {
      console.error('Activate account error:', error);
      return {
        success: false,
        message: 'Không thể kích hoạt tài khoản.',
        errorCode: 'ACTIVATE_ACCOUNT_ERROR',
        data: null
      };
    }
  }

  /**
   * Yêu cầu gửi lại email kích hoạt
   */
  public async resendActivationEmail(email: string): Promise<ApiResponse<boolean>> {
    try {
      return await apiService.post<boolean>('/auth/resend-activation', { email });
    } catch (error) {
      console.error('Resend activation error:', error);
      return {
        success: false,
        message: 'Không thể gửi lại email kích hoạt.',
        errorCode: 'RESEND_ACTIVATION_ERROR',
        data: null
      };
    }
  }

  /**
   * Kiểm tra trạng thái đăng nhập
   */
  public isLoggedIn(): boolean {
    // Kiểm tra token có tồn tại không
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  /**
   * Kiểm tra token có còn hiệu lực không
   */
  public async verifyToken(): Promise<boolean> {
    try {
      const response = await this.getCurrentUser();
      return response.success;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;

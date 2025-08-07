// Export tất cả services từ một file duy nhất để dễ dàng import

// API Services
export { default as apiService } from './apiService';
export { default as backendApi, aiServiceApi, handleApiResponse, getErrorMessage } from './api';

// Core Services
export { default as authService } from './authService';
export { default as userService } from './userService';
export { default as recipeService } from './recipeService';

// Integration Services
export { default as dbIntegrationService } from './dbIntegrationService';
export { default as mobileIntegrationService } from './mobileIntegrationService';
export { default as mySQLService } from './mySQLService';

// AI Services
export { default as aiService } from './aiService';

// Notification Service
export { default as notificationService } from './notificationService';

// Learning Service
export { default as learningService } from './learningService';

// Maps Service
export { GoogleMapsService } from './GoogleMapsService';

// Export các interfaces chính
export type { ApiResponse } from './apiService';
export type { 
  LoginCredentials, 
  RegisterData, 
  ChangePasswordData, 
  AuthResult 
} from './authService';
export type { 
  MobileSyncData, 
  MobileAppConfig 
} from './mobileIntegrationService';

export type {
  MySQLQueryResult,
  MySQLTableInfo,
  MySQLColumnInfo,
  MySQLForeignKeyInfo
} from './mySQLService';

// Export các function tiện ích
export function isAuthenticated(): boolean {
  return localStorage.getItem('auth_token') !== null;
}

export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function getUserLanguage(): string {
  return localStorage.getItem('language') || 'vi';
}

export function setUserLanguage(language: string): void {
  localStorage.setItem('language', language);
}

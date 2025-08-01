import 'package:flutter/foundation.dart';

/// Comprehensive error handling system for Smart Cooking AI
class AppError extends Error {
  final String message;
  final String code;
  final dynamic originalError;
  @override
  final StackTrace? stackTrace;
  final DateTime timestamp;
  final Map<String, dynamic>? metadata;

  AppError({
    required this.message,
    required this.code,
    this.originalError,
    this.stackTrace,
    this.metadata,
  }) : timestamp = DateTime.now();

  factory AppError.network({
    String? message,
    dynamic originalError,
    StackTrace? stackTrace,
  }) {
    return AppError(
      message: message ?? 'Network connection failed',
      code: 'NETWORK_ERROR',
      originalError: originalError,
      stackTrace: stackTrace,
      metadata: {'type': 'network'},
    );
  }

  factory AppError.authentication({
    String? message,
    dynamic originalError,
    StackTrace? stackTrace,
  }) {
    return AppError(
      message: message ?? 'Authentication failed',
      code: 'AUTH_ERROR',
      originalError: originalError,
      stackTrace: stackTrace,
      metadata: {'type': 'authentication'},
    );
  }

  factory AppError.googleOAuth({
    String? message,
    dynamic originalError,
    StackTrace? stackTrace,
  }) {
    return AppError(
      message: message ?? 'Google OAuth failed',
      code: 'GOOGLE_OAUTH_ERROR',
      originalError: originalError,
      stackTrace: stackTrace,
      metadata: {'type': 'google_oauth', 'provider': 'google'},
    );
  }

  factory AppError.api({
    String? message,
    int? statusCode,
    dynamic originalError,
    StackTrace? stackTrace,
  }) {
    return AppError(
      message: message ?? 'API request failed',
      code: 'API_ERROR',
      originalError: originalError,
      stackTrace: stackTrace,
      metadata: {'type': 'api', 'statusCode': statusCode},
    );
  }

  factory AppError.validation({
    String? message,
    String? field,
    dynamic originalError,
    StackTrace? stackTrace,
  }) {
    return AppError(
      message: message ?? 'Validation failed',
      code: 'VALIDATION_ERROR',
      originalError: originalError,
      stackTrace: stackTrace,
      metadata: {'type': 'validation', 'field': field},
    );
  }

  factory AppError.aiService({
    String? message,
    String? service,
    dynamic originalError,
    StackTrace? stackTrace,
  }) {
    return AppError(
      message: message ?? 'AI service failed',
      code: 'AI_SERVICE_ERROR',
      originalError: originalError,
      stackTrace: stackTrace,
      metadata: {'type': 'ai_service', 'service': service},
    );
  }

  factory AppError.voiceRecognition({
    String? message,
    dynamic originalError,
    StackTrace? stackTrace,
  }) {
    return AppError(
      message: message ?? 'Voice recognition failed',
      code: 'VOICE_RECOGNITION_ERROR',
      originalError: originalError,
      stackTrace: stackTrace,
      metadata: {'type': 'voice_recognition'},
    );
  }

  factory AppError.imageProcessing({
    String? message,
    dynamic originalError,
    StackTrace? stackTrace,
  }) {
    return AppError(
      message: message ?? 'Image processing failed',
      code: 'IMAGE_PROCESSING_ERROR',
      originalError: originalError,
      stackTrace: stackTrace,
      metadata: {'type': 'image_processing'},
    );
  }

  factory AppError.storage({
    String? message,
    dynamic originalError,
    StackTrace? stackTrace,
  }) {
    return AppError(
      message: message ?? 'Storage operation failed',
      code: 'STORAGE_ERROR',
      originalError: originalError,
      stackTrace: stackTrace,
      metadata: {'type': 'storage'},
    );
  }

  factory AppError.permission({
    String? message,
    String? permission,
    dynamic originalError,
    StackTrace? stackTrace,
  }) {
    return AppError(
      message: message ?? 'Permission denied',
      code: 'PERMISSION_ERROR',
      originalError: originalError,
      stackTrace: stackTrace,
      metadata: {'type': 'permission', 'permission': permission},
    );
  }

  bool get isNetworkError => code == 'NETWORK_ERROR';
  bool get isAuthError => code == 'AUTH_ERROR';
  bool get isGoogleOAuthError => code == 'GOOGLE_OAUTH_ERROR';
  bool get isApiError => code == 'API_ERROR';
  bool get isValidationError => code == 'VALIDATION_ERROR';
  bool get isAiServiceError => code == 'AI_SERVICE_ERROR';
  bool get isVoiceError => code == 'VOICE_RECOGNITION_ERROR';
  bool get isImageError => code == 'IMAGE_PROCESSING_ERROR';
  bool get isStorageError => code == 'STORAGE_ERROR';
  bool get isPermissionError => code == 'PERMISSION_ERROR';

  String get userFriendlyMessage {
    switch (code) {
      case 'NETWORK_ERROR':
        return 'Không có kết nối mạng. Kiểm tra kết nối và thử lại.';
      case 'AUTH_ERROR':
        return 'Đăng nhập thất bại. Kiểm tra thông tin và thử lại.';
      case 'GOOGLE_OAUTH_ERROR':
        return 'Đăng nhập Google thất bại. Thử lại hoặc sử dụng email/mật khẩu.';
      case 'API_ERROR':
        return 'Lỗi kết nối server. Vui lòng thử lại sau.';
      case 'VALIDATION_ERROR':
        return 'Thông tin không hợp lệ. Kiểm tra và nhập lại.';
      case 'AI_SERVICE_ERROR':
        return 'Dịch vụ AI tạm thời không khả dụng. Thử lại sau.';
      case 'VOICE_RECOGNITION_ERROR':
        return 'Không nhận dạng được giọng nói. Thử nói rõ hơn.';
      case 'IMAGE_PROCESSING_ERROR':
        return 'Không thể xử lý hình ảnh. Thử chọn ảnh khác.';
      case 'STORAGE_ERROR':
        return 'Lỗi lưu trữ dữ liệu. Kiểm tra dung lượng thiết bị.';
      case 'PERMISSION_ERROR':
        return 'Cần cấp quyền để sử dụng tính năng này.';
      default:
        return message;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'message': message,
      'code': code,
      'timestamp': timestamp.toIso8601String(),
      'metadata': metadata,
      'originalError': originalError?.toString(),
    };
  }

  @override
  String toString() {
    final buffer = StringBuffer();
    buffer.writeln('AppError: $code');
    buffer.writeln('Message: $message');
    buffer.writeln('Timestamp: $timestamp');
    if (metadata != null) {
      buffer.writeln('Metadata: $metadata');
    }
    if (originalError != null) {
      buffer.writeln('Original Error: $originalError');
    }
    if (stackTrace != null) {
      buffer.writeln('Stack Trace: $stackTrace');
    }
    return buffer.toString();
  }
}

/// Error handling utility class
class ErrorHandler {
  static void logError(AppError error) {
    if (kDebugMode) {
      print('🚨 ${error.toString()}');
    }

    // In production, send to crash reporting service
    // FirebaseCrashlytics.instance.recordError(error, error.stackTrace);
  }

  static String getLocalizedMessage(AppError error, String languageCode) {
    // Return localized error messages based on language
    if (languageCode == 'en') {
      switch (error.code) {
        case 'NETWORK_ERROR':
          return 'No network connection. Check your connection and try again.';
        case 'AUTH_ERROR':
          return 'Authentication failed. Check your credentials and try again.';
        case 'GOOGLE_OAUTH_ERROR':
          return 'Google sign-in failed. Try again or use email/password.';
        case 'API_ERROR':
          return 'Server connection error. Please try again later.';
        case 'VALIDATION_ERROR':
          return 'Invalid information. Please check and re-enter.';
        case 'AI_SERVICE_ERROR':
          return 'AI service temporarily unavailable. Try again later.';
        case 'VOICE_RECOGNITION_ERROR':
          return 'Voice not recognized. Try speaking more clearly.';
        case 'IMAGE_PROCESSING_ERROR':
          return 'Cannot process image. Try selecting another image.';
        case 'STORAGE_ERROR':
          return 'Data storage error. Check device storage space.';
        case 'PERMISSION_ERROR':
          return 'Permission required to use this feature.';
        default:
          return error.message;
      }
    }

    return error.userFriendlyMessage; // Vietnamese default
  }

  static bool isRetriableError(AppError error) {
    return error.isNetworkError || error.isApiError || error.isAiServiceError;
  }

  static Duration getRetryDelay(int attemptCount) {
    // Exponential backoff
    return Duration(seconds: (2 * attemptCount).clamp(1, 30));
  }
}

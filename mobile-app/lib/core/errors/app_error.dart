// Core error handling system for Smart Cooking AI
// Enhanced error management with localization and user-friendly messages

enum AppErrorType {
  // Authentication errors
  authenticationFailed,
  oauthConfigurationError,
  googleSignInFailed,
  emailSignInFailed,
  registrationFailed,
  peopleApiError,

  // Network errors
  networkError,
  serverError,
  timeoutError,
  noInternetConnection,

  // API errors
  apiError,
  invalidResponse,
  unauthorized,
  forbidden,

  // Data errors
  validationError,
  dataNotFound,
  cachingError,

  // General errors
  unknown,
  configurationError,
  permissionDenied,
}

class AppError {
  final AppErrorType type;
  final String message;
  final String? details;
  final int? statusCode;
  final DateTime timestamp;
  final Map<String, dynamic>? context;

  AppError({
    required this.type,
    required this.message,
    this.details,
    this.statusCode,
    DateTime? timestamp,
    this.context,
  }) : timestamp = timestamp ?? DateTime.now();

  // Factory constructors for common error types
  factory AppError.authentication(String message,
      {String? details, Map<String, dynamic>? context}) {
    return AppError(
      type: AppErrorType.authenticationFailed,
      message: message,
      details: details,
      context: context,
    );
  }

  factory AppError.oauth(String message,
      {String? details, Map<String, dynamic>? context}) {
    return AppError(
      type: AppErrorType.oauthConfigurationError,
      message: message,
      details: details,
      context: context,
    );
  }

  factory AppError.googleSignIn(String message,
      {String? details, Map<String, dynamic>? context}) {
    return AppError(
      type: AppErrorType.googleSignInFailed,
      message: message,
      details: details,
      context: context,
    );
  }

  factory AppError.peopleApi(String message,
      {int? statusCode, String? details, Map<String, dynamic>? context}) {
    return AppError(
      type: AppErrorType.peopleApiError,
      message: message,
      statusCode: statusCode,
      details: details,
      context: context,
    );
  }

  factory AppError.network(String message,
      {String? details, Map<String, dynamic>? context}) {
    return AppError(
      type: AppErrorType.networkError,
      message: message,
      details: details,
      context: context,
    );
  }

  factory AppError.api(String message,
      {int? statusCode, String? details, Map<String, dynamic>? context}) {
    return AppError(
      type: AppErrorType.apiError,
      message: message,
      statusCode: statusCode,
      details: details,
      context: context,
    );
  }

  factory AppError.validation(String message,
      {String? details, Map<String, dynamic>? context}) {
    return AppError(
      type: AppErrorType.validationError,
      message: message,
      details: details,
      context: context,
    );
  }

  factory AppError.unknown(String message,
      {String? details, Map<String, dynamic>? context}) {
    return AppError(
      type: AppErrorType.unknown,
      message: message,
      details: details,
      context: context,
    );
  }

  // Check if error is recoverable
  bool get isRecoverable {
    switch (type) {
      case AppErrorType.networkError:
      case AppErrorType.timeoutError:
      case AppErrorType.serverError:
      case AppErrorType.googleSignInFailed:
      case AppErrorType.peopleApiError:
        return true;
      case AppErrorType.unauthorized:
      case AppErrorType.forbidden:
      case AppErrorType.validationError:
      case AppErrorType.configurationError:
        return false;
      default:
        return true;
    }
  }

  // Get user-friendly error message
  String get userMessage {
    switch (type) {
      case AppErrorType.authenticationFailed:
        return 'Đăng nhập thất bại. Vui lòng thử lại.';
      case AppErrorType.oauthConfigurationError:
        return 'Lỗi cấu hình OAuth. Vui lòng liên hệ hỗ trợ.';
      case AppErrorType.googleSignInFailed:
        return 'Không thể đăng nhập bằng Google. Vui lòng thử lại.';
      case AppErrorType.peopleApiError:
        return 'Lỗi People API. Ứng dụng sẽ tiếp tục với chức năng cơ bản.';
      case AppErrorType.networkError:
        return 'Lỗi kết nối mạng. Vui lòng kiểm tra internet.';
      case AppErrorType.serverError:
        return 'Lỗi máy chủ. Vui lòng thử lại sau.';
      case AppErrorType.noInternetConnection:
        return 'Không có kết nối internet.';
      case AppErrorType.validationError:
        return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
      case AppErrorType.unauthorized:
        return 'Không có quyền truy cập. Vui lòng đăng nhập lại.';
      case AppErrorType.forbidden:
        return 'Truy cập bị từ chối.';
      default:
        return message;
    }
  }

  // Convert to JSON for logging
  Map<String, dynamic> toJson() {
    return {
      'type': type.toString(),
      'message': message,
      'details': details,
      'statusCode': statusCode,
      'timestamp': timestamp.toIso8601String(),
      'context': context,
    };
  }

  @override
  String toString() {
    return 'AppError(type: $type, message: $message, details: $details, statusCode: $statusCode)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is AppError &&
        other.type == type &&
        other.message == message &&
        other.details == details &&
        other.statusCode == statusCode;
  }

  @override
  int get hashCode {
    return Object.hash(type, message, details, statusCode);
  }
}

// Exception class for throwing AppErrors
class AppException implements Exception {
  final AppError error;

  AppException(this.error);

  @override
  String toString() => error.toString();
}

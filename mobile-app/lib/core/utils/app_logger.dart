// Advanced logging system for Smart Cooking AI
// Multi-level logging with categorization and error tracking

import 'dart:developer' as developer;
import 'package:flutter/foundation.dart';
import '../errors/app_error.dart';

enum LogLevel {
  debug,
  info,
  warning,
  error,
  critical,
}

enum LogCategory {
  authentication,
  oauth,
  api,
  network,
  ui,
  performance,
  security,
  general,
}

class AppLogger {
  static const String _appName = 'SmartCookingAI';
  static bool _isEnabled = kDebugMode;

  // Enable/disable logging
  static void setEnabled(bool enabled) {
    _isEnabled = enabled;
  }

  // Main logging method
  static void log(
    String message, {
    LogLevel level = LogLevel.info,
    LogCategory category = LogCategory.general,
    Object? error,
    StackTrace? stackTrace,
    Map<String, dynamic>? context,
  }) {
    if (!_isEnabled) return;

    final timestamp = DateTime.now().toIso8601String();
    final levelStr = level.name.toUpperCase();
    final categoryStr = category.name.toUpperCase();

    final logMessage = '[$timestamp] [$levelStr] [$categoryStr] $message';

    // Add context if provided
    String fullMessage = logMessage;
    if (context != null && context.isNotEmpty) {
      fullMessage += '\nContext: ${context.toString()}';
    }

    // Add error details if provided
    if (error != null) {
      fullMessage += '\nError: ${error.toString()}';
    }

    // Add stack trace for errors
    if (stackTrace != null &&
        (level == LogLevel.error || level == LogLevel.critical)) {
      fullMessage += '\nStack Trace: ${stackTrace.toString()}';
    }

    // Use appropriate logging method based on level
    switch (level) {
      case LogLevel.debug:
        developer.log(fullMessage, name: _appName, level: 500);
        break;
      case LogLevel.info:
        developer.log(fullMessage, name: _appName, level: 800);
        break;
      case LogLevel.warning:
        developer.log(fullMessage, name: _appName, level: 900);
        break;
      case LogLevel.error:
      case LogLevel.critical:
        developer.log(
          fullMessage,
          name: _appName,
          level: 1000,
          error: error,
          stackTrace: stackTrace,
        );
        break;
    }
  }

  // Convenience methods for different log levels
  static void debug(
    String message, {
    LogCategory category = LogCategory.general,
    Map<String, dynamic>? context,
  }) {
    log(message, level: LogLevel.debug, category: category, context: context);
  }

  static void info(
    String message, {
    LogCategory category = LogCategory.general,
    Map<String, dynamic>? context,
  }) {
    log(message, level: LogLevel.info, category: category, context: context);
  }

  static void warning(
    String message, {
    LogCategory category = LogCategory.general,
    Object? error,
    Map<String, dynamic>? context,
  }) {
    log(message,
        level: LogLevel.warning,
        category: category,
        error: error,
        context: context);
  }

  static void error(
    String message, {
    LogCategory category = LogCategory.general,
    Object? error,
    StackTrace? stackTrace,
    Map<String, dynamic>? context,
  }) {
    log(
      message,
      level: LogLevel.error,
      category: category,
      error: error,
      stackTrace: stackTrace,
      context: context,
    );
  }

  static void critical(
    String message, {
    LogCategory category = LogCategory.general,
    Object? error,
    StackTrace? stackTrace,
    Map<String, dynamic>? context,
  }) {
    log(
      message,
      level: LogLevel.critical,
      category: category,
      error: error,
      stackTrace: stackTrace,
      context: context,
    );
  }

  // Specialized logging methods for different categories
  static void auth(
    String message, {
    LogLevel level = LogLevel.info,
    Object? error,
    StackTrace? stackTrace,
    Map<String, dynamic>? context,
  }) {
    log(
      message,
      level: level,
      category: LogCategory.authentication,
      error: error,
      stackTrace: stackTrace,
      context: context,
    );
  }

  static void oauth(
    String message, {
    LogLevel level = LogLevel.info,
    Object? error,
    StackTrace? stackTrace,
    Map<String, dynamic>? context,
  }) {
    log(
      message,
      level: level,
      category: LogCategory.oauth,
      error: error,
      stackTrace: stackTrace,
      context: context,
    );
  }

  static void api(
    String message, {
    LogLevel level = LogLevel.info,
    Object? error,
    StackTrace? stackTrace,
    Map<String, dynamic>? context,
  }) {
    log(
      message,
      level: level,
      category: LogCategory.api,
      error: error,
      stackTrace: stackTrace,
      context: context,
    );
  }

  static void network(
    String message, {
    LogLevel level = LogLevel.info,
    Object? error,
    StackTrace? stackTrace,
    Map<String, dynamic>? context,
  }) {
    log(
      message,
      level: level,
      category: LogCategory.network,
      error: error,
      stackTrace: stackTrace,
      context: context,
    );
  }

  static void ui(
    String message, {
    LogLevel level = LogLevel.info,
    Object? error,
    Map<String, dynamic>? context,
  }) {
    log(
      message,
      level: level,
      category: LogCategory.ui,
      error: error,
      context: context,
    );
  }

  static void performance(
    String message, {
    LogLevel level = LogLevel.info,
    Map<String, dynamic>? context,
  }) {
    log(
      message,
      level: level,
      category: LogCategory.performance,
      context: context,
    );
  }

  static void security(
    String message, {
    LogLevel level = LogLevel.warning,
    Object? error,
    StackTrace? stackTrace,
    Map<String, dynamic>? context,
  }) {
    log(
      message,
      level: level,
      category: LogCategory.security,
      error: error,
      stackTrace: stackTrace,
      context: context,
    );
  }

  // Log AppError objects
  static void logAppError(
    AppError appError, {
    String? additionalMessage,
    StackTrace? stackTrace,
  }) {
    final message = additionalMessage != null
        ? '$additionalMessage: ${appError.message}'
        : appError.message;

    final category = _getCategoryFromErrorType(appError.type);
    final level = _getLevelFromErrorType(appError.type);

    log(
      message,
      level: level,
      category: category,
      error: appError,
      stackTrace: stackTrace,
      context: appError.context,
    );
  }

  // Helper methods to map error types to log categories and levels
  static LogCategory _getCategoryFromErrorType(AppErrorType errorType) {
    switch (errorType) {
      case AppErrorType.authenticationFailed:
      case AppErrorType.emailSignInFailed:
      case AppErrorType.registrationFailed:
        return LogCategory.authentication;
      case AppErrorType.oauthConfigurationError:
      case AppErrorType.googleSignInFailed:
      case AppErrorType.peopleApiError:
        return LogCategory.oauth;
      case AppErrorType.networkError:
      case AppErrorType.timeoutError:
      case AppErrorType.noInternetConnection:
        return LogCategory.network;
      case AppErrorType.apiError:
      case AppErrorType.invalidResponse:
      case AppErrorType.serverError:
        return LogCategory.api;
      case AppErrorType.unauthorized:
      case AppErrorType.forbidden:
      case AppErrorType.permissionDenied:
        return LogCategory.security;
      default:
        return LogCategory.general;
    }
  }

  static LogLevel _getLevelFromErrorType(AppErrorType errorType) {
    switch (errorType) {
      case AppErrorType.configurationError:
      case AppErrorType.oauthConfigurationError:
        return LogLevel.critical;
      case AppErrorType.authenticationFailed:
      case AppErrorType.googleSignInFailed:
      case AppErrorType.networkError:
      case AppErrorType.serverError:
      case AppErrorType.apiError:
        return LogLevel.error;
      case AppErrorType.peopleApiError:
      case AppErrorType.timeoutError:
      case AppErrorType.validationError:
        return LogLevel.warning;
      case AppErrorType.cachingError:
        return LogLevel.info;
      default:
        return LogLevel.error;
    }
  }

  // Utility method to log performance metrics
  static void logPerformance(String operation, Duration duration,
      {Map<String, dynamic>? context}) {
    final perfContext = {
      'operation': operation,
      'duration_ms': duration.inMilliseconds,
      'duration_human': '${duration.inMilliseconds}ms',
      ...?context,
    };

    performance('Performance: $operation took ${duration.inMilliseconds}ms',
        context: perfContext);
  }

  // Method to log with execution time
  static Future<T> logExecution<T>(
    String operation,
    Future<T> Function() function, {
    LogCategory category = LogCategory.performance,
    Map<String, dynamic>? context,
  }) async {
    final stopwatch = Stopwatch()..start();

    try {
      info('Starting: $operation', category: category, context: context);
      final result = await function();
      stopwatch.stop();

      final perfContext = {
        'operation': operation,
        'duration_ms': stopwatch.elapsedMilliseconds,
        'success': true,
        ...?context,
      };

      info('Completed: $operation in ${stopwatch.elapsedMilliseconds}ms',
          category: category, context: perfContext);

      return result;
    } catch (e, stackTrace) {
      stopwatch.stop();

      final errorContext = {
        'operation': operation,
        'duration_ms': stopwatch.elapsedMilliseconds,
        'success': false,
        'error_type': e.runtimeType.toString(),
        ...?context,
      };

      error('Failed: $operation after ${stopwatch.elapsedMilliseconds}ms',
          category: category,
          error: e,
          stackTrace: stackTrace,
          context: errorContext);

      rethrow;
    }
  }
}

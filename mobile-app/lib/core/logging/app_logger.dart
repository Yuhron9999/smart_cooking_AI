import 'package:flutter/foundation.dart';
import '../../config/app_config.dart';

/// Comprehensive logging system for Smart Cooking AI
enum LogLevel { debug, info, warning, error, critical }

class AppLogger {
  static final AppLogger _instance = AppLogger._internal();
  factory AppLogger() => _instance;
  AppLogger._internal();

  static const String _logPrefix = '🍳 Smart Cooking AI';

  // Log levels with emojis for better visibility
  static const Map<LogLevel, String> _levelEmojis = {
    LogLevel.debug: '🐛',
    LogLevel.info: 'ℹ️',
    LogLevel.warning: '⚠️',
    LogLevel.error: '❌',
    LogLevel.critical: '🚨',
  };

  static const Map<LogLevel, String> _levelNames = {
    LogLevel.debug: 'DEBUG',
    LogLevel.info: 'INFO',
    LogLevel.warning: 'WARNING',
    LogLevel.error: 'ERROR',
    LogLevel.critical: 'CRITICAL',
  };

  /// Log debug messages (only in debug mode)
  static void debug(String message, {String? tag, dynamic data}) {
    if (AppConfig.enableLogging && kDebugMode) {
      _log(LogLevel.debug, message, tag: tag, data: data);
    }
  }

  /// Log info messages
  static void info(String message, {String? tag, dynamic data}) {
    if (AppConfig.enableLogging) {
      _log(LogLevel.info, message, tag: tag, data: data);
    }
  }

  /// Log warning messages
  static void warning(String message, {String? tag, dynamic data}) {
    if (AppConfig.enableLogging) {
      _log(LogLevel.warning, message, tag: tag, data: data);
    }
  }

  /// Log error messages
  static void error(String message,
      {String? tag, dynamic data, dynamic error, StackTrace? stackTrace}) {
    if (AppConfig.enableLogging) {
      _log(LogLevel.error, message,
          tag: tag, data: data, error: error, stackTrace: stackTrace);
    }
  }

  /// Log critical messages (always logged)
  static void critical(String message,
      {String? tag, dynamic data, dynamic error, StackTrace? stackTrace}) {
    _log(LogLevel.critical, message,
        tag: tag, data: data, error: error, stackTrace: stackTrace);
  }

  /// Core logging method
  static void _log(
    LogLevel level,
    String message, {
    String? tag,
    dynamic data,
    dynamic error,
    StackTrace? stackTrace,
  }) {
    final timestamp = DateTime.now().toIso8601String();
    final emoji = _levelEmojis[level] ?? '';
    final levelName = _levelNames[level] ?? 'UNKNOWN';
    final tagStr = tag != null ? '[$tag]' : '';

    final logMessage =
        '$_logPrefix $emoji $levelName $timestamp $tagStr $message';

    // Print to console
    if (kDebugMode) {
      print(logMessage);

      if (data != null) {
        print('  Data: $data');
      }

      if (error != null) {
        print('  Error: $error');
      }

      if (stackTrace != null) {
        print('  Stack Trace: $stackTrace');
      }
    }

    // In production, send to logging service
    if (AppConfig.isProduction &&
        (level == LogLevel.error || level == LogLevel.critical)) {
      _sendToLoggingService({
        'level': levelName,
        'message': message,
        'tag': tag,
        'timestamp': timestamp,
        'data': data?.toString(),
        'error': error?.toString(),
        'stackTrace': stackTrace?.toString(),
      });
    }
  }

  /// Send logs to external logging service in production
  static void _sendToLoggingService(Map<String, dynamic> logData) {
    // TODO: Implement external logging service integration
    // Examples: Firebase Crashlytics, Sentry, LogRocket, etc.
  }

  /// Specialized logging methods for different app features

  static void auth(String message, {dynamic data}) {
    info(message, tag: 'AUTH', data: data);
  }

  static void authError(String message,
      {dynamic error, StackTrace? stackTrace}) {
    AppLogger.error(message, tag: 'AUTH', error: error, stackTrace: stackTrace);
  }

  static void googleOAuth(String message, {dynamic data}) {
    info(message, tag: 'GOOGLE_OAUTH', data: data);
  }

  static void googleOAuthError(String message,
      {dynamic error, StackTrace? stackTrace}) {
    AppLogger.error(message,
        tag: 'GOOGLE_OAUTH', error: error, stackTrace: stackTrace);
  }

  static void api(String message, {dynamic data}) {
    debug(message, tag: 'API', data: data);
  }

  static void apiError(String message,
      {dynamic error, StackTrace? stackTrace}) {
    AppLogger.error(message, tag: 'API', error: error, stackTrace: stackTrace);
  }

  static void ai(String message, {dynamic data}) {
    info(message, tag: 'AI_SERVICE', data: data);
  }

  static void aiError(String message, {dynamic error, StackTrace? stackTrace}) {
    AppLogger.error(message,
        tag: 'AI_SERVICE', error: error, stackTrace: stackTrace);
  }

  static void voice(String message, {dynamic data}) {
    debug(message, tag: 'VOICE', data: data);
  }

  static void voiceError(String message,
      {dynamic error, StackTrace? stackTrace}) {
    AppLogger.error(message,
        tag: 'VOICE', error: error, stackTrace: stackTrace);
  }

  static void image(String message, {dynamic data}) {
    debug(message, tag: 'IMAGE', data: data);
  }

  static void imageError(String message,
      {dynamic error, StackTrace? stackTrace}) {
    AppLogger.error(message,
        tag: 'IMAGE', error: error, stackTrace: stackTrace);
  }

  static void recipe(String message, {dynamic data}) {
    debug(message, tag: 'RECIPE', data: data);
  }

  static void recipeError(String message,
      {dynamic error, StackTrace? stackTrace}) {
    AppLogger.error(message,
        tag: 'RECIPE', error: error, stackTrace: stackTrace);
  }

  static void navigation(String message, {dynamic data}) {
    debug(message, tag: 'NAVIGATION', data: data);
  }

  static void performance(String message, {dynamic data}) {
    info(message, tag: 'PERFORMANCE', data: data);
  }

  static void network(String message, {dynamic data}) {
    debug(message, tag: 'NETWORK', data: data);
  }

  static void networkError(String message,
      {dynamic error, StackTrace? stackTrace}) {
    AppLogger.error(message,
        tag: 'NETWORK', error: error, stackTrace: stackTrace);
  }

  /// Log app lifecycle events
  static void appLifecycle(String event, {dynamic data}) {
    info('App lifecycle: $event', tag: 'LIFECYCLE', data: data);
  }

  /// Log user actions for analytics
  static void userAction(String action, {Map<String, dynamic>? parameters}) {
    info('User action: $action', tag: 'USER_ACTION', data: parameters);
  }

  /// Log feature usage
  static void featureUsage(String feature, {Map<String, dynamic>? context}) {
    info('Feature used: $feature', tag: 'FEATURE_USAGE', data: context);
  }

  /// Performance monitoring
  static void startTimer(String operation) {
    debug('Timer started: $operation', tag: 'TIMER');
  }

  static void endTimer(String operation, Duration duration) {
    debug('Timer ended: $operation - ${duration.inMilliseconds}ms',
        tag: 'TIMER');
  }

  /// Memory usage monitoring
  static void memoryUsage(String context) {
    if (kDebugMode) {
      // TODO: Implement memory usage monitoring
      debug('Memory check: $context', tag: 'MEMORY');
    }
  }

  /// Device information logging
  static void deviceInfo(Map<String, dynamic> deviceData) {
    info('Device info collected', tag: 'DEVICE', data: deviceData);
  }

  /// Crash reporting
  static void crashReport(dynamic error, StackTrace stackTrace,
      {Map<String, dynamic>? context}) {
    critical(
      'App crash detected',
      tag: 'CRASH',
      data: context,
      error: error,
      stackTrace: stackTrace,
    );
  }
}

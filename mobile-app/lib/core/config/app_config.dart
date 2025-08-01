// Comprehensive application configuration for Smart Cooking AI
// Environment-specific settings and feature flags

import 'package:flutter/foundation.dart';

enum Environment {
  development,
  staging,
  production,
}

class AppConfig {
  // Current environment
  static const Environment currentEnvironment =
      kDebugMode ? Environment.development : Environment.production;

  // App Information
  static const String appName = 'Smart Cooking AI';
  static const String appVersion = '1.0.0';
  static const String buildNumber = '1';

  // API Configuration
  static const String _devApiUrl = 'http://localhost:8080';
  static const String _stagingApiUrl = 'https://staging-api.smartcooking.ai';
  static const String _prodApiUrl = 'https://api.smartcooking.ai';

  static String get apiUrl {
    switch (currentEnvironment) {
      case Environment.development:
        return _devApiUrl;
      case Environment.staging:
        return _stagingApiUrl;
      case Environment.production:
        return _prodApiUrl;
    }
  }

  // AI Service Configuration
  static const String _devAIServiceUrl = 'http://localhost:8001';
  static const String _stagingAIServiceUrl =
      'https://staging-ai.smartcooking.ai';
  static const String _prodAIServiceUrl = 'https://ai.smartcooking.ai';

  static String get aiServiceUrl {
    switch (currentEnvironment) {
      case Environment.development:
        return _devAIServiceUrl;
      case Environment.staging:
        return _stagingAIServiceUrl;
      case Environment.production:
        return _prodAIServiceUrl;
    }
  }

  // WebSocket Configuration
  static String get wsUrl {
    final baseUrl = apiUrl.replaceFirst('http', 'ws');
    return '$baseUrl/ws';
  }

  // Feature Flags
  static const bool enableVoiceAssistant = true;
  static const bool enableAIChat = true;
  static const bool enableImageRecognition = true;
  static const bool enableLearningPaths = true;
  static const bool enableAnalytics = true;
  static const bool enableCrashReporting = !kDebugMode;
  static const bool enablePerformanceMonitoring = true;
  static const bool enableOfflineMode = true;
  static const bool enableLocationFeatures = true;
  static const bool enablePushNotifications = true;

  // Development Features
  static const bool enableMockAuthentication = kDebugMode;
  static const bool enableDebugLogging = kDebugMode;
  static const bool enableNetworkLogging = kDebugMode;
  static const bool showDebugInfo = kDebugMode;

  // Timeout Configuration (in seconds)
  static const int connectionTimeout = 30;
  static const int receiveTimeout = 30;
  static const int sendTimeout = 30;

  // Cache Configuration
  static const int maxCacheSize = 100 * 1024 * 1024; // 100MB
  static const int cacheExpirationHours = 24;

  // Media Configuration
  static const int maxImageSize = 5 * 1024 * 1024; // 5MB
  static const int maxVideoSize = 50 * 1024 * 1024; // 50MB
  static const List<String> supportedImageFormats = [
    'jpg',
    'jpeg',
    'png',
    'webp'
  ];
  static const List<String> supportedVideoFormats = ['mp4', 'mov', 'avi'];

  // Pagination Configuration
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;

  // Security Configuration
  static const int sessionTimeoutMinutes = 60;
  static const int maxLoginAttempts = 5;
  static const int lockoutDurationMinutes = 15;

  // Validation Configuration
  static const int minPasswordLength = 8;
  static const int maxPasswordLength = 128;
  static const int minUsernameLength = 3;
  static const int maxUsernameLength = 50;

  // UI Configuration
  static const double defaultBorderRadius = 12.0;
  static const double defaultPadding = 16.0;
  static const double defaultMargin = 8.0;
  static const Duration defaultAnimationDuration = Duration(milliseconds: 300);

  // Localization Configuration
  static const String defaultLanguage = 'vi';
  static const List<String> supportedLanguages = ['vi', 'en', 'ja', 'ko', 'zh'];
  static const String fallbackLanguage = 'en';

  // Voice Configuration
  static const double defaultSpeechRate = 1.0;
  static const double defaultSpeechPitch = 1.0;
  static const double defaultSpeechVolume = 1.0;
  static const Duration maxRecordingDuration = Duration(minutes: 5);

  // AI Configuration
  static const int maxChatHistoryLength = 100;
  static const int maxRecipeIngredientsCount = 50;
  static const Duration aiResponseTimeout = Duration(seconds: 30);

  // Network Configuration
  static const int maxRetryAttempts = 3;
  static const Duration retryDelay = Duration(seconds: 2);

  // Storage Configuration
  static const String databaseName = 'smart_cooking_ai.db';
  static const int databaseVersion = 1;

  // Analytics Configuration
  static const bool enableUserAnalytics = !kDebugMode;
  static const bool enablePerformanceAnalytics = !kDebugMode;
  static const bool enableErrorAnalytics = true;

  // Push Notification Configuration
  static const String fcmVapidKey = 'YOUR_VAPID_KEY_HERE';

  // Deep Link Configuration
  static const String appScheme = 'smartcooking';
  static const String universalLinkHost = 'smartcooking.ai';

  // Social Sharing Configuration
  static const String shareUrl = 'https://smartcooking.ai/recipe/';
  static const String appStoreUrl =
      'https://apps.apple.com/app/smart-cooking-ai';
  static const String playStoreUrl =
      'https://play.google.com/store/apps/details?id=com.smartcooking.ai';

  // Helper methods
  static bool get isDevelopment =>
      currentEnvironment == Environment.development;
  static bool get isStaging => currentEnvironment == Environment.staging;
  static bool get isProduction => currentEnvironment == Environment.production;

  static bool get isDebugMode => kDebugMode;
  static bool get isReleaseMode => kReleaseMode;
  static bool get isProfileMode => kProfileMode;

  // Environment info
  static Map<String, dynamic> get environmentInfo => {
        'environment': currentEnvironment.name,
        'apiUrl': apiUrl,
        'aiServiceUrl': aiServiceUrl,
        'isDebug': isDebugMode,
        'appVersion': appVersion,
        'buildNumber': buildNumber,
      };

  // Feature flag helper
  static bool isFeatureEnabled(String feature) {
    switch (feature.toLowerCase()) {
      case 'voice_assistant':
        return enableVoiceAssistant;
      case 'ai_chat':
        return enableAIChat;
      case 'image_recognition':
        return enableImageRecognition;
      case 'learning_paths':
        return enableLearningPaths;
      case 'analytics':
        return enableAnalytics;
      case 'offline_mode':
        return enableOfflineMode;
      case 'location_features':
        return enableLocationFeatures;
      case 'push_notifications':
        return enablePushNotifications;
      case 'mock_authentication':
        return enableMockAuthentication;
      default:
        return false;
    }
  }

  // Configuration validation
  static bool validateConfiguration() {
    try {
      // Check required configurations
      if (apiUrl.isEmpty) return false;
      if (aiServiceUrl.isEmpty) return false;
      if (appName.isEmpty) return false;
      if (appVersion.isEmpty) return false;

      // Check timeout values
      if (connectionTimeout <= 0) return false;
      if (receiveTimeout <= 0) return false;
      if (sendTimeout <= 0) return false;

      // Check cache configuration
      if (maxCacheSize <= 0) return false;
      if (cacheExpirationHours <= 0) return false;

      // Check pagination configuration
      if (defaultPageSize <= 0 || defaultPageSize > maxPageSize) return false;

      return true;
    } catch (e) {
      return false;
    }
  }

  // Get configuration summary for debugging
  static Map<String, dynamic> getConfigSummary() {
    return {
      'app': {
        'name': appName,
        'version': appVersion,
        'buildNumber': buildNumber,
        'environment': currentEnvironment.name,
      },
      'api': {
        'apiUrl': apiUrl,
        'aiServiceUrl': aiServiceUrl,
        'wsUrl': wsUrl,
      },
      'features': {
        'voiceAssistant': enableVoiceAssistant,
        'aiChat': enableAIChat,
        'imageRecognition': enableImageRecognition,
        'learningPaths': enableLearningPaths,
        'analytics': enableAnalytics,
        'offlineMode': enableOfflineMode,
        'locationFeatures': enableLocationFeatures,
      },
      'timeouts': {
        'connection': connectionTimeout,
        'receive': receiveTimeout,
        'send': sendTimeout,
      },
      'development': {
        'mockAuth': enableMockAuthentication,
        'debugLogging': enableDebugLogging,
        'networkLogging': enableNetworkLogging,
        'showDebugInfo': showDebugInfo,
      },
    };
  }
}

// Google OAuth Configuration
class GoogleOAuthConfig {
  // Real Google OAuth Client ID from Google Cloud Console
  static const String clientId =
      '638702620723-ou1fc8t9laggt8cc5nf4infb0r4m19i2.apps.googleusercontent.com';

  // OAuth Scopes
  static const List<String> scopes = [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  // Optional: People API scope (may require additional setup)
  static const String peopleApiScope =
      'https://www.googleapis.com/auth/user.birthday.read';

  // OAuth Configuration
  static const String authUrl = 'https://accounts.google.com/oauth/authorize';
  static const String tokenUrl = 'https://oauth2.googleapis.com/token';
  static const String revokeUrl = 'https://oauth2.googleapis.com/revoke';
  static const String userInfoUrl =
      'https://www.googleapis.com/oauth2/v2/userinfo';
  static const String peopleApiUrl =
      'https://people.googleapis.com/v1/people/me';

  // Redirect URIs (configured in Google Cloud Console)
  static const List<String> redirectUris = [
    'http://localhost:3002',
    'https://smartcooking.ai',
  ];

  // JavaScript origins (configured in Google Cloud Console)
  static const List<String> javascriptOrigins = [
    'http://localhost:3002',
    'https://smartcooking.ai',
  ];

  // Helper methods
  static bool get isConfigured =>
      clientId.isNotEmpty && clientId != 'YOUR_GOOGLE_CLIENT_ID';

  static Map<String, dynamic> get configInfo => {
        'clientId': clientId,
        'isConfigured': isConfigured,
        'scopes': scopes,
        'redirectUris': redirectUris,
        'javascriptOrigins': javascriptOrigins,
      };
}

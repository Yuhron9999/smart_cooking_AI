/// Smart Cooking AI - Application Configuration
/// Centralized configuration management for the entire app
class AppConfig {
  // App Information
  static const String appName = 'Smart Cooking AI';
  static const String appVersion = '1.0.0';
  static const String appTagline = 'Hệ thống nấu ăn thông minh';

  // API Configuration
  static const String baseApiUrl = 'http://localhost:8080/api';
  static const String aiServiceUrl = 'http://localhost:8001/api';

  // Google OAuth Configuration
  static const String googleClientId =
      '638702620723-ou1fc8t9laggt8cc5nf4infb0r4m19i2.apps.googleusercontent.com';
  static const String googleProjectId = 'tactical-orbit-431412-v1';

  // Environment Configuration
  static const bool isDebugMode =
      bool.fromEnvironment('DEBUG_MODE', defaultValue: true);
  static const bool isProduction = !isDebugMode;

  // Network Configuration
  static const int httpTimeoutSeconds = 30;
  static const int maxRetryAttempts = 3;

  // Localization Configuration
  static const String defaultLanguage = 'vi';
  static const List<String> supportedLanguages = ['vi', 'en', 'ja', 'ko', 'zh'];

  // Storage Configuration
  static const String authTokenKey = 'auth_token';
  static const String userDataKey = 'user_data';
  static const String languagePreferenceKey = 'language_preference';
  static const String themePreferenceKey = 'theme_preference';

  // AI Features Configuration
  static const List<String> aiFeatures = [
    'recipe_generation',
    'image_recognition',
    'voice_assistant',
    'nutrition_analysis',
    'regional_suggestions',
  ];

  // Voice Assistant Configuration
  static const List<String> supportedVoiceLanguages = [
    'vi-VN',
    'en-US',
    'ja-JP'
  ];
  static const int maxRecordingDurationSeconds = 60;

  // Recipe Configuration
  static const List<String> difficultyLevels = ['EASY', 'MEDIUM', 'HARD'];
  static const List<String> mealCategories = [
    'breakfast',
    'lunch',
    'dinner',
    'dessert',
    'snack',
    'beverage'
  ];
  static const List<String> vietnamRegions = [
    'mien_bac',
    'mien_trung',
    'mien_nam'
  ];

  // Image Configuration
  static const int maxImageSizeBytes = 5 * 1024 * 1024; // 5MB
  static const List<String> supportedImageFormats = [
    'jpg',
    'jpeg',
    'png',
    'webp'
  ];

  // Pagination Configuration
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;

  // Cache Configuration
  static const Duration cacheExpiration = Duration(minutes: 30);
  static const int maxCacheSize = 100;

  // Animation Configuration
  static const Duration defaultAnimationDuration = Duration(milliseconds: 300);
  static const Duration splashScreenDuration = Duration(seconds: 2);

  // Color Scheme
  static const Map<String, int> primaryColors = {
    'green': 0xFF4CAF50,
    'orange': 0xFFFF9800,
    'red': 0xFFF44336,
    'blue': 0xFF2196F3,
  };

  // Development Configuration
  static const bool enableLogging = isDebugMode;
  static const bool enablePerformanceMonitoring = true;
  static const bool enableCrashReporting = isProduction;

  // Security Configuration
  static const Duration jwtTokenExpiration = Duration(hours: 24);
  static const int maxLoginAttempts = 5;
  static const Duration loginCooldown = Duration(minutes: 15);

  // Feature Flags
  static const Map<String, bool> featureFlags = {
    'voice_assistant': true,
    'ai_recipe_generation': true,
    'image_recognition': true,
    'social_sharing': false, // Coming soon
    'offline_mode': false, // Coming soon
    'premium_features': false, // Coming soon
  };

  // Analytics Configuration
  static const bool enableAnalytics = isProduction;
  static const List<String> trackingEvents = [
    'user_login',
    'recipe_generated',
    'voice_command_used',
    'image_analyzed',
    'recipe_shared',
  ];

  // Helper Methods
  static bool isFeatureEnabled(String feature) {
    return featureFlags[feature] ?? false;
  }

  static String getApiUrl(String endpoint) {
    return '$baseApiUrl/$endpoint';
  }

  static String getAiServiceUrl(String endpoint) {
    return '$aiServiceUrl/$endpoint';
  }

  static bool isValidLanguage(String language) {
    return supportedLanguages.contains(language);
  }

  static String getDefaultImageUrl() {
    return 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Smart+Cooking+AI';
  }

  // Environment-specific configuration
  static Map<String, dynamic> get environmentConfig {
    if (isProduction) {
      return {
        'apiUrl': 'https://api.smartcookingai.com/api',
        'aiServiceUrl': 'https://ai.smartcookingai.com/api',
        'enableDebugLogs': false,
        'enableMockData': false,
      };
    } else {
      return {
        'apiUrl': baseApiUrl,
        'aiServiceUrl': aiServiceUrl,
        'enableDebugLogs': true,
        'enableMockData': true,
      };
    }
  }
}

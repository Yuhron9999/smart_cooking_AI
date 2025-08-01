class AppConstants {
  // API Configuration
  static const String baseUrl = String.fromEnvironment(
    'BASE_URL',
    defaultValue: 'http://localhost:8080',
  );

  static const String aiServiceUrl = String.fromEnvironment(
    'AI_SERVICE_URL',
    defaultValue: 'http://localhost:8001',
  );

  // Google API Configuration
  static const String googleApiKey = String.fromEnvironment(
    'GOOGLE_API_KEY',
    defaultValue: 'your-google-api-key-here',
  );

  // Google OAuth2 Configuration
  static const String googleOAuthClientId = String.fromEnvironment(
    'GOOGLE_OAUTH_CLIENT_ID',
    defaultValue: 'your-google-oauth-client-id.apps.googleusercontent.com',
  );

  // OpenAI Configuration (for direct client calls if needed)
  static const String openaiApiKey = String.fromEnvironment(
    'OPENAI_API_KEY',
    defaultValue: 'sk-replace-with-your-actual-openai-api-key',
  );

  // App Configuration
  static const String appName = 'Smart Cooking AI';
  static const String appVersion = '1.0.0';

  // Shared Preferences Keys
  static const String authTokenKey = 'auth_token';
  static const String userIdKey = 'user_id';
  static const String languageKey = 'language_preference';
  static const String themeKey = 'theme_preference';

  // Default Values
  static const String defaultLanguage = 'vi';
  static const String defaultTheme = 'light';

  // API Endpoints
  static const String authEndpoint = '/api/auth';
  static const String recipesEndpoint = '/api/recipes';
  static const String aiEndpoint = '/api/ai';
  static const String userEndpoint = '/api/user';

  // AI Features
  static const String aiChatEndpoint = '/api/ai/chat';
  static const String aiRecipeGenerationEndpoint = '/api/ai/generate-recipe';
  static const String aiImageAnalysisEndpoint = '/api/ai/analyze-image';

  // Google Services
  static const String googleMapsApiUrl = 'https://maps.googleapis.com/maps/api';
  static const String googlePlacesApiUrl = 'https://places.googleapis.com/v1';

  // Feature Flags
  static const bool enableVoiceFeatures = true;
  static const bool enableLocationFeatures = true;
  static const bool enableAIFeatures = true;
  static const bool enableGoogleSignIn = true;

  // Image Upload Configuration
  static const int maxImageSizeBytes = 10 * 1024 * 1024; // 10MB
  static const List<String> allowedImageExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'webp'
  ];

  // Voice Configuration
  static const Duration voiceRecordingMaxDuration = Duration(minutes: 2);
  static const double voiceRecordingThreshold = 0.5;

  // Location Configuration
  static const double defaultLatitude = 21.0285; // Hanoi
  static const double defaultLongitude = 105.8542; // Hanoi
  static const double locationAccuracyThreshold = 100.0; // meters

  // Cache Configuration
  static const Duration cacheExpiryDuration = Duration(hours: 24);
  static const int maxCacheSize = 100; // number of items

  // Debug Configuration
  static const bool isDebugMode =
      bool.fromEnvironment('DEBUG', defaultValue: true);
  static const bool enableLogging =
      bool.fromEnvironment('ENABLE_LOGGING', defaultValue: true);

  // Error Messages
  static const Map<String, String> errorMessages = {
    'network_error': 'Lỗi kết nối mạng. Vui lòng thử lại.',
    'auth_error': 'Lỗi xác thực. Vui lòng đăng nhập lại.',
    'api_error': 'Lỗi API. Vui lòng thử lại sau.',
    'validation_error': 'Dữ liệu không hợp lệ.',
    'unknown_error': 'Đã xảy ra lỗi không xác định.',
  };

  // Success Messages
  static const Map<String, String> successMessages = {
    'login_success': 'Đăng nhập thành công!',
    'logout_success': 'Đăng xuất thành công!',
    'recipe_saved': 'Công thức đã được lưu!',
    'profile_updated': 'Hồ sơ đã được cập nhật!',
  };
}

// Environment-specific configuration
class EnvironmentConfig {
  static bool get isDevelopment =>
      const String.fromEnvironment('FLUTTER_ENV') == 'development';

  static bool get isProduction =>
      const String.fromEnvironment('FLUTTER_ENV') == 'production';

  static bool get isStaging =>
      const String.fromEnvironment('FLUTTER_ENV') == 'staging';

  // Get appropriate base URL based on environment
  static String get apiBaseUrl {
    if (isProduction) {
      return 'https://api.smartcooking.ai';
    } else if (isStaging) {
      return 'https://staging-api.smartcooking.ai';
    } else {
      return AppConstants.baseUrl; // Development
    }
  }

  // Get appropriate AI service URL based on environment
  static String get aiServiceBaseUrl {
    if (isProduction) {
      return 'https://ai.smartcooking.ai';
    } else if (isStaging) {
      return 'https://staging-ai.smartcooking.ai';
    } else {
      return AppConstants.aiServiceUrl; // Development
    }
  }
}

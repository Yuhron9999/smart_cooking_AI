import 'package:flutter/material.dart';

class AppConstants {
  // App Info
  static const String appName = 'Smart Cooking AI';
  static const String appVersion = '1.0.0';
  static const String appDescription =
      'Hệ thống nấu ăn thông minh với AI và Voice Assistant';

  // API Configuration
  static const String baseUrl = 'http://localhost:8080/api';
  static const String aiServiceUrl = 'http://localhost:8001/api';

  // API Endpoints
  static const String authEndpoint = '/auth';
  static const String userEndpoint = '/user';
  static const String recipeEndpoint = '/recipes';
  static const String aiEndpoint = '/ai';
  static const String voiceEndpoint = '/voice';
  static const String nutritionEndpoint = '/nutrition';
  static const String locationEndpoint = '/location';

  // Storage Keys
  static const String accessTokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userDataKey = 'user_data';
  static const String languageKey = 'language';
  static const String themeKey = 'theme';
  static const String onboardingKey = 'onboarding_completed';

  // Hive Box Names
  static const String userBox = 'user_box';
  static const String recipeBox = 'recipe_box';
  static const String cacheBox = 'cache_box';
  static const String settingsBox = 'settings_box';

  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 50;

  // Image Configuration
  static const int maxImageSize = 5 * 1024 * 1024; // 5MB
  static const double imageQuality = 0.8;
  static const List<String> supportedImageFormats = [
    'jpg',
    'jpeg',
    'png',
    'webp'
  ];

  // Voice Configuration
  static const Duration maxRecordingDuration = Duration(minutes: 5);
  static const Duration speechTimeout = Duration(seconds: 30);

  // Animation Durations
  static const Duration shortAnimation = Duration(milliseconds: 200);
  static const Duration mediumAnimation = Duration(milliseconds: 300);
  static const Duration longAnimation = Duration(milliseconds: 500);

  // Spacing Constants
  static const double spacingXs = 4.0;
  static const double spacingSm = 8.0;
  static const double spacingMd = 16.0;
  static const double spacingLg = 24.0;
  static const double spacingXl = 32.0;
  static const double spacingXxl = 48.0;

  // Colors
  static const Color primaryColor = Color(0xFF2E7D4A);
  static const Color secondaryColor = Color(0xFF8BC34A);
  static const Color accentColor = Color(0xFFFF9800);
  static const Color backgroundColor = Color(0xFFF5F5F5);
  static const Color surfaceColor = Color(0xFFFFFFFF);
  static const Color errorColor = Color(0xFFE53E3E);
  static const Color warningColor = Color(0xFFECC94B);
  static const Color successColor = Color(0xFF38A169);
  static const Color infoColor = Color(0xFF3182CE);

  // Timeouts
  static const Duration connectionTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);

  // Cache
  static const Duration cacheValidDuration = Duration(hours: 24);
  static const int maxCacheSize = 100 * 1024 * 1024; // 100MB

  // Recipe Categories
  static const List<String> recipeCategories = [
    'breakfast',
    'lunch',
    'dinner',
    'dessert',
    'snack',
    'beverage',
    'appetizer',
    'main_course',
    'side_dish',
    'soup',
    'salad',
    'vegetarian',
    'vegan',
    'gluten_free'
  ];

  // Difficulty Levels
  static const List<String> difficultyLevels = ['easy', 'medium', 'hard'];

  // Cooking Methods
  static const List<String> cookingMethods = [
    'baking',
    'boiling',
    'frying',
    'grilling',
    'steaming',
    'stir_frying',
    'roasting',
    'braising',
    'sauteing',
    'poaching'
  ];

  // Regional Cuisines
  static const List<String> regionalCuisines = [
    'mien_bac', // Miền Bắc
    'mien_trung', // Miền Trung
    'mien_nam', // Miền Nam
    'asian',
    'european',
    'american',
    'international'
  ];

  // Diet Types
  static const List<String> dietTypes = [
    'omnivore',
    'vegetarian',
    'vegan',
    'pescatarian',
    'keto',
    'paleo',
    'low_carb',
    'gluten_free',
    'dairy_free'
  ];

  // Measurement Units
  static const List<String> measurementUnits = [
    'gram',
    'kilogram',
    'liter',
    'milliliter',
    'cup',
    'tablespoon',
    'teaspoon',
    'piece',
    'slice',
    'clove'
  ];

  // Firebase Collections
  static const String usersCollection = 'users';
  static const String recipesCollection = 'recipes';
  static const String reviewsCollection = 'reviews';
  static const String favoritesCollection = 'favorites';
  static const String interactionsCollection = 'ai_interactions';

  // Error Messages
  static const String networkError = 'Không có kết nối mạng';
  static const String serverError = 'Lỗi server, vui lòng thử lại sau';
  static const String unknownError = 'Đã xảy ra lỗi không xác định';
  static const String timeoutError = 'Kết nối quá thời gian';
  static const String authError = 'Lỗi xác thực';

  // Success Messages
  static const String loginSuccess = 'Đăng nhập thành công';
  static const String registerSuccess = 'Đăng ký thành công';
  static const String recipeCreated = 'Tạo công thức thành công';
  static const String recipeUpdated = 'Cập nhật công thức thành công';
  static const String recipeDeleted = 'Xóa công thức thành công';

  // Permissions
  static const List<String> requiredPermissions = [
    'camera',
    'microphone',
    'location',
    'storage'
  ];

  // Social Media
  static const String facebookUrl = 'https://facebook.com/smartcookingai';
  static const String instagramUrl = 'https://instagram.com/smartcookingai';
  static const String twitterUrl = 'https://twitter.com/smartcookingai';
  static const String youtubeUrl = 'https://youtube.com/smartcookingai';

  // Support
  static const String supportEmail = 'support@smartcookingai.com';
  static const String privacyPolicyUrl = 'https://smartcookingai.com/privacy';
  static const String termsOfServiceUrl = 'https://smartcookingai.com/terms';

  // App Store
  static const String playStoreUrl =
      'https://play.google.com/store/apps/details?id=com.smartcookingai';
  static const String appStoreUrl =
      'https://apps.apple.com/app/smart-cooking-ai/id123456789';
}

// OAuth configuration file for SmartCookingAI mobile app
// Place this file in the lib/config/ directory
// NOTE: Actual keys are loaded from .env-local file which is not committed to source control

// Import package to load environment variables
import 'package:flutter_dotenv/flutter_dotenv.dart';

class OAuthConfig {
  // Google OAuth settings
  static String get googleClientId =>
      dotenv.env['GOOGLE_CLIENT_ID'] ??
      '638702620723-0r07ggfe1ea38gnckt7kdgk01in2f2h0.apps.googleusercontent.com';
  static String get googleRedirectUri =>
      dotenv.env['GOOGLE_REDIRECT_URI'] ??
      'com.smartcooking.app:/oauth2redirect';
  static const List<String> googleScopes = ['openid', 'email', 'profile'];

  // Facebook OAuth settings (if needed)
  static const String facebookClientId = 'YOUR_FACEBOOK_CLIENT_ID';
  static const String facebookRedirectUri =
      'com.smartcooking.app:/oauth2redirect';
  static const List<String> facebookScopes = ['email', 'public_profile'];

  // API configuration
  static const String apiBaseUrl = 'https://api.smartcooking.com';
  static const String authEndpoint = '/auth';
  static const String googleAuthEndpoint = '/auth/google';
  static const String facebookAuthEndpoint = '/auth/facebook';
  static const String refreshTokenEndpoint = '/auth/refresh';
  static const String backendUserUrl = 'https://api.smartcooking.com/auth/user';
}

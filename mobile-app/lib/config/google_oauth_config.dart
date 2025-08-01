class GoogleOAuthConfig {
  // Production Google OAuth Configuration
  static const String clientId =
      '638702620723-ou1fc8t9laggt8cc5nf4infb0r4m19i2.apps.googleusercontent.com';
  static const String projectId = 'tactical-orbit-431412-v1';

  // OAuth Scopes required for Smart Cooking AI
  static const List<String> scopes = [
    'email',
    'profile',
    'openid',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  // Authorized domains
  static const List<String> authorizedDomains = [
    'localhost:54072',
    'localhost:62515',
    'localhost:3000',
  ];

  // Redirect URIs
  static const List<String> redirectUris = [
    'http://localhost:54072/auth',
    'http://localhost:62515/auth',
    'http://localhost:3000/auth',
  ];

  // JavaScript origins
  static const List<String> javascriptOrigins = [
    'http://localhost:54072',
    'http://localhost:62515',
    'http://localhost:3000',
  ];

  // Development vs Production
  static bool get isDevelopment =>
      const bool.fromEnvironment('DEBUG_MODE', defaultValue: true);
  static bool get isProduction => !isDevelopment;

  // Client ID getter with environment check
  static String getClientId() {
    return clientId;
  }

  // Validation
  static bool isValidClientId() {
    return clientId.isNotEmpty &&
        clientId.contains('.apps.googleusercontent.com') &&
        !clientId.startsWith('1234567890'); // Not placeholder
  }
}

import 'package:google_sign_in/google_sign_in.dart';

class GoogleOAuth2Config {
  // Google OAuth2 Configuration
  // Phải khớp với backend configuration trong application.properties
  static const String webClientId = 'your-google-web-client-id.apps.googleusercontent.com';
  static const String iosClientId = 'your-google-ios-client-id.apps.googleusercontent.com';
  static const String androidClientId = 'your-google-android-client-id.apps.googleusercontent.com';
  
  // Scopes phải khớp với backend: profile,email
  static const List<String> scopes = [
    'email',
    'profile',
  ];

  /// Get GoogleSignIn instance với proper configuration
  static GoogleSignIn getInstance() {
    return GoogleSignIn(
      clientId: webClientId, // Web client ID cho cross-platform
      scopes: scopes,
      // Thêm cấu hình cho different platforms nếu cần
    );
  }

  /// Get platform-specific GoogleSignIn
  static GoogleSignIn getInstanceForPlatform({String? customClientId}) {
    return GoogleSignIn(
      clientId: customClientId ?? webClientId,
      scopes: scopes,
      // Hosted domain nếu cần restrict tới specific domain
      // hostedDomain: 'yourdomain.com',
    );
  }
}

/// OAuth2 Response model để handle backend response
class OAuth2Response {
  final bool success;
  final String? token;
  final Map<String, dynamic>? user;
  final String? message;
  final String? refreshToken;

  OAuth2Response({
    required this.success,
    this.token,
    this.user,
    this.message,
    this.refreshToken,
  });

  factory OAuth2Response.fromJson(Map<String, dynamic> json) {
    return OAuth2Response(
      success: json['success'] ?? false,
      token: json['token'],
      user: json['user'],
      message: json['message'],
      refreshToken: json['refreshToken'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'success': success,
      'token': token,
      'user': user,
      'message': message,
      'refreshToken': refreshToken,
    };
  }
}

/// Error codes cho OAuth2
class OAuth2ErrorCodes {
  static const String userCancelled = 'USER_CANCELLED';
  static const String networkError = 'NETWORK_ERROR';
  static const String tokenInvalid = 'TOKEN_INVALID';
  static const String authFailed = 'AUTH_FAILED';
  static const String serverError = 'SERVER_ERROR';
}

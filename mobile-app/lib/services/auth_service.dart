// Auth service for handling OAuth2 authentication in mobile app
// Place this file in lib/services/ directory

import 'dart:convert';
import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import '../config/oauth_config.dart';
import '../models/user.dart';

class AuthService {
  static const FlutterAppAuth _appAuth = FlutterAppAuth();
  static const FlutterSecureStorage _secureStorage = FlutterSecureStorage();

  // Google Sign In
  Future<bool> signInWithGoogle() async {
    try {
      // Authorize with Google
      final AuthorizationTokenResponse? result =
          await _appAuth.authorizeAndExchangeCode(
        AuthorizationTokenRequest(
          OAuthConfig.googleClientId,
          OAuthConfig.googleRedirectUri,
          discoveryUrl:
              'https://accounts.google.com/.well-known/openid-configuration',
          scopes: OAuthConfig.googleScopes,
        ),
      );

      if (result != null) {
        // Send ID token to backend for verification and to get JWT
        final response = await http.post(
          Uri.parse(
              '${OAuthConfig.apiBaseUrl}${OAuthConfig.googleAuthEndpoint}'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'token': result.idToken}),
        );

        if (response.statusCode == 200) {
          final Map<String, dynamic> data = jsonDecode(response.body);

          // Save tokens
          await _secureStorage.write(
              key: 'access_token', value: data['accessToken']);
          await _secureStorage.write(
              key: 'refresh_token', value: data['refreshToken']);
          await _secureStorage.write(
              key: 'token_expiry',
              value: DateTime.now()
                  .add(const Duration(hours: 1))
                  .millisecondsSinceEpoch
                  .toString());

          return true;
        } else {
          print('Backend authentication failed: ${response.body}');
          return false;
        }
      }
      return false;
    } catch (e) {
      print('OAuth Error: $e');
      return false;
    }
  }

  // Get current auth token
  Future<String?> getAccessToken() async {
    return await _secureStorage.read(key: 'access_token');
  }

  // Check if token is expired
  Future<bool> isTokenExpired() async {
    final expiryString = await _secureStorage.read(key: 'token_expiry');
    if (expiryString == null) return true;

    final expiry = DateTime.fromMillisecondsSinceEpoch(int.parse(expiryString));
    return DateTime.now().isAfter(expiry);
  }

  // Refresh token
  Future<bool> refreshToken() async {
    try {
      final refreshToken = await _secureStorage.read(key: 'refresh_token');
      if (refreshToken == null) return false;

      final response = await http.post(
        Uri.parse(
            '${OAuthConfig.apiBaseUrl}${OAuthConfig.refreshTokenEndpoint}'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'refreshToken': refreshToken}),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);

        // Update tokens
        await _secureStorage.write(
            key: 'access_token', value: data['accessToken']);
        if (data.containsKey('refreshToken')) {
          await _secureStorage.write(
              key: 'refresh_token', value: data['refreshToken']);
        }
        await _secureStorage.write(
            key: 'token_expiry',
            value: DateTime.now()
                .add(const Duration(hours: 1))
                .millisecondsSinceEpoch
                .toString());

        return true;
      }
      return false;
    } catch (e) {
      print('Token refresh error: $e');
      return false;
    }
  }

  // Sign out
  Future<void> signOut() async {
    await _secureStorage.deleteAll();
  }

  // Get authenticated HTTP client with token
  Future<http.Client> getAuthenticatedClient() async {
    final client = http.Client();
    if (await isTokenExpired()) {
      final success = await refreshToken();
      if (!success) {
        // Handle authentication failure
        throw Exception('Authentication failed');
      }
    }

    final token = await getAccessToken();
    return _AuthenticatedClient(client, token!);
  }

  // Additional methods for compatibility

  Future<bool> isLoggedIn() async {
    try {
      final token = await getAccessToken();
      return token != null && token.isNotEmpty;
    } catch (e) {
      return false;
    }
  }

  Future<User?> getCurrentUser() async {
    try {
      final token = await getAccessToken();
      if (token == null) return null;

      final response = await http.get(
        Uri.parse('${OAuthConfig.backendUserUrl}/me'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return User.fromJson(data);
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  Future<User?> signInWithEmailPassword(String email, String password) async {
    // Mock implementation - replace with actual backend call
    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 1));

      if (email.isNotEmpty && password.isNotEmpty) {
        final user = User(
          id: 'user_${DateTime.now().millisecondsSinceEpoch}',
          email: email,
          name: email.split('@').first,
          isEmailVerified: true,
          createdAt: DateTime.now(),
          lastSignInAt: DateTime.now(),
          additionalData: {'provider': 'email'},
        );

        // Store token
        await _secureStorage.write(
            key: 'access_token', value: 'mock_token_${user.id}');

        return user;
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  Future<User?> signUpWithEmailPassword(String email, String password,
      {String? name}) async {
    // Mock implementation - replace with actual backend call
    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 1));

      if (email.isNotEmpty && password.isNotEmpty) {
        final user = User(
          id: 'user_${DateTime.now().millisecondsSinceEpoch}',
          email: email,
          name: name ?? email.split('@').first,
          isEmailVerified: false,
          createdAt: DateTime.now(),
          lastSignInAt: DateTime.now(),
          additionalData: {'provider': 'email'},
        );

        // Store token
        await _secureStorage.write(
            key: 'access_token', value: 'mock_token_${user.id}');

        return user;
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  Future<User?> updateProfile({String? name, String? photoUrl}) async {
    // Mock implementation - replace with actual backend call
    try {
      final currentUser = await getCurrentUser();
      if (currentUser == null) return null;

      final updatedUser = currentUser.copyWith(
        name: name ?? currentUser.name,
        photoUrl: photoUrl ?? currentUser.photoUrl,
      );

      return updatedUser;
    } catch (e) {
      return null;
    }
  }

  Future<bool> changePassword(
      String currentPassword, String newPassword) async {
    // Mock implementation - replace with actual backend call
    try {
      await Future.delayed(const Duration(seconds: 1));
      return currentPassword.isNotEmpty && newPassword.isNotEmpty;
    } catch (e) {
      return false;
    }
  }

  Future<bool> resetPassword(String email) async {
    // Mock implementation - replace with actual backend call
    try {
      await Future.delayed(const Duration(seconds: 1));
      return email.isNotEmpty && email.contains('@');
    } catch (e) {
      return false;
    }
  }
}

// Custom HTTP client that adds the auth token to all requests
class _AuthenticatedClient extends http.BaseClient {
  final http.Client _inner;
  final String _token;

  _AuthenticatedClient(this._inner, this._token);

  @override
  Future<http.StreamedResponse> send(http.BaseRequest request) {
    request.headers['Authorization'] = 'Bearer $_token';
    return _inner.send(request);
  }
}

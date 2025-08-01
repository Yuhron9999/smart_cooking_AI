import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import '../models/user.dart';
import '../config/google_oauth_config.dart';
import '../config/app_config.dart';

class AuthProvider with ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  bool _isAuthenticated = false;
  String? _error;

  // Getters
  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _isAuthenticated;
  String? get error => _error;

  // Google Sign In instance with real configuration and updated scopes
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    clientId: GoogleOAuthConfig.getClientId(),
    scopes: [
      'email',
      'profile',
      'openid',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  );

  // API service instance
  final ApiService _apiService = ApiService();

  /// Initialize authentication state
  Future<void> initialize() async {
    try {
      _setLoading(true);

      // Check if user token exists in local storage
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      if (token != null) {
        // Get user profile
        final userProfile = await _apiService.getUserProfile();
        if (userProfile != null) {
          _user = userProfile;
          _isAuthenticated = true;
        } else {
          // Token invalid, clear local storage
          await _clearAuthData();
        }
      }

      _setLoading(false);
    } catch (e) {
      _setError('Failed to initialize auth: ${e.toString()}');
      _setLoading(false);
    }
  }

  /// Check authentication status
  Future<bool> checkAuthStatus() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      if (token != null) {
        final userProfile = await _apiService.getUserProfile();
        if (userProfile != null) {
          _user = userProfile;
          _isAuthenticated = true;
          return true;
        } else {
          await _clearAuthData();
        }
      }

      return false;
    } catch (e) {
      return false;
    }
  }

  /// Sign in with Google (with fallback for web issues)
  Future<bool> signInWithGoogle() async {
    try {
      _setLoading(true);
      _clearError();

      // Validate OAuth configuration
      if (!GoogleOAuthConfig.isValidClientId()) {
        _setError('Invalid Google OAuth configuration');
        _setLoading(false);
        return false;
      }

      final GoogleSignInAccount? googleUser;

      // Try silent sign-in first (recommended for web)
      if (kIsWeb) {
        googleUser = await _googleSignIn.signInSilently();
        if (googleUser == null) {
          // Fallback to regular sign-in if silent sign-in fails
          final regularSignIn = await _googleSignIn.signIn();
          if (regularSignIn == null) {
            _setError('Google sign in cancelled');
            _setLoading(false);
            return false;
          }
          // Use the regular sign-in result
          return await _processGoogleUser(regularSignIn);
        }
        return await _processGoogleUser(googleUser);
      } else {
        // Mobile: use regular sign-in
        googleUser = await _googleSignIn.signIn();
        if (googleUser == null) {
          _setError('Google sign in cancelled');
          _setLoading(false);
          return false;
        }
        return await _processGoogleUser(googleUser);
      }
    } catch (e) {
      if (kDebugMode) {
        print('Google Sign-In Error: $e');
      }

      // Check if it's a People API error (403 Forbidden)
      if (e.toString().contains('403') || e.toString().contains('Forbidden')) {
        // Try to extract basic info without People API
        return await _handleGoogleSignInWithoutPeopleAPI(e);
      }

      _setError('Google sign in failed: ${e.toString()}');
      _setLoading(false);
      return false;
    }
  }

  /// Process Google user data
  Future<bool> _processGoogleUser(GoogleSignInAccount googleUser) async {
    try {
      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;

      // Log OAuth success for debugging
      if (kDebugMode) {
        print('Google OAuth Success:');
        print('Email: ${googleUser.email}');
        print('Display Name: ${googleUser.displayName}');
        print('ID: ${googleUser.id}');
        print('Photo URL: ${googleUser.photoUrl}');
        print(
            'Access Token: ${googleAuth.accessToken != null ? 'Present' : 'Missing'}');
        print(
            'ID Token: ${googleAuth.idToken != null ? 'Present' : 'Missing'}');
      }

      // Create user data from Google account info
      final userData = {
        'id': 'google_${googleUser.id}',
        'email': googleUser.email,
        'name': googleUser.displayName ?? googleUser.email.split('@')[0],
        'avatar': googleUser.photoUrl,
        'role': 'USER',
        'languagePreference': 'vi',
        'provider': 'GOOGLE',
        'createdAt': DateTime.now().toIso8601String(),
      };

      // For development/demo, create local user without backend validation
      if (AppConfig.isDebugMode) {
        // Save to local storage
        const mockToken = 'google_oauth_jwt_token_for_development';
        await _saveAuthData(mockToken, userData);

        _user = User.fromJson(userData);
        _isAuthenticated = true;

        _setLoading(false);
        notifyListeners();
        return true;
      } else {
        // Production: Send to backend for validation
        final authResponse = await _apiService.signInWithGoogle(
          googleUser.email,
          googleUser.displayName ?? '',
          googleAuth.accessToken ?? '',
          googleAuth.idToken ?? '',
        );

        if (authResponse['success'] == true) {
          final token = authResponse['token'];
          final backendUserData = authResponse['user'];

          await _saveAuthData(token, backendUserData);
          _user = User.fromJson(backendUserData);
          _isAuthenticated = true;

          _setLoading(false);
          notifyListeners();
          return true;
        } else {
          _setError(authResponse['message'] ?? 'Authentication failed');
          _setLoading(false);
          return false;
        }
      }
    } catch (e) {
      _setError('Failed to process Google user: ${e.toString()}');
      _setLoading(false);
      return false;
    }
  }

  /// Handle Google Sign-In when People API is not available
  Future<bool> _handleGoogleSignInWithoutPeopleAPI(dynamic error) async {
    try {
      if (kDebugMode) {
        print('People API not available, using fallback authentication');
        print('Error: $error');
      }

      // Check if we have current user from Google Sign-In
      final GoogleSignInAccount? currentUser = _googleSignIn.currentUser;

      if (currentUser != null) {
        // We have basic user info, create user without People API
        final userData = {
          'id': 'google_${currentUser.id}',
          'email': currentUser.email,
          'name': currentUser.displayName ?? currentUser.email.split('@')[0],
          'avatar': currentUser.photoUrl,
          'role': 'USER',
          'languagePreference': 'vi',
          'provider': 'GOOGLE',
          'createdAt': DateTime.now().toIso8601String(),
        };

        const fallbackToken = 'google_fallback_jwt_token_for_development';
        await _saveAuthData(fallbackToken, userData);

        _user = User.fromJson(userData);
        _isAuthenticated = true;

        _setLoading(false);
        notifyListeners();

        // Show info message to user
        _setError('Đăng nhập thành công (chế độ fallback)');

        return true;
      } else {
        _setError('Google authentication failed. Please try again.');
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError('Fallback authentication failed: ${e.toString()}');
      _setLoading(false);
      return false;
    }
  }

  /// Sign in with email and password
  Future<bool> signInWithEmail(String email, String password) async {
    try {
      _setLoading(true);
      _clearError();

      final authResponse = await _apiService.signInWithEmail(email, password);

      if (authResponse['success'] == true) {
        final token = authResponse['token'];

        // Save token to local storage
        await _saveToken(token);

        _user = User.fromJson(authResponse['user']);
        _isAuthenticated = true;

        _setLoading(false);
        notifyListeners();
        return true;
      } else {
        _setError(authResponse['message'] ?? 'Sign in failed');
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError('Sign in failed: ${e.toString()}');
      _setLoading(false);
      return false;
    }
  }

  /// Register with email and password
  Future<bool> registerWithEmail(
      String name, String email, String password) async {
    try {
      _setLoading(true);
      _clearError();

      final authResponse =
          await _apiService.registerWithEmail(name, email, password);

      if (authResponse['success'] == true) {
        final token = authResponse['token'];

        // Save token to local storage
        await _saveToken(token);

        _user = User.fromJson(authResponse['user']);
        _isAuthenticated = true;

        _setLoading(false);
        notifyListeners();
        return true;
      } else {
        _setError(authResponse['message'] ?? 'Registration failed');
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError('Registration failed: ${e.toString()}');
      _setLoading(false);
      return false;
    }
  }

  /// Sign out
  Future<void> signOut() async {
    try {
      _setLoading(true);

      // Sign out from Google if signed in
      if (await _googleSignIn.isSignedIn()) {
        await _googleSignIn.signOut();
      }

      // Clear local storage
      await _clearAuthData();

      _user = null;
      _isAuthenticated = false;

      _setLoading(false);
      notifyListeners();
    } catch (e) {
      _setError('Sign out failed: ${e.toString()}');
      _setLoading(false);
    }
  }

  /// Update user profile
  Future<bool> updateProfile(Map<String, dynamic> profileData) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await _apiService.updateUserProfile(profileData);

      if (response['success'] == true) {
        _user = User.fromJson(response['user']);
        _setLoading(false);
        notifyListeners();
        return true;
      } else {
        _setError(response['message'] ?? 'Profile update failed');
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError('Profile update failed: ${e.toString()}');
      _setLoading(false);
      return false;
    }
  }

  /// Save authentication token to local storage
  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  /// Save authentication data to local storage
  Future<void> _saveAuthData(
      String token, Map<String, dynamic> userData) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
    await prefs.setString('user_data', userData.toString());
  }

  /// Sign in with Mock Google (for development when OAuth is not configured)
  Future<bool> signInWithMockGoogle() async {
    try {
      _setLoading(true);
      _clearError();

      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Create mock user data
      final mockUserData = {
        'id': 'mock_user_123',
        'email': 'developer@example.com',
        'name': 'Development User',
        'avatar': null,
        'role': 'USER',
        'languagePreference': 'vi',
        'createdAt': DateTime.now().toIso8601String(),
      };

      // Create mock token
      const mockToken = 'mock_jwt_token_for_development';

      // Save to local storage
      await _saveAuthData(mockToken, mockUserData);

      _user = User.fromJson(mockUserData);
      _isAuthenticated = true;

      _setLoading(false);
      notifyListeners();
      return true;
    } catch (e) {
      _setError('Mock sign in failed: ${e.toString()}');
      _setLoading(false);
      return false;
    }
  }

  /// Clear authentication data from local storage
  Future<void> _clearAuthData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('user_data');
  }

  /// Set loading state
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  /// Set error message
  void _setError(String error) {
    _error = error;
    notifyListeners();
  }

  /// Clear error message
  void _clearError() {
    _error = null;
  }

  /// Public method to clear error
  void clearError() {
    _clearError();
    notifyListeners();
  }
}

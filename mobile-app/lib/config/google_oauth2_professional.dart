// Smart Cooking AI Mobile - Professional Google OAuth2 Configuration
import 'package:google_sign_in/google_sign_in.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class GoogleOAuth2Config {
  // OAuth2 Credentials - ĐÃ CẤU HÌNH THẬT
  static const String googleClientId =
      '638702620723-ou1fc8t9laggt8cc5nf4infb0r4m19i2.apps.googleusercontent.com';
  static const String googleProjectId = 'tactical-orbit-431412-v1';
  static const String backendApiUrl = 'http://localhost:8080';

  // Google Sign-In Configuration
  static final GoogleSignIn _googleSignIn = GoogleSignIn(
    clientId: googleClientId,
    scopes: [
      'email',
      'profile',
      'openid',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  );

  // Firebase Auth Instance
  static final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;

  /// 🔐 Google Sign-In với Business Logic
  static Future<UserCredential?> signInWithGoogle() async {
    try {
      print('🚀 Starting Google Sign-In process...');

      // Trigger Google Sign-In flow
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();

      if (googleUser == null) {
        print('❌ User cancelled Google Sign-In');
        return null;
      }

      print('✅ Google user selected: ${googleUser.email}');

      // Obtain auth details from request
      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;

      if (googleAuth.accessToken == null || googleAuth.idToken == null) {
        throw Exception('Failed to obtain Google authentication tokens');
      }

      print('🔑 Google auth tokens obtained successfully');

      // Create a new credential
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      print('🔐 Firebase credential created');

      // Sign in to Firebase with credential
      final userCredential = await _firebaseAuth.signInWithCredential(
        credential,
      );

      print('✅ Firebase sign-in successful: ${userCredential.user?.email}');

      // Sync user data with backend
      await _syncUserWithBackend(userCredential.user!, googleAuth.accessToken!);

      return userCredential;
    } catch (error, stackTrace) {
      print('🚫 Google Sign-In error: $error');
      print('Stack trace: $stackTrace');
      throw GoogleSignInException('Google Sign-In failed: ${error.toString()}');
    }
  }

  /// 📤 Sync user data với Backend Spring Boot
  static Future<Map<String, dynamic>> _syncUserWithBackend(
    User firebaseUser,
    String accessToken,
  ) async {
    try {
      print('🔄 Syncing user data with backend...');

      final userData = {
        'firebaseUid': firebaseUser.uid,
        'email': firebaseUser.email,
        'name': firebaseUser.displayName,
        'avatar': firebaseUser.photoURL,
        'provider': 'GOOGLE',
        'providerId': firebaseUser.providerData.first.uid,
        'emailVerified': firebaseUser.emailVerified,
        'accessToken': accessToken,
        'lastLoginAt': DateTime.now().toIso8601String(),
        'deviceInfo': await _getDeviceInfo(),
      };

      final response = await http.post(
        Uri.parse('$backendApiUrl/api/auth/google-sync'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${await firebaseUser.getIdToken()}',
        },
        body: jsonEncode(userData),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = jsonDecode(response.body);
        print('✅ Backend sync successful');
        return responseData;
      } else {
        print(
          '❌ Backend sync failed: ${response.statusCode} - ${response.body}',
        );
        throw Exception('Backend sync failed: ${response.statusCode}');
      }
    } catch (error) {
      print('🚫 Backend sync error: $error');
      // Don't throw error - allow user to continue with local auth
      return {'error': error.toString()};
    }
  }

  /// 📱 Get device information for analytics
  static Future<Map<String, dynamic>> _getDeviceInfo() async {
    // TODO: Implement device info collection
    return {
      'platform': 'mobile',
      'os': 'android/ios', // Detect actual platform
      'appVersion': '1.0.0',
    };
  }

  /// 🚪 Sign out user
  static Future<void> signOut() async {
    try {
      print('🚪 Signing out user...');

      // Sign out from Google
      await _googleSignIn.signOut();

      // Sign out from Firebase
      await _firebaseAuth.signOut();

      // Notify backend
      await _notifyBackendSignOut();

      print('✅ Sign out successful');
    } catch (error) {
      print('🚫 Sign out error: $error');
      throw SignOutException('Sign out failed: ${error.toString()}');
    }
  }

  /// 📤 Notify backend about sign out
  static Future<void> _notifyBackendSignOut() async {
    try {
      await http.post(
        Uri.parse('$backendApiUrl/api/auth/logout'),
        headers: {'Content-Type': 'application/json'},
      );
    } catch (error) {
      print('Backend logout notification failed: $error');
      // Don't throw - allow local logout to proceed
    }
  }

  /// 👤 Get current user
  static User? getCurrentUser() {
    return _firebaseAuth.currentUser;
  }

  /// 🔄 Refresh user token
  static Future<String?> refreshToken() async {
    try {
      final user = getCurrentUser();
      if (user != null) {
        await user.reload();
        return await user.getIdToken(true); // Force refresh
      }
      return null;
    } catch (error) {
      print('Token refresh error: $error');
      return null;
    }
  }

  /// ✅ Check if user is authenticated
  static bool isAuthenticated() {
    return getCurrentUser() != null;
  }

  /// 📊 Get user profile data
  static Map<String, dynamic>? getUserProfile() {
    final user = getCurrentUser();
    if (user == null) return null;

    return {
      'uid': user.uid,
      'email': user.email,
      'name': user.displayName,
      'avatar': user.photoURL,
      'emailVerified': user.emailVerified,
      'createdAt': user.metadata.creationTime?.toIso8601String(),
      'lastSignIn': user.metadata.lastSignInTime?.toIso8601String(),
    };
  }
}

// Custom Exceptions
class GoogleSignInException implements Exception {
  final String message;
  GoogleSignInException(this.message);

  @override
  String toString() => 'GoogleSignInException: $message';
}

class SignOutException implements Exception {
  final String message;
  SignOutException(this.message);

  @override
  String toString() => 'SignOutException: $message';
}

class BackendSyncException implements Exception {
  final String message;
  BackendSyncException(this.message);

  @override
  String toString() => 'BackendSyncException: $message';
}

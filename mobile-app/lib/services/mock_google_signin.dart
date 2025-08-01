import 'package:flutter/material.dart';

/// Mock Google Sign-In for development when OAuth is not configured
class MockGoogleSignIn {
  static Future<Map<String, dynamic>?> signIn() async {
    // Simulate sign-in delay
    await Future.delayed(const Duration(seconds: 2));

    // Return mock user data for development
    return {
      'id': 'mock_user_123',
      'email': 'user@example.com',
      'name': 'Test User',
      'photoUrl': null,
      'accessToken': 'mock_access_token',
      'idToken': 'mock_id_token',
    };
  }

  static Future<void> signOut() async {
    await Future.delayed(const Duration(milliseconds: 500));
  }

  static bool get isSignedIn => false;

  /// Show dialog explaining OAuth setup needed
  static void showOAuthSetupDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('🔐 Google OAuth Setup Required'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('To use Google Sign-In, you need to:'),
            SizedBox(height: 8),
            Text('1. Create Google Cloud Project'),
            Text('2. Enable Google APIs'),
            Text('3. Create OAuth 2.0 Credentials'),
            Text('4. Add authorized origins'),
            SizedBox(height: 8),
            Text('See GOOGLE_OAUTH_SETUP.md for details.'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('OK'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              // You could open the setup guide here
            },
            child: const Text('Open Setup Guide'),
          ),
        ],
      ),
    );
  }
}

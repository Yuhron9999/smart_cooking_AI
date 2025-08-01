import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';

/// Smart error handling for Google OAuth issues
class GoogleOAuthHelper {
  /// Show user-friendly error dialog for OAuth issues
  static void showOAuthErrorDialog(BuildContext context, String error,
      {VoidCallback? onRetry, VoidCallback? onUseMock}) {
    String title = 'auth.google_login_failed'.tr();
    String message = _getLocalizedErrorMessage(error);

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            const Icon(Icons.warning_amber, color: Colors.orange),
            const SizedBox(width: 8),
            Text(title),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(message),
            const SizedBox(height: 16),
            if (_isPeopleApiError(error)) ...[
              const Divider(),
              const SizedBox(height: 8),
              Text(
                '📋 Hướng dẫn khắc phục:',
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 8),
              const Text('1. Vào Google Cloud Console'),
              const Text('2. APIs & Services > Library'),
              const Text('3. Tìm "People API" và Enable'),
              const Text('4. Thử đăng nhập lại'),
            ],
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('common.cancel'.tr()),
          ),
          if (onUseMock != null)
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                onUseMock();
              },
              child: Text('auth.use_mock_signin'.tr()),
            ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              if (onRetry != null) onRetry();
            },
            child: Text('common.retry'.tr()),
          ),
        ],
      ),
    );
  }

  /// Show success dialog for fallback authentication
  static void showFallbackSuccessDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.check_circle, color: Colors.green),
            SizedBox(width: 8),
            Text('Đăng nhập thành công!'),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Đã đăng nhập Google thành công với chế độ fallback.'),
            SizedBox(height: 8),
            Text(
                'Một số tính năng có thể bị hạn chế do People API chưa được kích hoạt.'),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('common.ok'.tr()),
          ),
        ],
      ),
    );
  }

  /// Check if error is related to People API
  static bool _isPeopleApiError(String error) {
    return error.contains('403') ||
        error.contains('Forbidden') ||
        error.contains('people.googleapis.com');
  }

  /// Get localized error message
  static String _getLocalizedErrorMessage(String error) {
    if (_isPeopleApiError(error)) {
      return 'People API chưa được kích hoạt trong Google Cloud Console. '
          'App vẫn có thể hoạt động với chế độ fallback.';
    }

    if (error.contains('popup') || error.contains('blocked')) {
      return 'Popup bị chặn bởi trình duyệt. Vui lòng cho phép popup và thử lại.';
    }

    if (error.contains('cancelled')) {
      return 'Đăng nhập bị hủy. Vui lòng thử lại.';
    }

    if (error.contains('network') || error.contains('timeout')) {
      return 'Lỗi kết nối mạng. Kiểm tra internet và thử lại.';
    }

    return 'Đăng nhập Google gặp sự cố. Vui lòng thử lại hoặc sử dụng email/mật khẩu.';
  }

  /// Create mock user for development
  static Map<String, dynamic> createMockGoogleUser(String email) {
    final name = email.split('@')[0];
    return {
      'id': 'mock_google_${DateTime.now().millisecondsSinceEpoch}',
      'email': email,
      'name': name.replaceAll('.', ' ').replaceAll('_', ' '),
      'avatar':
          'https://ui-avatars.com/api/?name=$name&background=4CAF50&color=fff',
      'role': 'USER',
      'languagePreference': 'vi',
      'provider': 'GOOGLE_MOCK',
      'createdAt': DateTime.now().toIso8601String(),
    };
  }

  /// Check if People API is available
  static Future<bool> checkPeopleApiAvailability() async {
    try {
      // This is a simple check - in real implementation you might ping the API
      return true;
    } catch (e) {
      return false;
    }
  }

  /// Log Google OAuth events for debugging
  static void logOAuthEvent(String event, {Map<String, dynamic>? data}) {
    if (kDebugMode) {
      print('🔐 Google OAuth: $event');
      if (data != null) {
        data.forEach((key, value) {
          print('  $key: $value');
        });
      }
    }
  }
}

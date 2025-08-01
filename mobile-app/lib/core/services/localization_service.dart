import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LocalizationService {
  static const List<Locale> supportedLocales = [
    Locale('vi', 'VN'), // Tiếng Việt
    Locale('en', 'US'), // English
    Locale('ja', 'JP'), // 日本語
    Locale('ko', 'KR'), // 한국어
    Locale('zh', 'CN'), // 中文
  ];

  static const Map<String, Map<String, String>> languageNames = {
    'vi': {'name': 'Tiếng Việt', 'nativeName': 'Tiếng Việt', 'flag': '🇻🇳'},
    'en': {'name': 'English', 'nativeName': 'English', 'flag': '🇺🇸'},
    'ja': {'name': 'Japanese', 'nativeName': '日本語', 'flag': '🇯🇵'},
    'ko': {'name': 'Korean', 'nativeName': '한국어', 'flag': '🇰🇷'},
    'zh': {'name': 'Chinese', 'nativeName': '中文', 'flag': '🇨🇳'},
  };

  /// Get language display name with flag
  static String getLanguageDisplayName(String languageCode) {
    final langInfo = languageNames[languageCode];
    if (langInfo != null) {
      return '${langInfo['flag']} ${langInfo['nativeName']}';
    }
    return '🇻🇳 Tiếng Việt'; // Default fallback
  }

  /// Get language native name only
  static String getLanguageNativeName(String languageCode) {
    final langInfo = languageNames[languageCode];
    return langInfo?['nativeName'] ?? 'Tiếng Việt';
  }

  /// Get language flag emoji
  static String getLanguageFlag(String languageCode) {
    final langInfo = languageNames[languageCode];
    return langInfo?['flag'] ?? '🇻🇳';
  }

  /// Check if language is supported
  static bool isLanguageSupported(String languageCode) {
    return supportedLocales
        .any((locale) => locale.languageCode == languageCode);
  }

  /// Get locale from language code
  static Locale getLocaleFromLanguageCode(String languageCode) {
    return supportedLocales.firstWhere(
      (locale) => locale.languageCode == languageCode,
      orElse: () => supportedLocales.first,
    );
  }

  /// Change app language
  static Future<void> changeLanguage(
      BuildContext context, String languageCode) async {
    if (!isLanguageSupported(languageCode)) {
      return;
    }

    final locale = getLocaleFromLanguageCode(languageCode);
    await context.setLocale(locale);

    // Save to local storage
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('language', languageCode);
  }

  /// Get saved language from local storage
  static Future<String> getSavedLanguage() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('language') ?? 'vi'; // Default to Vietnamese
  }

  /// Initialize language from saved preferences
  static Future<void> initializeLanguage(BuildContext context) async {
    final savedLanguage = await getSavedLanguage();
    final locale = getLocaleFromLanguageCode(savedLanguage);
    await context.setLocale(locale);
  }

  /// Get current language code
  static String getCurrentLanguageCode(BuildContext context) {
    return context.locale.languageCode;
  }

  /// Check if current language is RTL (Right to Left)
  static bool isRTL(String languageCode) {
    // Add RTL languages here if needed in the future
    const rtlLanguages = ['ar', 'fa', 'he', 'ur'];
    return rtlLanguages.contains(languageCode);
  }

  /// Format currency based on locale
  static String formatCurrency(double amount, String languageCode) {
    switch (languageCode) {
      case 'vi':
        return '${amount.toStringAsFixed(0)} ₫';
      case 'en':
        return '\$${amount.toStringAsFixed(2)}';
      case 'ja':
        return '¥${amount.toStringAsFixed(0)}';
      case 'ko':
        return '₩${amount.toStringAsFixed(0)}';
      case 'zh':
        return '¥${amount.toStringAsFixed(2)}';
      default:
        return '${amount.toStringAsFixed(0)} ₫';
    }
  }

  /// Format date based on locale
  static String formatDate(DateTime date, String languageCode) {
    switch (languageCode) {
      case 'vi':
        return DateFormat('dd/MM/yyyy', 'vi_VN').format(date);
      case 'en':
        return DateFormat('MM/dd/yyyy', 'en_US').format(date);
      case 'ja':
        return DateFormat('yyyy/MM/dd', 'ja_JP').format(date);
      case 'ko':
        return DateFormat('yyyy/MM/dd', 'ko_KR').format(date);
      case 'zh':
        return DateFormat('yyyy/MM/dd', 'zh_CN').format(date);
      default:
        return DateFormat('dd/MM/yyyy', 'vi_VN').format(date);
    }
  }

  /// Format time based on locale
  static String formatTime(DateTime time, String languageCode) {
    switch (languageCode) {
      case 'vi':
        return DateFormat('HH:mm', 'vi_VN').format(time);
      case 'en':
        return DateFormat('h:mm a', 'en_US').format(time);
      case 'ja':
        return DateFormat('HH:mm', 'ja_JP').format(time);
      case 'ko':
        return DateFormat('HH:mm', 'ko_KR').format(time);
      case 'zh':
        return DateFormat('HH:mm', 'zh_CN').format(time);
      default:
        return DateFormat('HH:mm', 'vi_VN').format(time);
    }
  }

  /// Get localized number format
  static String formatNumber(double number, String languageCode) {
    switch (languageCode) {
      case 'vi':
        return NumberFormat('#,##0.##', 'vi_VN').format(number);
      case 'en':
        return NumberFormat('#,##0.##', 'en_US').format(number);
      case 'ja':
        return NumberFormat('#,##0.##', 'ja_JP').format(number);
      case 'ko':
        return NumberFormat('#,##0.##', 'ko_KR').format(number);
      case 'zh':
        return NumberFormat('#,##0.##', 'zh_CN').format(number);
      default:
        return NumberFormat('#,##0.##', 'vi_VN').format(number);
    }
  }

  /// Get cooking time format based on language
  static String formatCookingTime(int minutes, String languageCode) {
    if (minutes < 60) {
      switch (languageCode) {
        case 'vi':
          return '$minutes phút';
        case 'en':
          return '$minutes min';
        case 'ja':
          return '$minutes分';
        case 'ko':
          return '$minutes분';
        case 'zh':
          return '$minutes分钟';
        default:
          return '$minutes phút';
      }
    } else {
      final hours = minutes ~/ 60;
      final remainingMinutes = minutes % 60;

      switch (languageCode) {
        case 'vi':
          if (remainingMinutes == 0) {
            return '$hours tiếng';
          } else {
            return '$hours tiếng $remainingMinutes phút';
          }
        case 'en':
          if (remainingMinutes == 0) {
            return '${hours}h';
          } else {
            return '${hours}h ${remainingMinutes}m';
          }
        case 'ja':
          if (remainingMinutes == 0) {
            return '$hours時間';
          } else {
            return '$hours時間$remainingMinutes分';
          }
        case 'ko':
          if (remainingMinutes == 0) {
            return '$hours시간';
          } else {
            return '$hours시간 $remainingMinutes분';
          }
        case 'zh':
          if (remainingMinutes == 0) {
            return '$hours小时';
          } else {
            return '$hours小时$remainingMinutes分钟';
          }
        default:
          if (remainingMinutes == 0) {
            return '$hours tiếng';
          } else {
            return '$hours tiếng $remainingMinutes phút';
          }
      }
    }
  }

  /// Get difficulty level translation
  static String getDifficultyLevel(String difficulty, BuildContext context) {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'difficulty.easy'.tr();
      case 'medium':
        return 'difficulty.medium'.tr();
      case 'hard':
        return 'difficulty.hard'.tr();
      default:
        return difficulty;
    }
  }

  /// Get serving size format
  static String formatServings(int servings, BuildContext context) {
    return '$servings ${'servings'.tr()}';
  }
}

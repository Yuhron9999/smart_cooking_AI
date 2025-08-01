import 'package:flutter/material.dart';

class AppTheme {
  // Brand Colors từ Design Guidelines
  static const Color brandOrange = Color(0xFFF97316); // Orange-500
  static const Color brandPink = Color(0xFFEC4899); // Pink-500
  static const Color brandPurple = Color(0xFF8B5CF6); // Purple-500

  // Semantic Colors
  static const Color successGreen = Color(0xFF10B981); // Emerald-500
  static const Color warningYellow = Color(0xFFF59E0B); // Amber-500
  static const Color errorRed = Color(0xFFEF4444); // Red-500
  static const Color infoBlue = Color(0xFF3B82F6); // Blue-500

  // Neutral Palette
  static const Color gray50 = Color(0xFFF9FAFB);
  static const Color gray100 = Color(0xFFF3F4F6);
  static const Color gray200 = Color(0xFFE5E7EB);
  static const Color gray300 = Color(0xFFD1D5DB);
  static const Color gray400 = Color(0xFF9CA3AF);
  static const Color gray500 = Color(0xFF6B7280);
  static const Color gray600 = Color(0xFF4B5563);
  static const Color gray700 = Color(0xFF374151);
  static const Color gray800 = Color(0xFF1F2937);
  static const Color gray900 = Color(0xFF111827);

  // Brand Gradient
  static const LinearGradient brandGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [brandOrange, brandPink, brandPurple],
    stops: [0.0, 0.5, 1.0],
  );

  // Category Colors
  static const Map<String, Color> categoryColors = {
    'vietnamese': Color(0xFFDC2626), // Red-600
    'asian': Color(0xFFEA580C), // Orange-600
    'western': Color(0xFF2563EB), // Blue-600
    'dessert': Color(0xFFDB2777), // Pink-600
    'healthy': Color(0xFF059669), // Emerald-600
  };

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: brandOrange,
        brightness: Brightness.light,
        primary: brandOrange,
        secondary: brandPink,
        tertiary: brandPurple,
        surface: gray50,
        background: Colors.white,
        error: errorRed,
      ),

      // Typography Scale theo Guidelines
      textTheme: const TextTheme(
        // H1 (4xl-6xl)
        displayLarge: TextStyle(
          fontSize: 56,
          fontWeight: FontWeight.bold,
          color: gray900,
          height: 1.1,
        ),
        displayMedium: TextStyle(
          fontSize: 48,
          fontWeight: FontWeight.bold,
          color: gray900,
          height: 1.1,
        ),

        // H2 (3xl-4xl)
        headlineLarge: TextStyle(
          fontSize: 36,
          fontWeight: FontWeight.bold,
          color: gray900,
          height: 1.2,
        ),
        headlineMedium: TextStyle(
          fontSize: 30,
          fontWeight: FontWeight.bold,
          color: gray900,
          height: 1.2,
        ),

        // H3 (xl-2xl)
        titleLarge: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.w600,
          color: gray900,
          height: 1.3,
        ),
        titleMedium: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: gray900,
          height: 1.3,
        ),

        // Body Text
        bodyLarge: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.normal,
          color: gray700,
          height: 1.5,
        ),
        bodyMedium: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.normal,
          color: gray600,
          height: 1.5,
        ),
        bodySmall: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.normal,
          color: gray500,
          height: 1.5,
        ),
      ),

      // AppBar Theme
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 1,
        surfaceTintColor: Colors.transparent,
        foregroundColor: gray900,
        titleTextStyle: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: gray900,
        ),
      ),

      // Card Theme
      cardTheme: CardThemeData(
        elevation: 2,
        shadowColor: gray900.withOpacity(0.1),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        color: Colors.white,
      ),

      // Button Themes
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        ),
      ),

      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          side: BorderSide(color: gray300),
          textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
        ),
      ),

      // Input Decoration
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: gray50,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: gray200),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: gray200),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: brandOrange, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: errorRed),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 16,
        ),
      ),

      // Bottom Navigation Bar
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Colors.white,
        selectedItemColor: brandOrange,
        unselectedItemColor: gray400,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
    );
  }
}

// Custom Widgets Extensions
extension AppThemeExtensions on ThemeData {
  // Gradient Buttons
  BoxDecoration get primaryGradientDecoration => const BoxDecoration(
    gradient: AppTheme.brandGradient,
    borderRadius: BorderRadius.all(Radius.circular(12)),
  );

  // Shadow Styles
  List<BoxShadow> get cardShadow => [
    BoxShadow(
      color: AppTheme.gray900.withOpacity(0.05),
      blurRadius: 10,
      offset: const Offset(0, 4),
    ),
  ];

  List<BoxShadow> get elevatedShadow => [
    BoxShadow(
      color: AppTheme.gray900.withOpacity(0.1),
      blurRadius: 20,
      offset: const Offset(0, 8),
    ),
  ];
}

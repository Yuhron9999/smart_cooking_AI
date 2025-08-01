import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'screens/home_screen_new.dart';
import 'screens/recipe_screen.dart';
import 'screens/ai_chat_screen.dart';
import 'screens/settings_screen.dart';

void main() {
  runApp(const SmartCookingAIApp());
}

class SmartCookingAIApp extends StatelessWidget {
  const SmartCookingAIApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart Cooking AI',
      theme: AppTheme.lightTheme,
      home: const HomeScreen(),
      routes: {
        '/recipes': (context) => const RecipeScreen(),
        '/ai-chat': (context) => const AiChatScreen(),
        '/settings': (context) => const SettingsScreen(),
      },
      debugShowCheckedModeBanner: false,
    );
  }
}

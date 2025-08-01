// import 'package:flutter/material.dart';

// // Feature Screens
// import '../../features/splash/screens/splash_screen.dart';
// import '../../features/onboarding/screens/onboarding_screen.dart';
// import '../../features/auth/screens/auth_screen.dart';
// import '../../features/auth/screens/login_screen.dart';
// import '../../features/auth/screens/register_screen.dart';
// import '../../features/home/screens/home_screen.dart';
// import '../../features/temp/temp_screens.dart';

// class AppRouter {
//   // Route names
//   static const String splash = '/';
//   static const String onboarding = '/onboarding';
//   static const String auth = '/auth';
//   static const String login = '/login';
//   static const String register = '/register';
//   static const String home = '/home';
//   static const String recipeList = '/recipes';
//   static const String recipeDetail = '/recipe-detail';
//   static const String createRecipe = '/create-recipe';
//   static const String aiChat = '/ai-chat';
//   static const String recipeGenerator = '/recipe-generator';
//   static const String foodRecognition = '/food-recognition';
//   static const String voiceAssistant = '/voice-assistant';
//   static const String profile = '/profile';
//   static const String settings = '/settings';
//   static const String languageSettings = '/language-settings';
//   static const String storeLocator = '/store-locator';
//   static const String regionalCuisine = '/regional-cuisine';

//   static Route<dynamic> generateRoute(RouteSettings settings) {
//     switch (settings.name) {
//       case splash:
//         return MaterialPageRoute(
//           builder: (_) => const SplashScreen(),
//           settings: settings,
//         );

//       case onboarding:
//         return MaterialPageRoute(
//           builder: (_) => const OnboardingScreen(),
//           settings: settings,
//         );

//       case auth:
//         return MaterialPageRoute(
//           builder: (_) => const AuthScreen(),
//           settings: settings,
//         );

//       case login:
//         return MaterialPageRoute(
//           builder: (_) => const LoginScreen(),
//           settings: settings,
//         );

//       case register:
//         return MaterialPageRoute(
//           builder: (_) => const RegisterScreen(),
//           settings: settings,
//         );

//       case home:
//         return MaterialPageRoute(
//           builder: (_) => const HomeScreen(),
//           settings: settings,
//         );

//       case recipeList:
//         return MaterialPageRoute(
//           builder: (_) => const TempRecipeListScreen(),
//           settings: settings,
//         );

//       case recipeDetail:
//         return MaterialPageRoute(
//           builder: (_) => const TempRecipeDetailScreen(),
//           settings: settings,
//         );

//       case createRecipe:
//         return MaterialPageRoute(
//           builder: (_) => const TempCreateRecipeScreen(),
//           settings: settings,
//         );

//       case aiChat:
//         return MaterialPageRoute(
//           builder: (_) => const TempAIChatScreen(),
//           settings: settings,
//         );

//       case recipeGenerator:
//         return MaterialPageRoute(
//           builder: (_) => const TempRecipeGeneratorScreen(),
//           settings: settings,
//         );

//       case foodRecognition:
//         return MaterialPageRoute(
//           builder: (_) => const TempFoodRecognitionScreen(),
//           settings: settings,
//         );

//       case voiceAssistant:
//         return MaterialPageRoute(
//           builder: (_) => const TempVoiceAssistantScreen(),
//           settings: settings,
//         );

//       case profile:
//         return MaterialPageRoute(
//           builder: (_) => const TempProfileScreen(),
//           settings: settings,
//         );

//       case '/settings':
//         return MaterialPageRoute(
//           builder: (_) => const TempSettingsScreen(),
//           settings: settings,
//         );

//       case languageSettings:
//         return MaterialPageRoute(
//           builder: (_) => const TempLanguageSettingsScreen(),
//           settings: settings,
//         );

//       case storeLocator:
//         return MaterialPageRoute(
//           builder: (_) => const TempStoreLocatorScreen(),
//           settings: settings,
//         );

//       case regionalCuisine:
//         return MaterialPageRoute(
//           builder: (_) => const TempRegionalCuisineScreen(),
//           settings: settings,
//         );

//       default:
//         return MaterialPageRoute(
//           builder: (_) => Scaffold(
//             appBar: AppBar(title: const Text('Page Not Found')),
//             body: const Center(
//               child: Text('404 - Page Not Found'),
//             ),
//           ),
//           settings: settings,
//         );
//     }
//   }

//   // Navigation helpers
//   static void pushNamed(BuildContext context, String routeName,
//       {Object? arguments}) {
//     Navigator.pushNamed(context, routeName, arguments: arguments);
//   }

//   static void pushReplacementNamed(BuildContext context, String routeName,
//       {Object? arguments}) {
//     Navigator.pushReplacementNamed(context, routeName, arguments: arguments);
//   }

//   static void pushNamedAndClearStack(BuildContext context, String routeName,
//       {Object? arguments}) {
//     Navigator.pushNamedAndRemoveUntil(
//       context,
//       routeName,
//       (route) => false,
//       arguments: arguments,
//     );
//   }

//   static void pop(BuildContext context) {
//     Navigator.pop(context);
//   }

//   static bool canPop(BuildContext context) {
//     return Navigator.canPop(context);
//   }
// }

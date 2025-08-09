import 'package:go_router/go_router.dart';

// Auth screens
import '../../features/auth/screens/auth_screen.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/register_screen.dart';

// Main screens
import '../../features/splash/screens/splash_screen.dart';
import '../../features/onboarding/screens/onboarding_screen.dart';
import '../../features/home/screens/home_screen.dart';

// Temporary placeholder screens
import '../../features/temp/temp_screens.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/splash',
    routes: [
      GoRoute(
        path: '/splash',
        name: 'splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/onboarding',
        name: 'onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: '/auth',
        name: 'auth',
        builder: (context, state) => const AuthScreen(),
      ),
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        name: 'register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/home',
        name: 'home',
        builder: (context, state) => const HomeScreen(),
      ),
      // Temporary routes for missing screens
      GoRoute(
        path: '/recipes',
        name: 'recipes',
        builder: (context, state) => const TempRecipeListScreen(),
      ),
      GoRoute(
        path: '/recipe-detail/:id',
        name: 'recipe-detail',
        builder: (context, state) {
          final recipeId = state.pathParameters['id'] ?? '';
          return TempRecipeDetailScreen(recipeId: recipeId);
        },
      ),
      GoRoute(
        path: '/create-recipe',
        name: 'create-recipe',
        builder: (context, state) => const TempCreateRecipeScreen(),
      ),
      GoRoute(
        path: '/edit-recipe/:id',
        name: 'edit-recipe',
        builder: (context, state) {
          // For now, just use the create screen since edit functionality isn't implemented yet
          return const TempCreateRecipeScreen();
        },
      ),
      GoRoute(
        path: '/ai-chat',
        name: 'ai-chat',
        builder: (context, state) => const TempAIChatScreen(),
      ),
      GoRoute(
        path: '/recipe-generator',
        name: 'recipe-generator',
        builder: (context, state) => const TempRecipeGeneratorScreen(),
      ),
      GoRoute(
        path: '/food-recognition',
        name: 'food-recognition',
        builder: (context, state) => const TempFoodRecognitionScreen(),
      ),
      GoRoute(
        path: '/voice-assistant',
        name: 'voice-assistant',
        builder: (context, state) => const TempVoiceAssistantScreen(),
      ),
      GoRoute(
        path: '/profile',
        name: 'profile',
        builder: (context, state) => const TempProfileScreen(),
      ),
      GoRoute(
        path: '/settings',
        name: 'settings',
        builder: (context, state) => const TempSettingsScreen(),
      ),
      GoRoute(
        path: '/language-settings',
        name: 'language-settings',
        builder: (context, state) => const TempLanguageSettingsScreen(),
      ),
      GoRoute(
        path: '/store-locator',
        name: 'store-locator',
        builder: (context, state) => const TempStoreLocatorScreen(),
      ),
      GoRoute(
        path: '/regional-cuisine/:region',
        name: 'regional-cuisine',
        builder: (context, state) {
          final region = state.pathParameters['region'] ?? '';
          return TempRegionalCuisineScreen(region: region);
        },
      ),
      GoRoute(
        path: '/nutrition-tracker',
        name: 'nutrition-tracker',
        builder: (context, state) => const TempNutritionTrackerScreen(),
      ),
      GoRoute(
        path: '/learning-path',
        name: 'learning-path',
        builder: (context, state) => const TempLearningPathScreen(),
      ),
      GoRoute(
        path: '/favorites',
        name: 'favorites',
        builder: (context, state) => const TempFavoritesScreen(),
      ),
    ],
  );
}

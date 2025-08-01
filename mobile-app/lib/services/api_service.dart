import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';

class ApiService {
  static const String _baseUrl = 'http://localhost:8080/api';
  static const String _aiServiceUrl = 'http://localhost:8001/api';

  // Singleton pattern
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;

  // HTTP client with timeout
  late final http.Client _client;

  ApiService._internal() {
    _client = http.Client();
  }

  /// Get authorization headers with JWT token
  Future<Map<String, String>> _getHeaders({bool includeAuth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  /// Handle HTTP responses and errors
  Map<String, dynamic> _handleResponse(http.Response response) {
    final statusCode = response.statusCode;

    try {
      final responseBody = json.decode(response.body);

      if (statusCode >= 200 && statusCode < 300) {
        return {
          'success': true,
          'data': responseBody,
          ...responseBody,
        };
      } else {
        return {
          'success': false,
          'message': responseBody['message'] ?? 'Request failed',
          'statusCode': statusCode,
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Invalid response format',
        'statusCode': statusCode,
      };
    }
  }

  // ==================== AUTHENTICATION ENDPOINTS ====================

  /// Sign in with email and password
  Future<Map<String, dynamic>> signInWithEmail(
      String email, String password) async {
    try {
      final headers = await _getHeaders(includeAuth: false);

      final response = await _client
          .post(
            Uri.parse('$_baseUrl/auth/login'),
            headers: headers,
            body: json.encode({
              'email': email,
              'password': password,
            }),
          )
          .timeout(const Duration(seconds: 30));

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  /// Sign in with Google OAuth
  Future<Map<String, dynamic>> signInWithGoogle(
      String email, String name, String accessToken, String idToken) async {
    try {
      final headers = await _getHeaders(includeAuth: false);

      final response = await _client
          .post(
            Uri.parse('$_baseUrl/auth/google-login'),
            headers: headers,
            body: json.encode({
              'email': email,
              'name': name,
              'accessToken': accessToken,
              'idToken': idToken,
              'provider': 'GOOGLE',
            }),
          )
          .timeout(const Duration(seconds: 30));

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  /// Register with email and password
  Future<Map<String, dynamic>> registerWithEmail(
      String name, String email, String password) async {
    try {
      final headers = await _getHeaders(includeAuth: false);

      final response = await _client
          .post(
            Uri.parse('$_baseUrl/auth/register'),
            headers: headers,
            body: json.encode({
              'name': name,
              'email': email,
              'password': password,
            }),
          )
          .timeout(const Duration(seconds: 30));

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  /// Get current user profile
  Future<User?> getUserProfile() async {
    try {
      final headers = await _getHeaders();

      final response = await _client
          .get(
            Uri.parse('$_baseUrl/auth/me'),
            headers: headers,
          )
          .timeout(const Duration(seconds: 30));

      final result = _handleResponse(response);
      if (result['success'] == true) {
        return User.fromJson(result['data']);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /// Update user profile
  Future<Map<String, dynamic>> updateUserProfile(
      Map<String, dynamic> profileData) async {
    try {
      final headers = await _getHeaders();

      final response = await _client
          .put(
            Uri.parse('$_baseUrl/user/profile'),
            headers: headers,
            body: json.encode(profileData),
          )
          .timeout(const Duration(seconds: 30));

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  // ==================== RECIPE ENDPOINTS ====================

  /// Get recipes with pagination and filters
  Future<Map<String, dynamic>> getRecipes({
    int page = 0,
    int? limit,
    String? category,
    String? difficulty,
    String? search,
    String? cuisine,
    String? filter,
  }) async {
    try {
      final headers = await _getHeaders();

      // Build query parameters
      final queryParams = <String, String>{
        'page': page.toString(),
      };

      if (limit != null) queryParams['limit'] = limit.toString();
      if (category != null) queryParams['category'] = category;
      if (difficulty != null) queryParams['difficulty'] = difficulty;
      if (search != null && search.isNotEmpty) queryParams['search'] = search;
      if (cuisine != null) queryParams['cuisine'] = cuisine;
      if (filter != null) queryParams['filter'] = filter;

      final uri =
          Uri.parse('$_baseUrl/recipes').replace(queryParameters: queryParams);

      final response = await _client
          .get(uri, headers: headers)
          .timeout(const Duration(seconds: 30));

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  /// Get recipe by ID
  Future<Map<String, dynamic>> getRecipeById(String recipeId) async {
    try {
      final headers = await _getHeaders();

      final response = await _client
          .get(
            Uri.parse('$_baseUrl/recipes/$recipeId'),
            headers: headers,
          )
          .timeout(const Duration(seconds: 30));

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  /// Create new recipe
  Future<Map<String, dynamic>> createRecipe(
      Map<String, dynamic> recipeData) async {
    try {
      final headers = await _getHeaders();

      final response = await _client
          .post(
            Uri.parse('$_baseUrl/recipes'),
            headers: headers,
            body: json.encode(recipeData),
          )
          .timeout(const Duration(seconds: 30));

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  /// Update recipe
  Future<Map<String, dynamic>> updateRecipe(
      String recipeId, Map<String, dynamic> recipeData) async {
    try {
      final headers = await _getHeaders();

      final response = await _client
          .put(
            Uri.parse('$_baseUrl/recipes/$recipeId'),
            headers: headers,
            body: json.encode(recipeData),
          )
          .timeout(const Duration(seconds: 30));

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  /// Delete recipe
  Future<Map<String, dynamic>> deleteRecipe(String recipeId) async {
    try {
      final headers = await _getHeaders();

      final response = await _client
          .delete(
            Uri.parse('$_baseUrl/recipes/$recipeId'),
            headers: headers,
          )
          .timeout(const Duration(seconds: 30));

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  /// Toggle recipe favorite status
  Future<Map<String, dynamic>> toggleRecipeFavorite(String recipeId) async {
    try {
      final headers = await _getHeaders();

      final response = await _client
          .post(
            Uri.parse('$_baseUrl/recipes/$recipeId/favorite'),
            headers: headers,
          )
          .timeout(const Duration(seconds: 30));

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  /// Get favorite recipes
  Future<Map<String, dynamic>> getFavoriteRecipes() async {
    try {
      final headers = await _getHeaders();

      final response = await _client
          .get(
            Uri.parse('$_baseUrl/recipes/favorites'),
            headers: headers,
          )
          .timeout(const Duration(seconds: 30));

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  /// Get my recipes
  Future<Map<String, dynamic>> getMyRecipes() async {
    try {
      final headers = await _getHeaders();

      final response = await _client
          .get(
            Uri.parse('$_baseUrl/recipes/my-recipes'),
            headers: headers,
          )
          .timeout(const Duration(seconds: 30));

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  // ==================== AI ENDPOINTS ====================

  /// Send chat message to AI
  Future<Map<String, dynamic>> sendChatMessage(String message) async {
    try {
      final headers = await _getHeaders();

      final response = await _client
          .post(
            Uri.parse('$_aiServiceUrl/chat'),
            headers: headers,
            body: json.encode({
              'message': message,
            }),
          )
          .timeout(const Duration(seconds: 60));

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  /// Generate recipe with AI
  Future<Map<String, dynamic>> generateRecipe(
    String prompt, {
    List<String>? ingredients,
    int? servings,
    List<String>? dietaryRestrictions,
  }) async {
    try {
      final headers = await _getHeaders();

      final body = <String, dynamic>{
        'prompt': prompt,
      };

      if (ingredients != null) body['ingredients'] = ingredients;
      if (servings != null) body['servings'] = servings;
      if (dietaryRestrictions != null) {
        body['dietaryRestrictions'] = dietaryRestrictions;
      }

      final response = await _client
          .post(
            Uri.parse('$_aiServiceUrl/generate-recipe'),
            headers: headers,
            body: json.encode(body),
          )
          .timeout(const Duration(seconds: 60));

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  /// Recognize food from image
  Future<Map<String, dynamic>> recognizeFood(File imageFile) async {
    try {
      final headers = await _getHeaders();
      headers.remove('Content-Type'); // Let multipart handle this

      final request = http.MultipartRequest(
        'POST',
        Uri.parse('$_aiServiceUrl/recognize-food'),
      );

      request.headers.addAll(headers);
      request.files.add(
        await http.MultipartFile.fromPath('image', imageFile.path),
      );

      final streamedResponse =
          await request.send().timeout(const Duration(seconds: 60));
      final response = await http.Response.fromStream(streamedResponse);

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  /// Analyze nutrition information
  Future<Map<String, dynamic>> analyzeNutrition(
      Map<String, dynamic> foodData) async {
    try {
      final headers = await _getHeaders();

      final response = await _client
          .post(
            Uri.parse('$_aiServiceUrl/analyze-nutrition'),
            headers: headers,
            body: json.encode(foodData),
          )
          .timeout(const Duration(seconds: 30));

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  /// Process voice command
  Future<Map<String, dynamic>> processVoiceCommand(String command) async {
    try {
      final headers = await _getHeaders();

      final response = await _client
          .post(
            Uri.parse('$_aiServiceUrl/voice-command'),
            headers: headers,
            body: json.encode({
              'command': command,
            }),
          )
          .timeout(const Duration(seconds: 30));

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  /// Clean up resources
  void dispose() {
    _client.close();
  }
}

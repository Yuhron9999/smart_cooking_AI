// Professional API Service với Real-time Data & Business Logic
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'dart:async';
import '../config/google_oauth2_professional.dart';

class ApiService {
  // Base Configuration
  static const String baseUrl = 'http://localhost:8080';
  static const String aiServiceUrl = 'http://localhost:8001';

  // HTTP Client với timeout configuration
  static final http.Client _client = http.Client();
  static const Duration _timeout = Duration(seconds: 30);

  // Cache for frequently requested data
  static final Map<String, dynamic> _cache = {};
  static const Duration _cacheTimeout = Duration(minutes: 5);
  static final Map<String, DateTime> _cacheTimestamps = {};

  // Headers for requests
  static Future<Map<String, String>> _getHeaders({
    bool includeAuth = true,
  }) async {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      final token = await GoogleOAuth2Config.refreshToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  // Generic request method with error handling
  static Future<Map<String, dynamic>> _request(
    String method,
    String endpoint, {
    Map<String, dynamic>? body,
    bool useCache = false,
    bool includeAuth = true,
  }) async {
    final url = endpoint.startsWith('/') ? '$baseUrl$endpoint' : endpoint;
    final cacheKey = '$method:$url:${jsonEncode(body ?? {})}';

    // Check cache first
    if (useCache &&
        method.toUpperCase() == 'GET' &&
        _cache.containsKey(cacheKey)) {
      final cacheTime = _cacheTimestamps[cacheKey];
      if (cacheTime != null &&
          DateTime.now().difference(cacheTime) < _cacheTimeout) {
        return _cache[cacheKey];
      }
    }

    try {
      final headers = await _getHeaders(includeAuth: includeAuth);
      late http.Response response;

      switch (method.toUpperCase()) {
        case 'GET':
          response = await _client
              .get(Uri.parse(url), headers: headers)
              .timeout(_timeout);
          break;
        case 'POST':
          response = await _client
              .post(
                Uri.parse(url),
                headers: headers,
                body: body != null ? jsonEncode(body) : null,
              )
              .timeout(_timeout);
          break;
        case 'PUT':
          response = await _client
              .put(
                Uri.parse(url),
                headers: headers,
                body: body != null ? jsonEncode(body) : null,
              )
              .timeout(_timeout);
          break;
        case 'DELETE':
          response = await _client
              .delete(Uri.parse(url), headers: headers)
              .timeout(_timeout);
          break;
        default:
          throw ApiException('Unsupported HTTP method: $method');
      }

      final data = _handleResponse(response);

      // Cache successful GET requests
      if (useCache &&
          method.toUpperCase() == 'GET' &&
          response.statusCode == 200) {
        _cache[cacheKey] = data;
        _cacheTimestamps[cacheKey] = DateTime.now();
      }

      return data;
    } on TimeoutException {
      throw ApiException('Request timeout. Please check your connection.');
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Network error: ${e.toString()}');
    }
  }

  // Handle HTTP response
  static Map<String, dynamic> _handleResponse(http.Response response) {
    final statusCode = response.statusCode;

    try {
      final data = jsonDecode(response.body) as Map<String, dynamic>;

      if (statusCode >= 200 && statusCode < 300) {
        return data;
      } else {
        throw ApiException(
          data['message'] ?? 'Request failed with status: $statusCode',
          statusCode: statusCode,
        );
      }
    } catch (e) {
      if (statusCode >= 500) {
        throw ApiException('Server error. Please try again later.');
      } else if (statusCode == 401) {
        throw ApiException('Authentication failed. Please login again.');
      } else if (statusCode == 403) {
        throw ApiException('Access denied. Insufficient permissions.');
      } else {
        throw ApiException('Request failed: ${e.toString()}');
      }
    }
  }

  // ============================================================================
  // USER MANAGEMENT APIs
  // ============================================================================

  /// Get current user profile
  static Future<Map<String, dynamic>> getUserProfile() async {
    return await _request('GET', '/api/users/me', useCache: true);
  }

  /// Update user profile
  static Future<Map<String, dynamic>> updateUserProfile(
    Map<String, dynamic> profileData,
  ) async {
    final response = await _request('PUT', '/api/users/me', body: profileData);
    _clearUserCache(); // Clear cache after update
    return response;
  }

  /// Update user language preference
  static Future<Map<String, dynamic>> updateUserLanguage(
    String language,
  ) async {
    return await _request(
      'PUT',
      '/api/users/me/language',
      body: {'language': language},
    );
  }

  /// Update user location
  static Future<Map<String, dynamic>> updateUserLocation(
    double latitude,
    double longitude,
  ) async {
    return await _request(
      'PUT',
      '/api/users/me/location',
      body: {'latitude': latitude, 'longitude': longitude},
    );
  }

  // ============================================================================
  // RECIPE MANAGEMENT APIs
  // ============================================================================

  /// Get recipes with filters
  static Future<List<Map<String, dynamic>>> getRecipes({
    String? category,
    String? difficulty,
    int? maxCookingTime,
    int page = 0,
    int size = 20,
  }) async {
    final queryParams = <String, String>{
      'page': page.toString(),
      'size': size.toString(),
    };

    if (category != null) queryParams['category'] = category;
    if (difficulty != null) queryParams['difficulty'] = difficulty;
    if (maxCookingTime != null) {
      queryParams['maxCookingTime'] = maxCookingTime.toString();
    }

    final queryString = queryParams.entries
        .map((e) => '${e.key}=${Uri.encodeComponent(e.value)}')
        .join('&');

    final response = await _request(
      'GET',
      '/api/recipes?$queryString',
      useCache: true,
    );
    return List<Map<String, dynamic>>.from(response['content'] ?? []);
  }

  /// Get recipe by ID
  static Future<Map<String, dynamic>> getRecipe(int recipeId) async {
    return await _request('GET', '/api/recipes/$recipeId', useCache: true);
  }

  /// Create new recipe
  static Future<Map<String, dynamic>> createRecipe(
    Map<String, dynamic> recipeData,
  ) async {
    final response = await _request('POST', '/api/recipes', body: recipeData);
    _clearRecipeCache(); // Clear cache after creation
    return response;
  }

  /// Update recipe
  static Future<Map<String, dynamic>> updateRecipe(
    int recipeId,
    Map<String, dynamic> recipeData,
  ) async {
    final response = await _request(
      'PUT',
      '/api/recipes/$recipeId',
      body: recipeData,
    );
    _clearRecipeCache(); // Clear cache after update
    return response;
  }

  /// Delete recipe
  static Future<void> deleteRecipe(int recipeId) async {
    await _request('DELETE', '/api/recipes/$recipeId');
    _clearRecipeCache(); // Clear cache after deletion
  }

  /// Get user's favorite recipes
  static Future<List<Map<String, dynamic>>> getFavoriteRecipes() async {
    final response = await _request(
      'GET',
      '/api/users/me/favorites',
      useCache: true,
    );
    return List<Map<String, dynamic>>.from(response['data'] ?? []);
  }

  /// Add recipe to favorites
  static Future<void> addToFavorites(int recipeId) async {
    await _request('POST', '/api/users/me/favorites/$recipeId');
  }

  /// Remove recipe from favorites
  static Future<void> removeFromFavorites(int recipeId) async {
    await _request('DELETE', '/api/users/me/favorites/$recipeId');
  }

  // ============================================================================
  // AI FEATURES APIs
  // ============================================================================

  /// Generate recipe from ingredients using AI
  static Future<Map<String, dynamic>> generateRecipe({
    required List<String> ingredients,
    String? cuisine,
    String? difficulty,
    int? cookingTime,
    int? servings,
    List<String>? dietaryRestrictions,
  }) async {
    final requestData = {
      'ingredients': ingredients,
      'preferences': {
        if (cuisine != null) 'cuisine': cuisine,
        if (difficulty != null) 'difficulty': difficulty,
        if (cookingTime != null) 'cookingTime': cookingTime,
        if (servings != null) 'servings': servings,
        if (dietaryRestrictions != null)
          'dietaryRestrictions': dietaryRestrictions,
      },
      'language': 'vi', // Default to Vietnamese
    };

    return await _request('POST', '/api/ai/generate-recipe', body: requestData);
  }

  /// Analyze food image using AI
  static Future<Map<String, dynamic>> analyzeImage(List<int> imageBytes) async {
    try {
      final headers = await _getHeaders();
      headers.remove('Content-Type'); // Let http handle multipart content-type

      final request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/api/ai/analyze-image'),
      );
      request.headers.addAll(headers);
      request.files.add(
        http.MultipartFile.fromBytes(
          'image',
          imageBytes,
          filename: 'food_image.jpg',
        ),
      );

      final streamedResponse = await _client.send(request).timeout(_timeout);
      final response = await http.Response.fromStream(streamedResponse);

      return _handleResponse(response);
    } catch (e) {
      throw ApiException('Image analysis failed: ${e.toString()}');
    }
  }

  /// Chat with AI assistant
  static Future<Map<String, dynamic>> chatWithAI({
    required String message,
    List<Map<String, dynamic>>? context,
  }) async {
    final requestData = {
      'message': message,
      'context': context ?? [],
      'language': 'vi',
    };

    return await _request('POST', '/api/ai/chat', body: requestData);
  }

  /// Process voice input
  static Future<Map<String, dynamic>> processVoice(List<int> audioBytes) async {
    try {
      final headers = await _getHeaders();
      headers.remove('Content-Type');

      final request = http.MultipartRequest(
        'POST',
        Uri.parse('$aiServiceUrl/api/voice/process'),
      );
      request.headers.addAll(headers);
      request.files.add(
        http.MultipartFile.fromBytes(
          'audio',
          audioBytes,
          filename: 'voice_input.wav',
        ),
      );

      final streamedResponse = await _client.send(request).timeout(_timeout);
      final response = await http.Response.fromStream(streamedResponse);

      return _handleResponse(response);
    } catch (e) {
      throw ApiException('Voice processing failed: ${e.toString()}');
    }
  }

  // ============================================================================
  // LEARNING & ANALYTICS APIs
  // ============================================================================

  /// Get user's learning progress
  static Future<Map<String, dynamic>> getLearningProgress() async {
    return await _request('GET', '/api/learning/progress', useCache: true);
  }

  /// Get user's AI interaction history
  static Future<List<Map<String, dynamic>>> getAIHistory({
    int limit = 50,
  }) async {
    final response = await _request(
      'GET',
      '/api/analytics/history?limit=$limit',
      useCache: true,
    );
    return List<Map<String, dynamic>>.from(response['data'] ?? []);
  }

  /// Track user interaction for analytics
  static Future<void> trackInteraction({
    required String interactionType,
    Map<String, dynamic>? data,
  }) async {
    await _request(
      'POST',
      '/api/analytics/track',
      body: {
        'interactionType': interactionType,
        'data': data ?? {},
        'timestamp': DateTime.now().toIso8601String(),
      },
    );
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /// Clear all cached data
  static void clearCache() {
    _cache.clear();
    _cacheTimestamps.clear();
  }

  /// Clear user-related cache
  static void _clearUserCache() {
    final userKeys = _cache.keys
        .where((key) => key.contains('/api/users'))
        .toList();
    for (final key in userKeys) {
      _cache.remove(key);
      _cacheTimestamps.remove(key);
    }
  }

  /// Clear recipe-related cache
  static void _clearRecipeCache() {
    final recipeKeys = _cache.keys
        .where((key) => key.contains('/api/recipes'))
        .toList();
    for (final key in recipeKeys) {
      _cache.remove(key);
      _cacheTimestamps.remove(key);
    }
  }

  /// Check network connectivity
  static Future<bool> checkConnectivity() async {
    try {
      final response = await _client
          .get(
            Uri.parse('$baseUrl/api/health'),
            headers: {'Content-Type': 'application/json'},
          )
          .timeout(const Duration(seconds: 5));

      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  /// Dispose resources
  static void dispose() {
    _client.close();
    clearCache();
  }
}

// ============================================================================
// CUSTOM EXCEPTIONS
// ============================================================================

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  ApiException(this.message, {this.statusCode});

  @override
  String toString() =>
      'ApiException: $message ${statusCode != null ? '(Status: $statusCode)' : ''}';
}

// ============================================================================
// DATA MODELS
// ============================================================================

class Recipe {
  final int id;
  final String title;
  final String description;
  final String? imageUrl;
  final int cookingTime;
  final String difficulty;
  final int servings;
  final double rating;
  final List<String> ingredients;
  final List<String> instructions;
  final String category;
  final int? calories;
  final DateTime createdAt;

  Recipe({
    required this.id,
    required this.title,
    required this.description,
    this.imageUrl,
    required this.cookingTime,
    required this.difficulty,
    required this.servings,
    required this.rating,
    required this.ingredients,
    required this.instructions,
    required this.category,
    this.calories,
    required this.createdAt,
  });

  factory Recipe.fromJson(Map<String, dynamic> json) {
    return Recipe(
      id: json['id'],
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      imageUrl: json['imageUrl'],
      cookingTime: json['cookingTime'] ?? 0,
      difficulty: json['difficulty'] ?? 'MEDIUM',
      servings: json['servings'] ?? 4,
      rating: (json['rating'] ?? 0.0).toDouble(),
      ingredients: List<String>.from(json['ingredients'] ?? []),
      instructions: List<String>.from(json['instructions'] ?? []),
      category: json['category'] ?? '',
      calories: json['calories'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'imageUrl': imageUrl,
      'cookingTime': cookingTime,
      'difficulty': difficulty,
      'servings': servings,
      'rating': rating,
      'ingredients': ingredients,
      'instructions': instructions,
      'category': category,
      'calories': calories,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}

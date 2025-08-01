import 'package:flutter/foundation.dart';
import 'dart:io';
import '../services/api_service.dart';
import '../models/chat_message.dart';

enum AIState {
  idle,
  loading,
  typing,
  error,
}

class AIProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();

  // State
  AIState _state = AIState.idle;
  String? _error;

  // Chat
  final List<ChatMessage> _messages = [];
  String? _conversationId;
  Map<String, dynamic>? _context;

  // Recognition
  Map<String, dynamic>? _recognitionResult;

  // Recipe Generation
  Map<String, dynamic>? _generatedRecipe;

  // Getters
  AIState get state => _state;
  String? get error => _error;
  List<ChatMessage> get messages => List.unmodifiable(_messages);
  String? get conversationId => _conversationId;
  Map<String, dynamic>? get recognitionResult => _recognitionResult;
  Map<String, dynamic>? get generatedRecipe => _generatedRecipe;

  bool get isLoading => _state == AIState.loading;
  bool get isTyping => _state == AIState.typing;
  bool get hasError => _state == AIState.error;

  // Private methods
  void _setState(AIState state) {
    _state = state;
    notifyListeners();
  }

  void _setError(String error) {
    _error = error;
    _state = AIState.error;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
  }

  // Send chat message
  Future<void> sendMessage(String message, {String? imageBase64}) async {
    try {
      _setState(AIState.loading);
      _clearError();

      // Add user message
      final userMessage = ChatMessage(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        content: message,
        isUser: true,
        timestamp: DateTime.now(),
      );
      _messages.add(userMessage);
      notifyListeners();

      // Mock API response for now
      await Future.delayed(const Duration(seconds: 1));

      final aiMessage = ChatMessage(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        content:
            "Tôi hiểu bạn muốn nói về: $message. Tôi sẽ giúp bạn với điều đó!",
        isUser: false,
        timestamp: DateTime.now(),
      );
      _messages.add(aiMessage);

      _setState(AIState.idle);
    } catch (e) {
      _setError('Failed to send message: $e');
    }
  }

  // Generate recipe
  Future<void> generateRecipe(
    List<String> ingredients, {
    String? cuisine,
    String? difficulty,
    int? servings,
    List<String>? dietaryRestrictions,
  }) async {
    try {
      _setState(AIState.loading);
      _clearError();

      // Mock recipe generation
      await Future.delayed(const Duration(seconds: 2));

      _generatedRecipe = {
        'name': 'Món ăn từ ${ingredients.join(", ")}',
        'ingredients': ingredients,
        'instructions': [
          'Chuẩn bị nguyên liệu',
          'Làm sạch và chế biến sơ bộ',
          'Nấu theo hướng dẫn',
          'Trang trí và thưởng thức'
        ],
        'cooking_time': '30 phút',
        'difficulty': difficulty ?? 'Dễ',
        'servings': servings ?? 2,
      };

      _setState(AIState.idle);
    } catch (e) {
      _setError('Failed to generate recipe: $e');
    }
  }

  // Recognize food from image
  Future<void> recognizeFood(File imageFile) async {
    try {
      _setState(AIState.loading);
      _clearError();

      // Mock food recognition
      await Future.delayed(const Duration(seconds: 1));

      _recognitionResult = {
        'food_name': 'Cà chua',
        'confidence': 0.95,
        'nutrients': {'calories': 18, 'vitamin_c': 'cao', 'lycopene': 'có'},
        'suggested_recipes': ['Cà chua xào trứng', 'Salad cà chua']
      };

      _setState(AIState.idle);
    } catch (e) {
      _setError('Failed to recognize food: $e');
    }
  }

  // Clear chat
  void clearChat() {
    _messages.clear();
    _conversationId = null;
    _context = null;
    notifyListeners();
  }

  // Clear error
  void clearError() {
    _error = null;
    if (_state == AIState.error) {
      _state = AIState.idle;
    }
    notifyListeners();
  }
}

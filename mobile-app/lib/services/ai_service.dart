// AI Service Integration for Smart Cooking Mobile
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class AIService {
  static const String baseUrl = 'http://localhost:8001'; // AI Service URL
  static const String webApiUrl = 'http://localhost:8080'; // Backend API URL

  // Google OAuth2 token for API calls
  String? _accessToken;

  void setAccessToken(String token) {
    _accessToken = token;
  }

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (_accessToken != null) 'Authorization': 'Bearer $_accessToken',
      };

  // 1. AI Chat với Gemini
  Future<String> chatWithAI(String message, {String language = 'vi'}) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/ai/chat'),
        headers: _headers,
        body: jsonEncode({
          'message': message,
          'language': language,
          'context': 'cooking_assistant',
          'user_preferences': {
            'cuisine_types': ['vietnamese', 'asian'],
            'dietary_restrictions': [],
            'skill_level': 'intermediate'
          }
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['response'] ?? 'Xin lỗi, tôi không hiểu câu hỏi của bạn.';
      } else {
        return _getFallbackResponse(message);
      }
    } catch (e) {
      print('AI Chat Error: $e');
      return _getFallbackResponse(message);
    }
  }

  // 2. Nhận dạng món ăn từ hình ảnh
  Future<Map<String, dynamic>> analyzeFood(File imageFile) async {
    try {
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/api/ai/analyze-image'),
      );

      request.headers.addAll(_headers);
      request.files.add(
        await http.MultipartFile.fromPath('image', imageFile.path),
      );
      request.fields['language'] = 'vi';
      request.fields['analysis_type'] = 'food_recognition';

      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'dish_name': data['dish_name'] ?? 'Không nhận dạng được',
          'confidence': data['confidence'] ?? 0.0,
          'ingredients': data['ingredients'] ?? [],
          'cooking_method': data['cooking_method'] ?? '',
          'cuisine_type': data['cuisine_type'] ?? '',
          'nutrition_info': data['nutrition_info'] ?? {},
          'suggested_recipes': data['suggested_recipes'] ?? [],
        };
      } else {
        return _getFallbackImageAnalysis();
      }
    } catch (e) {
      print('Image Analysis Error: $e');
      return _getFallbackImageAnalysis();
    }
  }

  // 3. Tạo công thức từ nguyên liệu
  Future<Map<String, dynamic>> generateRecipe(List<String> ingredients,
      {String? cuisineType,
      String difficulty = 'medium',
      int servings = 4,
      String language = 'vi'}) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/ai/generate-recipe'),
        headers: _headers,
        body: jsonEncode({
          'ingredients': ingredients,
          'cuisine_type': cuisineType,
          'difficulty': difficulty,
          'servings': servings,
          'language': language,
          'preferences': {
            'cooking_time': 'moderate',
            'dietary_restrictions': [],
            'available_equipment': ['stove', 'oven', 'basic_utensils']
          }
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'title': data['title'] ?? 'Món ăn tự tạo',
          'description': data['description'] ?? '',
          'cooking_time': data['cooking_time'] ?? 30,
          'difficulty': data['difficulty'] ?? 'medium',
          'servings': data['servings'] ?? servings,
          'ingredients': data['detailed_ingredients'] ?? [],
          'instructions': data['instructions'] ?? [],
          'tips': data['tips'] ?? [],
          'nutrition': data['nutrition_info'] ?? {},
        };
      } else {
        return _getFallbackRecipe(ingredients);
      }
    } catch (e) {
      print('Recipe Generation Error: $e');
      return _getFallbackRecipe(ingredients);
    }
  }

  // 4. Voice to Text (Speech Recognition)
  Future<String> speechToText(File audioFile,
      {String language = 'vi-VN'}) async {
    try {
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/api/voice/speech-to-text'),
      );

      request.headers.addAll(_headers);
      request.files.add(
        await http.MultipartFile.fromPath('audio', audioFile.path),
      );
      request.fields['language'] = language;
      request.fields['model'] = 'google_speech';

      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['transcript'] ?? '';
      } else {
        return '';
      }
    } catch (e) {
      print('Speech to Text Error: $e');
      return '';
    }
  }

  // 5. Text to Speech (Voice Synthesis)
  Future<File?> textToSpeech(String text, {String language = 'vi'}) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/voice/text-to-speech'),
        headers: _headers,
        body: jsonEncode({
          'text': text,
          'language': language,
          'voice': 'female',
          'speed': 1.0,
        }),
      );

      if (response.statusCode == 200) {
        // Save audio file to temporary directory
        final tempDir = Directory.systemTemp;
        final audioFile = File(
            '${tempDir.path}/tts_${DateTime.now().millisecondsSinceEpoch}.mp3');
        await audioFile.writeAsBytes(response.bodyBytes);
        return audioFile;
      }
      return null;
    } catch (e) {
      print('Text to Speech Error: $e');
      return null;
    }
  }

  // 6. Lưu user interaction vào database
  Future<void> saveInteraction(
      {required String type,
      required Map<String, dynamic> inputData,
      required Map<String, dynamic> outputData,
      String language = 'vi'}) async {
    try {
      await http.post(
        Uri.parse('$webApiUrl/api/ai/interactions'),
        headers: _headers,
        body: jsonEncode({
          'interaction_type': type,
          'input_data': inputData,
          'output_data': outputData,
          'language': language,
          'timestamp': DateTime.now().toIso8601String(),
        }),
      );
    } catch (e) {
      print('Save Interaction Error: $e');
    }
  }

  // Fallback responses khi AI service không available
  String _getFallbackResponse(String message) {
    final lowerMessage = message.toLowerCase();

    if (lowerMessage.contains('công thức') || lowerMessage.contains('nấu')) {
      return 'Tôi có thể giúp bạn tạo công thức nấu ăn! Hãy cho tôi biết những nguyên liệu bạn có.';
    } else if (lowerMessage.contains('nguyên liệu')) {
      return 'Hãy liệt kê những nguyên liệu bạn có, tôi sẽ gợi ý món ăn phù hợp!';
    } else if (lowerMessage.contains('cách nấu') ||
        lowerMessage.contains('hướng dẫn')) {
      return 'Tôi có thể hướng dẫn bạn nấu nhiều món khác nhau. Bạn muốn học nấu món gì?';
    } else {
      return 'Tôi là trợ lý nấu ăn AI. Tôi có thể giúp bạn:\n• Tạo công thức từ nguyên liệu\n• Nhận dạng món ăn từ hình ảnh\n• Hướng dẫn nấu ăn chi tiết\n• Tư vấn dinh dưỡng\n\nBạn cần hỗ trợ gì?';
    }
  }

  Map<String, dynamic> _getFallbackImageAnalysis() {
    return {
      'dish_name': 'Không thể nhận dạng',
      'confidence': 0.0,
      'ingredients': [],
      'cooking_method': '',
      'cuisine_type': '',
      'nutrition_info': {},
      'suggested_recipes': [],
      'error': 'AI service không khả dụng. Vui lòng thử lại sau.'
    };
  }

  Map<String, dynamic> _getFallbackRecipe(List<String> ingredients) {
    return {
      'title': 'Món ăn từ ${ingredients.join(", ")}',
      'description': 'Công thức sẽ được tạo khi AI service hoạt động.',
      'cooking_time': 30,
      'difficulty': 'medium',
      'servings': 4,
      'ingredients':
          ingredients.map((i) => {'name': i, 'amount': 'vừa đủ'}).toList(),
      'instructions': [
        'Chuẩn bị tất cả nguyên liệu',
        'Chế biến theo kinh nghiệm của bạn',
        'Nêm nướng vừa ăn',
        'Trình bày đẹp mắt'
      ],
      'tips': [
        'AI service đang được phát triển để cung cấp hướng dẫn chi tiết hơn'
      ],
      'nutrition': {},
    };
  }
}

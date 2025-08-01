import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Mock data for development when services are not available
  static const String _baseUrl = 'http://localhost:8001';
  static const String _backendUrl = 'http://localhost:8080';

  // Get recent recipes
  Future<List<Map<String, dynamic>>> getRecentRecipes({
    String language = 'vi',
    int limit = 10,
  }) async {
    try {
      final response = await http.get(
        Uri.parse(
          '$_backendUrl/api/recipes/recent?limit=$limit&language=$language',
        ),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data['recipes'] ?? []);
      } else {
        // Fallback to mock data
        return _getMockRecentRecipes(language);
      }
    } catch (e) {
      print('API Error: $e');
      return _getMockRecentRecipes(language);
    }
  }

  // AI Service endpoints
  Future<Map<String, dynamic>> generateRecipe(
    List<String> ingredients, {
    String language = 'vi',
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/api/ai/generate-recipe'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'ingredients': ingredients,
          'language': language,
          'dietary_restrictions': [],
          'cooking_time': 30,
          'difficulty': 'medium',
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        // Fallback to mock data
        return _getMockRecipe(ingredients, language);
      }
    } catch (e) {
      print('API Error: $e');
      return _getMockRecipe(ingredients, language);
    }
  }

  Future<Map<String, dynamic>> chatWithAI(
    String message, {
    String language = 'vi',
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/api/ai/chat'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'message': message,
          'language': language,
          'context': [],
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        return _getMockChatResponse(message, language);
      }
    } catch (e) {
      print('API Error: $e');
      return _getMockChatResponse(message, language);
    }
  }

  Future<Map<String, dynamic>> getRegionalSuggestions(
    double lat,
    double lng,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/api/maps/regional-suggestions'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'latitude': lat, 'longitude': lng}),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        return _getMockRegionalSuggestions(lat, lng);
      }
    } catch (e) {
      print('API Error: $e');
      return _getMockRegionalSuggestions(lat, lng);
    }
  }

  Future<Map<String, dynamic>> findNearbyStores(
    double lat,
    double lng, {
    String storeType = 'supermarket',
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/api/maps/nearby-search'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'latitude': lat,
          'longitude': lng,
          'radius': 2000,
          'place_type': storeType,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        return _getMockNearbyStores(lat, lng);
      }
    } catch (e) {
      print('API Error: $e');
      return _getMockNearbyStores(lat, lng);
    }
  }

  // Mock data methods
  Map<String, dynamic> _getMockRecipe(
    List<String> ingredients,
    String language,
  ) {
    final vietnameseRecipes = {
      'success': true,
      'recipe':
          '''
🍲 **Món ăn từ nguyên liệu có sẵn**

**Nguyên liệu:**
${ingredients.map((ing) => '• $ing').join('\n')}

**Cách làm:**
1. Sơ chế nguyên liệu sạch
2. Đun nóng chảo với một ít dầu
3. Cho nguyên liệu vào chảo theo thứ tự từ khó chín đến dễ chín
4. Nêm nước mắm, muối, tiêu vừa ăn
5. Đảo đều và nấu trong 10-15 phút
6. Trang trí và thưởng thức

**Lưu ý:** Có thể thêm gia vị theo khẩu vị cá nhân.
      ''',
      'language': language,
      'ingredients_used': ingredients,
      'cooking_time': '20 phút',
      'difficulty': 'Dễ',
      'mock_data': true,
    };

    return language == 'vi'
        ? vietnameseRecipes
        : {
            'success': true,
            'recipe':
                '''
🍲 **Recipe from Available Ingredients**

**Ingredients:**
${ingredients.map((ing) => '• $ing').join('\n')}

**Instructions:**
1. Clean and prepare all ingredients
2. Heat oil in a pan
3. Add ingredients in order from hardest to softest to cook
4. Season with salt, pepper, and preferred seasonings
5. Stir and cook for 10-15 minutes
6. Garnish and serve

**Note:** Adjust seasonings to taste.
      ''',
            'language': language,
            'ingredients_used': ingredients,
            'cooking_time': '20 minutes',
            'difficulty': 'Easy',
            'mock_data': true,
          };
  }

  Map<String, dynamic> _getMockChatResponse(String message, String language) {
    if (language == 'vi') {
      return {
        'success': true,
        'response':
            'Xin chào! Tôi là trợ lý AI nấu ăn. Bạn cần hỗ trợ gì về nấu ăn hôm nay? Tôi có thể giúp bạn tạo công thức, tư vấn nguyên liệu, hoặc hướng dẫn các kỹ thuật nấu ăn.',
        'language': language,
        'model_used': 'Mock AI Assistant',
        'mock_data': true,
      };
    } else {
      return {
        'success': true,
        'response':
            'Hello! I\'m your AI cooking assistant. How can I help you with cooking today? I can help create recipes, suggest ingredients, or guide you through cooking techniques.',
        'language': language,
        'model_used': 'Mock AI Assistant',
        'mock_data': true,
      };
    }
  }

  Map<String, dynamic> _getMockRegionalSuggestions(double lat, double lng) {
    String region = 'mien_bac';
    List<String> suggestions = [
      'Phở Hà Nội',
      'Bún chả',
      'Bánh cuốn',
      'Chả cá Lã Vọng',
    ];

    if (lat > 20.0) {
      region = 'mien_bac';
      suggestions = ['Phở Hà Nội', 'Bún chả', 'Bánh cuốn', 'Chả cá Lã Vọng'];
    } else if (lat > 16.0) {
      region = 'mien_trung';
      suggestions = ['Bún bò Huế', 'Mì Quảng', 'Cao lầu', 'Bánh khoái'];
    } else {
      region = 'mien_nam';
      suggestions = ['Bánh xèo', 'Hủ tiếu', 'Bún thịt nướng', 'Chè ba màu'];
    }

    return {
      'success': true,
      'region': region,
      'suggestions': suggestions,
      'location': {'lat': lat, 'lng': lng},
      'mock_data': true,
    };
  }

  Map<String, dynamic> _getMockNearbyStores(double lat, double lng) {
    return {
      'status': 'OK',
      'results': [
        {
          'place_id': 'mock_001',
          'name': 'Siêu thị Big C Thăng Long',
          'vicinity': '222 Trần Duy Hưng, Cầu Giấy, Hà Nội',
          'rating': 4.2,
          'types': ['supermarket', 'food'],
          'geometry': {
            'location': {'lat': lat + 0.001, 'lng': lng + 0.001},
          },
          'distance': 150,
        },
        {
          'place_id': 'mock_002',
          'name': 'Chợ Hòa Bình',
          'vicinity': 'Phố Hòa Bình, Ba Đình, Hà Nội',
          'rating': 4.0,
          'types': ['market', 'food'],
          'geometry': {
            'location': {'lat': lat + 0.002, 'lng': lng - 0.001},
          },
          'distance': 300,
        },
      ],
      'mock_data': true,
    };
  }

  List<Map<String, dynamic>> _getMockRecentRecipes(String language) {
    if (language == 'vi') {
      return [
        {
          'id': 1,
          'title': 'Phở Bò Hà Nội',
          'description':
              'Món phở truyền thống Hà Nội với nước dùng trong vắt, thịt bò mềm',
          'imageUrl':
              'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400',
          'cookingTime': '2 giờ',
          'difficulty': 'Khó',
          'rating': 4.8,
          'servings': 4,
          'category': 'vietnamese',
          'ingredients': [
            'Xương bò',
            'Thịt bò',
            'Bánh phở',
            'Hành tây',
            'Gừng',
          ],
        },
        {
          'id': 2,
          'title': 'Bánh Xèo Miền Tây',
          'description': 'Bánh xèo giòn rụm với nhân tôm thịt, ăn kèm rau sống',
          'imageUrl':
              'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400',
          'cookingTime': '45 phút',
          'difficulty': 'Trung bình',
          'rating': 4.6,
          'servings': 6,
          'category': 'vietnamese',
          'ingredients': ['Bột gạo', 'Tôm', 'Thịt ba chỉ', 'Giá đỗ', 'Nghệ'],
        },
        {
          'id': 3,
          'title': 'Gà Kung Pao',
          'description': 'Món gà xào kiểu Tứ Xuyên với đậu phộng và ớt khô',
          'imageUrl':
              'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
          'cookingTime': '30 phút',
          'difficulty': 'Dễ',
          'rating': 4.4,
          'servings': 4,
          'category': 'asian',
          'ingredients': ['Thịt gà', 'Đậu phộng', 'Ớt khô', 'Tỏi', 'Gừng'],
        },
        {
          'id': 4,
          'title': 'Pasta Carbonara',
          'description': 'Pasta Ý cổ điển với bacon, trứng và phô mai Parmesan',
          'imageUrl':
              'https://images.unsplash.com/photo-1588013273468-315900bafd4d?w=400',
          'cookingTime': '25 phút',
          'difficulty': 'Trung bình',
          'rating': 4.5,
          'servings': 2,
          'category': 'western',
          'ingredients': [
            'Spaghetti',
            'Bacon',
            'Trứng',
            'Phô mai Parmesan',
            'Tỏi',
          ],
        },
        {
          'id': 5,
          'title': 'Bánh Flan Caramel',
          'description': 'Bánh flan mềm mịn với lớp caramel đắng ngọt',
          'imageUrl':
              'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
          'cookingTime': '1 giờ',
          'difficulty': 'Trung bình',
          'rating': 4.7,
          'servings': 6,
          'category': 'dessert',
          'ingredients': ['Trứng', 'Sữa', 'Đường', 'Vanilla', 'Caramel'],
        },
      ];
    } else {
      return [
        {
          'id': 1,
          'title': 'Hanoi Beef Pho',
          'description':
              'Traditional Hanoi pho with clear broth and tender beef',
          'imageUrl':
              'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400',
          'cookingTime': '2 hours',
          'difficulty': 'Hard',
          'rating': 4.8,
          'servings': 4,
          'category': 'vietnamese',
          'ingredients': [
            'Beef bones',
            'Beef',
            'Rice noodles',
            'Onion',
            'Ginger',
          ],
        },
        {
          'id': 2,
          'title': 'Vietnamese Pancake',
          'description': 'Crispy pancake with shrimp and pork filling',
          'imageUrl':
              'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400',
          'cookingTime': '45 minutes',
          'difficulty': 'Medium',
          'rating': 4.6,
          'servings': 6,
          'category': 'vietnamese',
          'ingredients': [
            'Rice flour',
            'Shrimp',
            'Pork belly',
            'Bean sprouts',
            'Turmeric',
          ],
        },
      ];
    }
  }
}

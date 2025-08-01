import 'package:flutter/material.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final List<String> _ingredients = [];
  final TextEditingController _ingredientController = TextEditingController();
  String _selectedLanguage = 'vi';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('🍳 Smart Cooking AI'),
        actions: [
          PopupMenuButton<String>(
            onSelected: (String languageCode) {
              setState(() {
                _selectedLanguage = languageCode;
              });
            },
            itemBuilder: (BuildContext context) => [
              const PopupMenuItem(value: 'vi', child: Text('🇻🇳 Tiếng Việt')),
              const PopupMenuItem(value: 'en', child: Text('🇺🇸 English')),
              const PopupMenuItem(value: 'ja', child: Text('🇯🇵 日本語')),
            ],
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _getLocalizedText('welcome'),
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _getLocalizedText('tagline'),
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Quick actions
            Text(
              _getLocalizedText('quick_actions'),
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 16),

            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              children: [
                _buildActionCard(
                  icon: Icons.auto_awesome,
                  title: _getLocalizedText('recipe_generation'),
                  onTap: () => _showRecipeGenerator(),
                ),
                _buildActionCard(
                  icon: Icons.chat,
                  title: _getLocalizedText('chatbot'),
                  onTap: () => Navigator.pushNamed(context, '/ai-chat'),
                ),
                _buildActionCard(
                  icon: Icons.restaurant_menu,
                  title: _getLocalizedText('recipes'),
                  onTap: () => Navigator.pushNamed(context, '/recipes'),
                ),
                _buildActionCard(
                  icon: Icons.settings,
                  title: _getLocalizedText('settings'),
                  onTap: () => Navigator.pushNamed(context, '/settings'),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Regional suggestions
            _buildRegionalSuggestions(),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        items: [
          BottomNavigationBarItem(
            icon: const Icon(Icons.home),
            label: _getLocalizedText('home'),
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.restaurant_menu),
            label: _getLocalizedText('recipes'),
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.chat),
            label: _getLocalizedText('ai_chat'),
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.settings),
            label: _getLocalizedText('settings'),
          ),
        ],
        onTap: (index) {
          switch (index) {
            case 0:
              // Already on home
              break;
            case 1:
              Navigator.pushNamed(context, '/recipes');
              break;
            case 2:
              Navigator.pushNamed(context, '/ai-chat');
              break;
            case 3:
              Navigator.pushNamed(context, '/settings');
              break;
          }
        },
      ),
    );
  }

  Widget _buildActionCard({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 48, color: Colors.green),
              const SizedBox(height: 8),
              Text(
                title,
                style: Theme.of(context).textTheme.bodyMedium,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRegionalSuggestions() {
    final suggestions = _getRegionalSuggestions();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          _getLocalizedText('regional_suggestions'),
          style: Theme.of(context).textTheme.headlineSmall,
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 120,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: suggestions.length,
            itemBuilder: (context, index) {
              return Container(
                width: 200,
                margin: const EdgeInsets.only(right: 16),
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.restaurant, size: 32),
                        const SizedBox(height: 8),
                        Text(
                          suggestions[index],
                          style: Theme.of(context).textTheme.bodyMedium,
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  void _showRecipeGenerator() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        maxChildSize: 0.9,
        minChildSize: 0.5,
        builder: (context, scrollController) => Container(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Text(
                _getLocalizedText('ingredients'),
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 16),

              // Add ingredient field
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _ingredientController,
                      decoration: InputDecoration(
                        hintText: _getLocalizedText('add_ingredient'),
                        border: const OutlineInputBorder(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    onPressed: _addIngredient,
                    icon: const Icon(Icons.add),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Ingredients list
              Expanded(
                child: ListView.builder(
                  controller: scrollController,
                  itemCount: _ingredients.length,
                  itemBuilder: (context, index) {
                    return ListTile(
                      title: Text(_ingredients[index]),
                      trailing: IconButton(
                        icon: const Icon(Icons.remove_circle),
                        onPressed: () => _removeIngredient(index),
                      ),
                    );
                  },
                ),
              ),

              // Generate button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _ingredients.isNotEmpty ? _generateRecipe : null,
                  child: Text(_getLocalizedText('create_recipe')),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _addIngredient() {
    if (_ingredientController.text.isNotEmpty) {
      setState(() {
        _ingredients.add(_ingredientController.text);
        _ingredientController.clear();
      });
    }
  }

  void _removeIngredient(int index) {
    setState(() {
      _ingredients.removeAt(index);
    });
  }

  void _generateRecipe() {
    Navigator.pop(context); // Close modal

    // Show mock recipe result
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(_getLocalizedText('recipe_title')),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '🍲 ${_getLocalizedText('recipe_from_ingredients')}',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 8),
              Text('${_getLocalizedText('ingredients')}:'),
              ..._ingredients.map((ing) => Text('• $ing')),
              const SizedBox(height: 16),
              Text('${_getLocalizedText('instructions')}:'),
              Text(_getLocalizedText('mock_instructions')),
              const SizedBox(height: 16),
              Text(
                '⏱️ ${_getLocalizedText('cooking_time')}: 20 ${_getLocalizedText('minutes')}',
              ),
              Text(
                '📊 ${_getLocalizedText('difficulty')}: ${_getLocalizedText('easy')}',
              ),
              const SizedBox(height: 8),
              const Text(
                '💡 Mock data - Connecting to real AI service...',
                style: TextStyle(
                  fontStyle: FontStyle.italic,
                  color: Colors.orange,
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(_getLocalizedText('close')),
          ),
        ],
      ),
    );
  }

  String _getLocalizedText(String key) {
    final translations = {
      'vi': {
        'welcome': 'Chào mừng đến với Smart Cooking AI',
        'tagline': 'Hệ thống nấu ăn thông minh với AI',
        'quick_actions': 'Thao tác nhanh',
        'recipe_generation': 'Tạo công thức từ AI',
        'chatbot': 'Trò chuyện với AI',
        'recipes': 'Công thức',
        'settings': 'Cài đặt',
        'home': 'Trang chủ',
        'ai_chat': 'AI Chat',
        'regional_suggestions': 'Gợi ý món ăn theo vùng',
        'ingredients': 'Nguyên liệu',
        'add_ingredient': 'Thêm nguyên liệu',
        'create_recipe': 'Tạo công thức',
        'recipe_title': 'Công thức nấu ăn',
        'recipe_from_ingredients': 'Món ăn từ nguyên liệu có sẵn',
        'instructions': 'Hướng dẫn',
        'cooking_time': 'Thời gian nấu',
        'difficulty': 'Độ khó',
        'minutes': 'phút',
        'easy': 'Dễ',
        'close': 'Đóng',
        'mock_instructions':
            '1. Sơ chế nguyên liệu sạch\n2. Đun nóng chảo với dầu\n3. Cho nguyên liệu vào chảo\n4. Nêm nước mắm, muối, tiêu\n5. Đảo đều và nấu 15 phút\n6. Trang trí và thưởng thức',
      },
      'en': {
        'welcome': 'Welcome to Smart Cooking AI',
        'tagline': 'Intelligent cooking system with AI',
        'quick_actions': 'Quick Actions',
        'recipe_generation': 'AI Recipe Generation',
        'chatbot': 'Chat with AI',
        'recipes': 'Recipes',
        'settings': 'Settings',
        'home': 'Home',
        'ai_chat': 'AI Chat',
        'regional_suggestions': 'Regional Food Suggestions',
        'ingredients': 'Ingredients',
        'add_ingredient': 'Add ingredient',
        'create_recipe': 'Create Recipe',
        'recipe_title': 'Cooking Recipe',
        'recipe_from_ingredients': 'Recipe from Available Ingredients',
        'instructions': 'Instructions',
        'cooking_time': 'Cooking Time',
        'difficulty': 'Difficulty',
        'minutes': 'minutes',
        'easy': 'Easy',
        'close': 'Close',
        'mock_instructions':
            '1. Clean and prepare ingredients\n2. Heat oil in pan\n3. Add ingredients to pan\n4. Season with salt and pepper\n5. Stir and cook for 15 minutes\n6. Garnish and serve',
      },
      'ja': {
        'welcome': 'Smart Cooking AIへようこそ',
        'tagline': 'AIを使ったインテリジェント料理システム',
        'quick_actions': 'クイックアクション',
        'recipe_generation': 'AIレシピ生成',
        'chatbot': 'AIとチャット',
        'recipes': 'レシピ',
        'settings': '設定',
        'home': 'ホーム',
        'ai_chat': 'AIチャット',
        'regional_suggestions': '地域料理の提案',
        'ingredients': '材料',
        'add_ingredient': '材料を追加',
        'create_recipe': 'レシピを作成',
        'recipe_title': '料理レシピ',
        'recipe_from_ingredients': '材料から作る料理',
        'instructions': '手順',
        'cooking_time': '調理時間',
        'difficulty': '難易度',
        'minutes': '分',
        'easy': '簡単',
        'close': '閉じる',
        'mock_instructions':
            '1. 材料をきれいにする\n2. フライパンで油を熱する\n3. 材料をフライパンに加える\n4. 塩コショウで味付け\n5. 混ぜて15分調理\n6. 盛り付けて完成',
      },
    };

    return translations[_selectedLanguage]?[key] ?? key;
  }

  List<String> _getRegionalSuggestions() {
    final suggestions = {
      'vi': ['Phở Hà Nội', 'Bún chả', 'Bánh cuốn', 'Chả cá Lã Vọng'],
      'en': ['Vietnamese Pho', 'Bun Cha', 'Rice Rolls', 'Grilled Fish'],
      'ja': ['ベトナムフォー', 'ブンチャー', 'ライスロール', '焼き魚'],
    };

    return suggestions[_selectedLanguage] ?? suggestions['vi']!;
  }
}

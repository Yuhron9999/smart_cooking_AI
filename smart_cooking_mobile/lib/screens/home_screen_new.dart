import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';
import '../widgets/custom_widgets.dart';
import '../widgets/recipe_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _ingredientsController = TextEditingController();
  final ApiService _apiService = ApiService();
  List<Map<String, dynamic>> _recentRecipes = [];
  bool _isLoading = false;
  bool _isGenerating = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadRecentRecipes();
  }

  Future<void> _loadRecentRecipes() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final recipes = await _apiService.getRecentRecipes();
      setState(() {
        _recentRecipes = recipes;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Không thể tải công thức: $e';
        _isLoading = false;
      });
    }
  }

  Future<void> _generateRecipe() async {
    if (_ingredientsController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vui lòng nhập nguyên liệu'),
          backgroundColor: AppTheme.warningYellow,
        ),
      );
      return;
    }

    setState(() {
      _isGenerating = true;
      _errorMessage = null;
    });

    try {
      final ingredients = _ingredientsController.text
          .split(',')
          .map((e) => e.trim())
          .where((e) => e.isNotEmpty)
          .toList();

      final result = await _apiService.generateRecipe(ingredients);

      // Navigate to recipe details or show result
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Công thức đã được tạo thành công!'),
            backgroundColor: AppTheme.successGreen,
          ),
        );

        // Reload recent recipes to include the new one
        _loadRecentRecipes();
        _ingredientsController.clear();
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Không thể tạo công thức: $e';
      });
    } finally {
      setState(() {
        _isGenerating = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.gray50,
      body: CustomScrollView(
        slivers: [
          // App Bar with gradient
          SliverAppBar(
            expandedHeight: 200,
            floating: false,
            pinned: true,
            backgroundColor: Colors.transparent,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: AppTheme.brandGradient,
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(
                                Icons.restaurant_menu,
                                color: Colors.white,
                                size: 24,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Smart Cooking AI',
                                    style: Theme.of(context)
                                        .textTheme
                                        .headlineMedium
                                        ?.copyWith(
                                          color: Colors.white,
                                          fontWeight: FontWeight.bold,
                                        ),
                                  ),
                                  Text(
                                    'Tạo công thức từ nguyên liệu có sẵn',
                                    style: Theme.of(context).textTheme.bodyLarge
                                        ?.copyWith(
                                          color: Colors.white.withOpacity(0.9),
                                        ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),

          // Main Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Recipe Generator Card
                  Card(
                    elevation: 4,
                    shadowColor: AppTheme.gray900.withOpacity(0.1),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: AppTheme.brandOrange.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Icon(
                                  Icons.auto_awesome,
                                  color: AppTheme.brandOrange,
                                  size: 20,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Text(
                                'Tạo công thức từ AI',
                                style: Theme.of(context).textTheme.titleLarge
                                    ?.copyWith(
                                      fontWeight: FontWeight.w600,
                                      color: AppTheme.gray900,
                                    ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 16),

                          CustomTextField(
                            controller: _ingredientsController,
                            label: 'Nguyên liệu có sẵn',
                            hintText: 'Ví dụ: thịt heo, khoai tây, hành tây...',
                            prefixIcon: const Icon(
                              Icons.kitchen,
                              color: AppTheme.gray400,
                            ),
                            maxLines: 3,
                          ),

                          const SizedBox(height: 16),

                          SizedBox(
                            width: double.infinity,
                            child: CustomButton(
                              text: 'Tạo công thức',
                              onPressed: _isGenerating ? null : _generateRecipe,
                              isLoading: _isGenerating,
                              icon: const Icon(
                                Icons.auto_awesome,
                                size: 20,
                                color: Colors.white,
                              ),
                            ),
                          ),

                          if (_errorMessage != null) ...[
                            const SizedBox(height: 12),
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AppTheme.errorRed.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: AppTheme.errorRed.withOpacity(0.2),
                                ),
                              ),
                              child: Row(
                                children: [
                                  const Icon(
                                    Icons.error_outline,
                                    color: AppTheme.errorRed,
                                    size: 20,
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      _errorMessage!,
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodySmall
                                          ?.copyWith(color: AppTheme.errorRed),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Quick Actions
                  Row(
                    children: [
                      Text(
                        'Khám phá',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.w600,
                          color: AppTheme.gray900,
                        ),
                      ),
                      const Spacer(),
                      TextButton(
                        onPressed: () =>
                            Navigator.pushNamed(context, '/recipes'),
                        child: const Text('Xem tất cả'),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Quick Action Cards
                  Row(
                    children: [
                      Expanded(
                        child: _buildQuickActionCard(
                          context,
                          icon: Icons.camera_alt,
                          title: 'Chụp ảnh\nphân tích',
                          color: AppTheme.infoBlue,
                          onTap: () {
                            // TODO: Navigate to camera
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildQuickActionCard(
                          context,
                          icon: Icons.smart_toy,
                          title: 'AI Test\nRecipe',
                          color: AppTheme.brandPink,
                          onTap: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text(
                                  '🚀 AI Recipe Generator sẽ được thêm vào!',
                                ),
                                backgroundColor: AppTheme.brandPink,
                                duration: Duration(seconds: 2),
                              ),
                            );
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildQuickActionCard(
                          context,
                          icon: Icons.mic,
                          title: 'Giọng nói',
                          color: AppTheme.brandPurple,
                          onTap: () {
                            // TODO: Voice recognition
                          },
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Recent Recipes Section
                  Text(
                    'Công thức gần đây',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppTheme.gray900,
                    ),
                  ),

                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),

          // Recent Recipes List
          SliverToBoxAdapter(
            child: SizedBox(
              height: 400,
              child: _isLoading
                  ? _buildLoadingCards()
                  : _recentRecipes.isEmpty
                  ? _buildEmptyRecipes()
                  : ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      itemCount: _recentRecipes.length,
                      itemBuilder: (context, index) {
                        final recipe = _recentRecipes[index];
                        return Container(
                          width: 280,
                          margin: const EdgeInsets.only(right: 16),
                          child: RecipeCard(
                            title: recipe['title'] ?? 'Món ăn ngon',
                            description:
                                recipe['description'] ?? 'Mô tả món ăn',
                            imageUrl: recipe['imageUrl'] ?? '',
                            cookingTime: recipe['cookingTime'] ?? '30 phút',
                            difficulty: recipe['difficulty'] ?? 'Trung bình',
                            rating: (recipe['rating'] ?? 0.0).toDouble(),
                            servings: recipe['servings'] ?? 4,
                            category: recipe['category'] ?? 'vietnamese',
                            onTap: () {
                              // TODO: Navigate to recipe details
                            },
                          ),
                        );
                      },
                    ),
            ),
          ),

          // Bottom Spacing
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),

      // Bottom Navigation Bar
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        selectedItemColor: AppTheme.brandOrange,
        unselectedItemColor: AppTheme.gray400,
        backgroundColor: Colors.white,
        elevation: 8,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Trang chủ'),
          BottomNavigationBarItem(
            icon: Icon(Icons.restaurant_menu),
            label: 'Công thức',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.chat), label: 'AI Chat'),
          BottomNavigationBarItem(icon: Icon(Icons.settings), label: 'Cài đặt'),
        ],
        onTap: (index) {
          switch (index) {
            case 0:
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

  Widget _buildQuickActionCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 2,
      shadowColor: color.withOpacity(0.2),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              const SizedBox(height: 12),
              Text(
                title,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  fontWeight: FontWeight.w500,
                  color: AppTheme.gray700,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLoadingCards() {
    return ListView.builder(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 20),
      itemCount: 3,
      itemBuilder: (context, index) {
        return Container(
          width: 280,
          margin: const EdgeInsets.only(right: 16),
          child: const Card(
            child: Column(
              children: [
                LoadingSkeleton(width: double.infinity, height: 180),
                Padding(
                  padding: EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      LoadingSkeleton(width: 200, height: 20),
                      SizedBox(height: 8),
                      LoadingSkeleton(width: double.infinity, height: 16),
                      SizedBox(height: 16),
                      Row(
                        children: [
                          LoadingSkeleton(width: 60, height: 14),
                          Spacer(),
                          LoadingSkeleton(width: 40, height: 14),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildEmptyRecipes() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: AppTheme.gray100,
                borderRadius: BorderRadius.circular(40),
              ),
              child: const Icon(
                Icons.restaurant_menu,
                size: 32,
                color: AppTheme.gray400,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Chưa có công thức nào',
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(color: AppTheme.gray600),
            ),
            const SizedBox(height: 8),
            Text(
              'Tạo công thức đầu tiên ngay!',
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(color: AppTheme.gray500),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _ingredientsController.dispose();
    super.dispose();
  }
}

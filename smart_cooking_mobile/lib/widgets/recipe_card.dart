import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/custom_widgets.dart';

class RecipeCard extends StatelessWidget {
  final String title;
  final String description;
  final String imageUrl;
  final String cookingTime;
  final String difficulty;
  final double rating;
  final int servings;
  final String category;
  final VoidCallback? onTap;

  const RecipeCard({
    super.key,
    required this.title,
    required this.description,
    this.imageUrl = '',
    required this.cookingTime,
    required this.difficulty,
    this.rating = 0.0,
    this.servings = 4,
    this.category = 'vietnamese',
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shadowColor: AppTheme.gray900.withOpacity(0.1),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image Container with overlay badges
            Stack(
              children: [
                Container(
                  height: 180,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(16),
                    ),
                    color: AppTheme.gray100,
                  ),
                  child: ClipRRect(
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(16),
                    ),
                    child: imageUrl.isNotEmpty
                        ? Image.network(
                            imageUrl,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) =>
                                _buildPlaceholderImage(),
                          )
                        : _buildPlaceholderImage(),
                  ),
                ),

                // Difficulty Badge
                Positioned(
                  top: 12,
                  right: 12,
                  child: CustomBadge(
                    text: difficulty,
                    variant: _getDifficultyVariant(difficulty),
                  ),
                ),

                // Category Badge
                Positioned(
                  top: 12,
                  left: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: _getCategoryColor(category).withOpacity(0.9),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      category.toUpperCase(),
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title
                  Text(
                    title,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppTheme.gray900,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),

                  const SizedBox(height: 8),

                  // Description
                  Text(
                    description,
                    style: Theme.of(
                      context,
                    ).textTheme.bodyMedium?.copyWith(color: AppTheme.gray600),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),

                  const SizedBox(height: 16),

                  // Meta Information Row
                  Row(
                    children: [
                      // Cooking Time
                      Icon(
                        Icons.access_time,
                        size: 16,
                        color: AppTheme.gray500,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        cookingTime,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppTheme.gray500,
                          fontWeight: FontWeight.w500,
                        ),
                      ),

                      const SizedBox(width: 16),

                      // Servings
                      Icon(
                        Icons.people_outline,
                        size: 16,
                        color: AppTheme.gray500,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '$servings người',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppTheme.gray500,
                          fontWeight: FontWeight.w500,
                        ),
                      ),

                      const Spacer(),

                      // Rating
                      if (rating > 0) ...[
                        Icon(
                          Icons.star,
                          size: 16,
                          color: AppTheme.warningYellow,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          rating.toStringAsFixed(1),
                          style: Theme.of(context).textTheme.bodySmall
                              ?.copyWith(
                                color: AppTheme.gray700,
                                fontWeight: FontWeight.w600,
                              ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaceholderImage() {
    return Container(
      color: AppTheme.gray100,
      child: const Center(
        child: Icon(Icons.restaurant, size: 48, color: AppTheme.gray400),
      ),
    );
  }

  BadgeVariant _getDifficultyVariant(String difficulty) {
    switch (difficulty.toLowerCase()) {
      case 'easy':
      case 'dễ':
        return BadgeVariant.easy;
      case 'medium':
      case 'trung bình':
        return BadgeVariant.medium;
      case 'hard':
      case 'khó':
        return BadgeVariant.hard;
      default:
        return BadgeVariant.medium;
    }
  }

  Color _getCategoryColor(String category) {
    return AppTheme.categoryColors[category.toLowerCase()] ??
        AppTheme.brandOrange;
  }
}

// Recipe List View
class RecipeListView extends StatelessWidget {
  final List<Map<String, dynamic>> recipes;
  final bool isLoading;
  final VoidCallback? onRefresh;
  final Function(Map<String, dynamic>)? onRecipeTap;

  const RecipeListView({
    super.key,
    required this.recipes,
    this.isLoading = false,
    this.onRefresh,
    this.onRecipeTap,
  });

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return _buildLoadingSkeleton();
    }

    if (recipes.isEmpty) {
      return _buildEmptyState(context);
    }

    return RefreshIndicator(
      onRefresh: () async {
        onRefresh?.call();
      },
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: recipes.length,
        itemBuilder: (context, index) {
          final recipe = recipes[index];
          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: RecipeCard(
              title: recipe['title'] ?? 'Món ăn ngon',
              description: recipe['description'] ?? 'Mô tả món ăn',
              imageUrl: recipe['imageUrl'] ?? '',
              cookingTime: recipe['cookingTime'] ?? '30 phút',
              difficulty: recipe['difficulty'] ?? 'Trung bình',
              rating: (recipe['rating'] ?? 0.0).toDouble(),
              servings: recipe['servings'] ?? 4,
              category: recipe['category'] ?? 'vietnamese',
              onTap: () => onRecipeTap?.call(recipe),
            ),
          );
        },
      ),
    );
  }

  Widget _buildLoadingSkeleton() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 5,
      itemBuilder: (context, index) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 16),
          child: Card(
            child: Column(
              children: [
                const LoadingSkeleton(
                  width: double.infinity,
                  height: 180,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                ),
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const LoadingSkeleton(width: 200, height: 20),
                      const SizedBox(height: 8),
                      const LoadingSkeleton(width: double.infinity, height: 16),
                      const SizedBox(height: 8),
                      const LoadingSkeleton(width: 150, height: 16),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          const LoadingSkeleton(width: 60, height: 14),
                          const SizedBox(width: 16),
                          const LoadingSkeleton(width: 60, height: 14),
                          const Spacer(),
                          const LoadingSkeleton(width: 40, height: 14),
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

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: AppTheme.gray100,
                borderRadius: BorderRadius.circular(60),
              ),
              child: const Icon(
                Icons.restaurant_menu,
                size: 48,
                color: AppTheme.gray400,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Chưa có công thức nào',
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(color: AppTheme.gray700),
            ),
            const SizedBox(height: 8),
            Text(
              'Hãy tạo công thức đầu tiên của bạn!',
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(color: AppTheme.gray500),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            CustomButton(
              text: 'Tạo công thức',
              onPressed: onRefresh,
              icon: const Icon(Icons.add, size: 20, color: Colors.white),
            ),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/foundation.dart';
import '../services/api_service.dart';
import '../models/recipe.dart';

enum RecipeFilter {
  all,
  favorites,
  myRecipes,
  recent,
  trending,
}

enum RecipeDifficulty {
  easy,
  medium,
  hard,
}

enum RecipeCategory {
  breakfast,
  lunch,
  dinner,
  dessert,
  snack,
  beverage,
  appetizer,
  mainCourse,
  sideDish,
  soup,
  salad,
  vegetarian,
  vegan,
  glutenFree,
}

class RecipeProvider with ChangeNotifier {
  List<Recipe> _recipes = [];
  List<Recipe> _favoriteRecipes = [];
  List<Recipe> _myRecipes = [];
  List<Recipe> _filteredRecipes = [];
  Recipe? _selectedRecipe;

  bool _isLoading = false;
  bool _isLoadingMore = false;
  String? _error;

  // Filters and search
  RecipeFilter _currentFilter = RecipeFilter.all;
  String _searchQuery = '';
  RecipeCategory? _selectedCategory;
  RecipeDifficulty? _selectedDifficulty;
  String? _selectedCuisine;

  // Pagination
  int _currentPage = 1;
  bool _hasMoreRecipes = true;
  final int _pageSize = 20;

  // API service
  final ApiService _apiService = ApiService();

  // Getters
  List<Recipe> get recipes => _filteredRecipes;
  List<Recipe> get favoriteRecipes => _favoriteRecipes;
  List<Recipe> get myRecipes => _myRecipes;
  Recipe? get selectedRecipe => _selectedRecipe;

  bool get isLoading => _isLoading;
  bool get isLoadingMore => _isLoadingMore;
  String? get error => _error;

  RecipeFilter get currentFilter => _currentFilter;
  String get searchQuery => _searchQuery;
  RecipeCategory? get selectedCategory => _selectedCategory;
  RecipeDifficulty? get selectedDifficulty => _selectedDifficulty;
  String? get selectedCuisine => _selectedCuisine;

  bool get hasMoreRecipes => _hasMoreRecipes;

  /// Initialize recipes
  Future<void> initialize() async {
    await loadRecipes();
  }

  /// Load recipes with current filters
  Future<void> loadRecipes({bool refresh = false}) async {
    if (refresh) {
      _currentPage = 1;
      _hasMoreRecipes = true;
      _recipes.clear();
      _filteredRecipes.clear();
    }

    try {
      _setLoading(true);
      _clearError();

      final response = await _apiService.getRecipes(
        page: _currentPage,
        limit: _pageSize,
        search: _searchQuery.isNotEmpty ? _searchQuery : null,
        category: _selectedCategory?.name,
        difficulty: _selectedDifficulty?.name,
        cuisine: _selectedCuisine,
        filter: _currentFilter.name,
      );

      if (response['success'] == true) {
        final List<dynamic> recipesData = response['data']['recipes'];
        final List<Recipe> newRecipes =
            recipesData.map((json) => Recipe.fromJson(json)).toList();

        if (refresh) {
          _recipes = newRecipes;
        } else {
          _recipes.addAll(newRecipes);
        }

        _hasMoreRecipes = newRecipes.length == _pageSize;
        _applyFilters();

        _setLoading(false);
      } else {
        _setError(response['message'] ?? 'Failed to load recipes');
        _setLoading(false);
      }
    } catch (e) {
      _setError('Failed to load recipes: ${e.toString()}');
      _setLoading(false);
    }
  }

  /// Load more recipes (pagination)
  Future<void> loadMoreRecipes() async {
    if (_isLoadingMore || !_hasMoreRecipes) return;

    try {
      _isLoadingMore = true;
      notifyListeners();

      _currentPage++;

      final response = await _apiService.getRecipes(
        page: _currentPage,
        limit: _pageSize,
        search: _searchQuery.isNotEmpty ? _searchQuery : null,
        category: _selectedCategory?.name,
        difficulty: _selectedDifficulty?.name,
        cuisine: _selectedCuisine,
        filter: _currentFilter.name,
      );

      if (response['success'] == true) {
        final List<dynamic> recipesData = response['data']['recipes'];
        final List<Recipe> newRecipes =
            recipesData.map((json) => Recipe.fromJson(json)).toList();

        _recipes.addAll(newRecipes);
        _hasMoreRecipes = newRecipes.length == _pageSize;
        _applyFilters();
      }

      _isLoadingMore = false;
      notifyListeners();
    } catch (e) {
      _currentPage--; // Rollback page increment
      _isLoadingMore = false;
      notifyListeners();
    }
  }

  /// Get recipe by ID
  Future<Recipe?> getRecipeById(String recipeId) async {
    try {
      _clearError();

      final response = await _apiService.getRecipeById(recipeId);

      if (response['success'] == true) {
        final recipe = Recipe.fromJson(response['data']);
        _selectedRecipe = recipe;
        notifyListeners();
        return recipe;
      } else {
        _setError(response['message'] ?? 'Recipe not found');
        return null;
      }
    } catch (e) {
      _setError('Failed to get recipe: ${e.toString()}');
      return null;
    }
  }

  /// Create new recipe
  Future<bool> createRecipe(Recipe recipe) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await _apiService.createRecipe(recipe.toJson());

      if (response['success'] == true) {
        final newRecipe = Recipe.fromJson(response['data']);
        _recipes.insert(0, newRecipe);
        _myRecipes.insert(0, newRecipe);
        _applyFilters();

        _setLoading(false);
        return true;
      } else {
        _setError(response['message'] ?? 'Failed to create recipe');
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError('Failed to create recipe: ${e.toString()}');
      _setLoading(false);
      return false;
    }
  }

  /// Update recipe
  Future<bool> updateRecipe(Recipe recipe) async {
    try {
      _setLoading(true);
      _clearError();

      final response =
          await _apiService.updateRecipe(recipe.id, recipe.toJson());

      if (response['success'] == true) {
        final updatedRecipe = Recipe.fromJson(response['data']);

        // Update in all lists
        _updateRecipeInList(_recipes, updatedRecipe);
        _updateRecipeInList(_myRecipes, updatedRecipe);
        _updateRecipeInList(_favoriteRecipes, updatedRecipe);

        if (_selectedRecipe?.id == updatedRecipe.id) {
          _selectedRecipe = updatedRecipe;
        }

        _applyFilters();
        _setLoading(false);
        return true;
      } else {
        _setError(response['message'] ?? 'Failed to update recipe');
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError('Failed to update recipe: ${e.toString()}');
      _setLoading(false);
      return false;
    }
  }

  /// Delete recipe
  Future<bool> deleteRecipe(String recipeId) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await _apiService.deleteRecipe(recipeId);

      if (response['success'] == true) {
        // Remove from all lists
        _recipes.removeWhere((recipe) => recipe.id == recipeId);
        _myRecipes.removeWhere((recipe) => recipe.id == recipeId);
        _favoriteRecipes.removeWhere((recipe) => recipe.id == recipeId);

        if (_selectedRecipe?.id == recipeId) {
          _selectedRecipe = null;
        }

        _applyFilters();
        _setLoading(false);
        return true;
      } else {
        _setError(response['message'] ?? 'Failed to delete recipe');
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError('Failed to delete recipe: ${e.toString()}');
      _setLoading(false);
      return false;
    }
  }

  /// Toggle recipe favorite status
  Future<bool> toggleFavorite(String recipeId) async {
    try {
      final response = await _apiService.toggleRecipeFavorite(recipeId);

      if (response['success'] == true) {
        final isFavorited = response['data']['isFavorited'] as bool;

        // Update recipe in main list
        final recipeIndex = _recipes.indexWhere((r) => r.id == recipeId);
        if (recipeIndex != -1) {
          _recipes[recipeIndex] =
              _recipes[recipeIndex].copyWith(isFavorite: isFavorited);
        }

        // Update selected recipe
        if (_selectedRecipe?.id == recipeId) {
          _selectedRecipe = _selectedRecipe!.copyWith(isFavorite: isFavorited);
        }

        // Update favorites list
        if (isFavorited) {
          final recipe = _recipes.firstWhere((r) => r.id == recipeId);
          if (!_favoriteRecipes.any((r) => r.id == recipeId)) {
            _favoriteRecipes.add(recipe);
          }
        } else {
          _favoriteRecipes.removeWhere((recipe) => recipe.id == recipeId);
        }

        _applyFilters();
        return true;
      }
      return false;
    } catch (e) {
      _setError('Failed to toggle favorite: ${e.toString()}');
      return false;
    }
  }

  /// Load favorite recipes
  Future<void> loadFavoriteRecipes() async {
    try {
      final response = await _apiService.getFavoriteRecipes();

      if (response['success'] == true) {
        final List<dynamic> recipesData = response['data'];
        _favoriteRecipes =
            recipesData.map((json) => Recipe.fromJson(json)).toList();

        if (_currentFilter == RecipeFilter.favorites) {
          _applyFilters();
        }
      }
    } catch (e) {
      debugPrint('Failed to load favorite recipes: ${e.toString()}');
    }
  }

  /// Load user's recipes
  Future<void> loadMyRecipes() async {
    try {
      final response = await _apiService.getMyRecipes();

      if (response['success'] == true) {
        final List<dynamic> recipesData = response['data'];
        _myRecipes = recipesData.map((json) => Recipe.fromJson(json)).toList();

        if (_currentFilter == RecipeFilter.myRecipes) {
          _applyFilters();
        }
      }
    } catch (e) {
      debugPrint('Failed to load my recipes: ${e.toString()}');
    }
  }

  /// Search recipes
  void searchRecipes(String query) {
    _searchQuery = query;
    _currentPage = 1;
    loadRecipes(refresh: true);
  }

  /// Clear search
  void clearSearch() {
    _searchQuery = '';
    _currentPage = 1;
    loadRecipes(refresh: true);
  }

  /// Set filter
  void setFilter(RecipeFilter filter) {
    _currentFilter = filter;
    _applyFilters();
  }

  /// Set category filter
  void setCategoryFilter(RecipeCategory? category) {
    _selectedCategory = category;
    _currentPage = 1;
    loadRecipes(refresh: true);
  }

  /// Set difficulty filter
  void setDifficultyFilter(RecipeDifficulty? difficulty) {
    _selectedDifficulty = difficulty;
    _currentPage = 1;
    loadRecipes(refresh: true);
  }

  /// Set cuisine filter
  void setCuisineFilter(String? cuisine) {
    _selectedCuisine = cuisine;
    _currentPage = 1;
    loadRecipes(refresh: true);
  }

  /// Clear all filters
  void clearFilters() {
    _selectedCategory = null;
    _selectedDifficulty = null;
    _selectedCuisine = null;
    _searchQuery = '';
    _currentFilter = RecipeFilter.all;
    _currentPage = 1;
    loadRecipes(refresh: true);
  }

  /// Apply current filters to recipes
  void _applyFilters() {
    switch (_currentFilter) {
      case RecipeFilter.all:
        _filteredRecipes = List.from(_recipes);
        break;
      case RecipeFilter.favorites:
        _filteredRecipes = List.from(_favoriteRecipes);
        break;
      case RecipeFilter.myRecipes:
        _filteredRecipes = List.from(_myRecipes);
        break;
      case RecipeFilter.recent:
        _filteredRecipes = List.from(_recipes)
          ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
        break;
      case RecipeFilter.trending:
        _filteredRecipes = List.from(_recipes)
          ..sort((a, b) => (b.rating ?? 0).compareTo(a.rating ?? 0));
        break;
    }

    notifyListeners();
  }

  /// Update recipe in a list
  void _updateRecipeInList(List<Recipe> list, Recipe updatedRecipe) {
    final index = list.indexWhere((recipe) => recipe.id == updatedRecipe.id);
    if (index != -1) {
      list[index] = updatedRecipe;
    }
  }

  /// Set loading state
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  /// Set error message
  void _setError(String error) {
    _error = error;
    notifyListeners();
  }

  /// Clear error message
  void _clearError() {
    _error = null;
  }

  /// Get recipe difficulty display text
  String getDifficultyText(RecipeDifficulty difficulty) {
    switch (difficulty) {
      case RecipeDifficulty.easy:
        return 'difficulty.easy';
      case RecipeDifficulty.medium:
        return 'difficulty.medium';
      case RecipeDifficulty.hard:
        return 'difficulty.hard';
    }
  }

  /// Get category display text
  String getCategoryText(RecipeCategory category) {
    return 'categories.${category.name}';
  }
}

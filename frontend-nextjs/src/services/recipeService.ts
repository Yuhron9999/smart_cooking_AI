import { backendApi } from "./api";
import {
  Recipe,
  RecipeFormData,
  SearchFilters,
  SearchResult,
  Category,
  PaginatedResponse,
} from "@/types";

export class RecipeService {
  static async getAllRecipes(
    page: number = 0,
    size: number = 20
  ): Promise<SearchResult<Recipe>> {
    const response = await backendApi.get<PaginatedResponse<Recipe>>(
      "/api/recipes",
      {
        page,
        size,
      }
    );

    return {
      items: response.content,
      totalCount: response.totalElements,
      hasNextPage: !response.last,
      currentPage: response.number,
      totalPages: response.totalPages,
    };
  }

  static async getRecipeById(id: number): Promise<Recipe> {
    return backendApi.get<Recipe>(`/api/recipes/${id}`);
  }

  static async searchRecipes(
    filters: SearchFilters,
    page: number = 0,
    size: number = 20
  ): Promise<SearchResult<Recipe>> {
    const params = {
      ...filters,
      page,
      size,
    };

    const response = await backendApi.get<PaginatedResponse<Recipe>>(
      "/api/recipes/search",
      params
    );

    return {
      items: response.content,
      totalCount: response.totalElements,
      hasNextPage: !response.last,
      currentPage: response.number,
      totalPages: response.totalPages,
    };
  }

  static async createRecipe(data: RecipeFormData): Promise<Recipe> {
    const formData = new FormData();

    // Add recipe data
    formData.append(
      "recipe",
      JSON.stringify({
        titleEn: data.titleEn,
        titleVi: data.titleVi,
        descriptionEn: data.descriptionEn,
        descriptionVi: data.descriptionVi,
        cookingTime: data.cookingTime,
        difficulty: data.difficulty,
        servings: data.servings,
        calories: data.calories,
        categoryId: data.categoryId,
        ingredients: data.ingredients,
        instructions: data.instructions,
        tags: data.tags,
        isPublic: data.isPublic,
      })
    );

    // Add image if provided
    if (data.imageFile) {
      formData.append("image", data.imageFile);
    }

    return backendApi.upload<Recipe>("/api/recipes", formData);
  }

  static async updateRecipe(id: number, data: RecipeFormData): Promise<Recipe> {
    const formData = new FormData();

    formData.append(
      "recipe",
      JSON.stringify({
        titleEn: data.titleEn,
        titleVi: data.titleVi,
        descriptionEn: data.descriptionEn,
        descriptionVi: data.descriptionVi,
        cookingTime: data.cookingTime,
        difficulty: data.difficulty,
        servings: data.servings,
        calories: data.calories,
        categoryId: data.categoryId,
        ingredients: data.ingredients,
        instructions: data.instructions,
        tags: data.tags,
        isPublic: data.isPublic,
      })
    );

    if (data.imageFile) {
      formData.append("image", data.imageFile);
    }

    return backendApi.upload<Recipe>(`/api/recipes/${id}`, formData);
  }

  static async deleteRecipe(id: number): Promise<void> {
    return backendApi.delete<void>(`/api/recipes/${id}`);
  }

  static async getFavoriteRecipes(userId: number): Promise<Recipe[]> {
    return backendApi.get<Recipe[]>(`/api/recipes/favorites/${userId}`);
  }

  static async addToFavorites(recipeId: number): Promise<void> {
    return backendApi.post<void>(`/api/recipes/${recipeId}/favorite`);
  }

  static async removeFromFavorites(recipeId: number): Promise<void> {
    return backendApi.delete<void>(`/api/recipes/${recipeId}/favorite`);
  }

  static async rateRecipe(
    recipeId: number,
    rating: number,
    comment?: string
  ): Promise<void> {
    return backendApi.post<void>(`/api/recipes/${recipeId}/rate`, {
      rating,
      comment,
    });
  }

  static async getRecipesByCategory(
    categoryId: number,
    page: number = 0,
    size: number = 20
  ): Promise<SearchResult<Recipe>> {
    const response = await backendApi.get<PaginatedResponse<Recipe>>(
      `/api/recipes/category/${categoryId}`,
      {
        page,
        size,
      }
    );

    return {
      items: response.content,
      totalCount: response.totalElements,
      hasNextPage: !response.last,
      currentPage: response.number,
      totalPages: response.totalPages,
    };
  }

  static async getRecipesByRegion(region: string): Promise<Recipe[]> {
    return backendApi.get<Recipe[]>(`/api/recipes/region/${region}`);
  }

  static async getPopularRecipes(limit: number = 10): Promise<Recipe[]> {
    return backendApi.get<Recipe[]>("/api/recipes/popular", { limit });
  }

  static async getRecentRecipes(limit: number = 10): Promise<Recipe[]> {
    return backendApi.get<Recipe[]>("/api/recipes/recent", { limit });
  }

  static async getUserRecipes(
    userId: number,
    page: number = 0,
    size: number = 20
  ): Promise<SearchResult<Recipe>> {
    const response = await backendApi.get<PaginatedResponse<Recipe>>(
      `/api/recipes/user/${userId}`,
      {
        page,
        size,
      }
    );

    return {
      items: response.content,
      totalCount: response.totalElements,
      hasNextPage: !response.last,
      currentPage: response.number,
      totalPages: response.totalPages,
    };
  }

  // Categories
  static async getAllCategories(): Promise<Category[]> {
    return backendApi.get<Category[]>("/api/categories");
  }

  static async getCategoryById(id: number): Promise<Category> {
    return backendApi.get<Category>(`/api/categories/${id}`);
  }

  static async getCategoriesByLanguage(language: string): Promise<Category[]> {
    return backendApi.get<Category[]>("/api/categories/language", { language });
  }
}

export default RecipeService;

// ============================================================================
// USER DATA SERVICE - Dynamic User Data Management
// ============================================================================
// Quản lý dữ liệu động của người dùng với database persistence

import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface UserData {
  id: number;
  username: string;
  email: string;
  profileData: UserProfile;
  preferences: UserPreferences;
  cuisinePreferences: string[];
  dietaryRestrictions: DietaryRestriction[];
  favoriteRecipes: number[];
  createdRecipes: Recipe[];
  learningProgress: LearningProgress[];
  aiInteractions: AiInteraction[];
}

export interface UserProfile {
  displayName: string;
  bio: string;
  avatar: string;
  cookingSkillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  location: {
    city: string;
    country: string;
    timezone: string;
  };
  languagePreference: string;
  theme: 'light' | 'dark' | 'auto';
}

export interface UserPreferences {
  defaultServingSize: number;
  preferredCookingTime: string;
  spiceLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  mealPlanDays: number;
  notificationSettings: {
    email: boolean;
    push: boolean;
    mealReminders: boolean;
    recipeUpdates: boolean;
  };
}

export type DietaryRestriction = 
  | 'VEGAN' | 'VEGETARIAN' | 'GLUTEN_FREE' | 'DAIRY_FREE' 
  | 'NUT_FREE' | 'KETO' | 'PALEO' | 'HALAL' | 'KOSHER';

export interface Recipe {
  id: number;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  cookingTime: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  servings: number;
  imageUrl?: string;
  ingredients: RecipeIngredient[];
  ingredientsJson?: string; // JSON string version for backward compatibility
  instructions: RecipeInstruction[];
  instructionsJson?: string; // JSON string version for backward compatibility
  calories?: number;
  category?: string;
  tagsJson?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeIngredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface RecipeInstruction {
  id: number;
  stepNumber: number;
  instructionVi: string;
  instructionEn: string;
  imageUrl?: string;
  tips: string[];
}

export interface LearningProgress {
  id: number;
  pathId: number;
  stepId: number;
  isCompleted: boolean;
  completedAt?: Date;
  notes: string;
}

export interface AiInteraction {
  id: number;
  type: 'CHAT' | 'RECIPE_GENERATION' | 'IMAGE_RECOGNITION' | 'VOICE';
  inputData: any;
  outputData: any;
  language: string;
  processingTime: number;
  createdAt: Date;
}

// ============================================================================
// USER DATA SERVICE CLASS
// ============================================================================

class UserDataService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  // Cấu hình axios với authentication
  private getAxiosConfig() {
    return {
      headers: {
        'Authorization': this.token ? `Bearer ${this.token}` : '',
        'Content-Type': 'application/json',
      },
    };
  }

  // ============================================================================
  // USER PROFILE MANAGEMENT
  // ============================================================================

  async getUserData(userId: number): Promise<UserData> {
    const response = await axios.get(`${API_BASE}/users/${userId}/complete`, this.getAxiosConfig());
    return response.data;
  }

  async updateUserProfile(userId: number, profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await axios.put(
      `${API_BASE}/users/${userId}/profile`, 
      profileData, 
      this.getAxiosConfig()
    );
    return response.data;
  }

  async updateUserPreferences(userId: number, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    const response = await axios.put(
      `${API_BASE}/users/${userId}/preferences`, 
      preferences, 
      this.getAxiosConfig()
    );
    return response.data;
  }

  // ============================================================================
  // CUISINE & DIETARY PREFERENCES
  // ============================================================================

  async addCuisinePreference(userId: number, cuisine: string): Promise<string[]> {
    const response = await axios.post(
      `${API_BASE}/users/${userId}/cuisine-preferences`, 
      { cuisine }, 
      this.getAxiosConfig()
    );
    return response.data;
  }

  async removeCuisinePreference(userId: number, cuisine: string): Promise<string[]> {
    const response = await axios.delete(
      `${API_BASE}/users/${userId}/cuisine-preferences/${cuisine}`, 
      this.getAxiosConfig()
    );
    return response.data;
  }

  async updateDietaryRestrictions(userId: number, restrictions: DietaryRestriction[]): Promise<DietaryRestriction[]> {
    const response = await axios.put(
      `${API_BASE}/users/${userId}/dietary-restrictions`, 
      { restrictions }, 
      this.getAxiosConfig()
    );
    return response.data;
  }

  // ============================================================================
  // RECIPE MANAGEMENT
  // ============================================================================

  async createRecipe(userId: number, recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
    const response = await axios.post(
      `${API_BASE}/recipes`, 
      { ...recipeData, createdBy: userId }, 
      this.getAxiosConfig()
    );
    return response.data;
  }

  async updateRecipe(recipeId: number, recipeData: Partial<Recipe>): Promise<Recipe> {
    const response = await axios.put(
      `${API_BASE}/recipes/${recipeId}`, 
      recipeData, 
      this.getAxiosConfig()
    );
    return response.data;
  }

  async deleteRecipe(recipeId: number): Promise<void> {
    await axios.delete(`${API_BASE}/recipes/${recipeId}`, this.getAxiosConfig());
  }

  async getUserRecipes(userId: number): Promise<Recipe[]> {
    const response = await axios.get(`${API_BASE}/users/${userId}/recipes`, this.getAxiosConfig());
    return response.data;
  }

  // ============================================================================
  // FAVORITES MANAGEMENT
  // ============================================================================

  async addToFavorites(userId: number, recipeId: number): Promise<void> {
    await axios.post(
      `${API_BASE}/users/${userId}/favorites`, 
      { recipeId }, 
      this.getAxiosConfig()
    );
  }

  async removeFromFavorites(userId: number, recipeId: number): Promise<void> {
    await axios.delete(
      `${API_BASE}/users/${userId}/favorites/${recipeId}`, 
      this.getAxiosConfig()
    );
  }

  async getUserFavorites(userId: number): Promise<Recipe[]> {
    const response = await axios.get(`${API_BASE}/users/${userId}/favorites`, this.getAxiosConfig());
    return response.data;
  }

  // ============================================================================
  // LEARNING PROGRESS
  // ============================================================================

  async updateLearningProgress(
    userId: number, 
    pathId: number, 
    stepId: number, 
    isCompleted: boolean,
    notes?: string
  ): Promise<LearningProgress> {
    const response = await axios.put(
      `${API_BASE}/users/${userId}/learning-progress`, 
      { pathId, stepId, isCompleted, notes }, 
      this.getAxiosConfig()
    );
    return response.data;
  }

  async getUserLearningProgress(userId: number): Promise<LearningProgress[]> {
    const response = await axios.get(`${API_BASE}/users/${userId}/learning-progress`, this.getAxiosConfig());
    return response.data;
  }

  // ============================================================================
  // AI INTERACTIONS TRACKING
  // ============================================================================

  async trackAiInteraction(
    userId: number, 
    type: AiInteraction['type'], 
    inputData: any, 
    outputData: any,
    language: string = 'vi'
  ): Promise<AiInteraction> {
    const response = await axios.post(
      `${API_BASE}/users/${userId}/ai-interactions`, 
      { type, inputData, outputData, language }, 
      this.getAxiosConfig()
    );
    return response.data;
  }

  async getUserAiInteractions(userId: number, page = 0, size = 20): Promise<{
    content: AiInteraction[];
    totalPages: number;
    totalElements: number;
  }> {
    const response = await axios.get(
      `${API_BASE}/users/${userId}/ai-interactions?page=${page}&size=${size}`, 
      this.getAxiosConfig()
    );
    return response.data;
  }

  // ============================================================================
  // MEAL PLANNING
  // ============================================================================

  async createMealPlan(userId: number, days: number, preferences?: any): Promise<any> {
    const response = await axios.post(
      `${API_BASE}/users/${userId}/meal-plans`, 
      { days, preferences }, 
      this.getAxiosConfig()
    );
    return response.data;
  }

  async getUserMealPlans(userId: number): Promise<any[]> {
    const response = await axios.get(`${API_BASE}/users/${userId}/meal-plans`, this.getAxiosConfig());
    return response.data;
  }

  // ============================================================================
  // SHOPPING LISTS
  // ============================================================================

  async createShoppingList(userId: number, name: string, recipeIds: number[]): Promise<any> {
    const response = await axios.post(
      `${API_BASE}/users/${userId}/shopping-lists`, 
      { name, recipeIds }, 
      this.getAxiosConfig()
    );
    return response.data;
  }

  async updateShoppingList(listId: number, items: any[]): Promise<any> {
    const response = await axios.put(
      `${API_BASE}/shopping-lists/${listId}`, 
      { items }, 
      this.getAxiosConfig()
    );
    return response.data;
  }

  // ============================================================================
  // ANALYTICS & INSIGHTS
  // ============================================================================

  async getUserAnalytics(userId: number): Promise<{
    totalRecipes: number;
    totalInteractions: number;
    favoritesCuisines: string[];
    cookingStreak: number;
    averageRating: number;
    learningProgress: number;
  }> {
    const response = await axios.get(`${API_BASE}/users/${userId}/analytics`, this.getAxiosConfig());
    return response.data;
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  async bulkDeleteRecipes(recipeIds: number[]): Promise<{ deletedCount: number; success: boolean }> {
    const response = await axios.delete(`${API_BASE}/user-data/recipes/bulk`, {
      ...this.getAxiosConfig(),
      data: { recipeIds }
    });
    return response.data;
  }

  async bulkUpdateRecipes(updates: Array<{ id: number; data: Partial<Recipe> }>): Promise<Recipe[]> {
    const response = await axios.put(`${API_BASE}/user-data/recipes/bulk`, updates, this.getAxiosConfig());
    return response.data;
  }

  // ============================================================================
  // AI INTERACTIONS
  // ============================================================================

  async saveAiInteraction(interaction: {
    interactionType: string;
    inputData: any;
    outputData: any;
  }): Promise<{ success: true; data: any }> {
    const response = await axios.post(`${API_BASE}/user-data/ai-interactions`, interaction, this.getAxiosConfig());
    return response.data;
  }

  // ============================================================================
  // FAVORITES
  // ============================================================================

  async addFavoriteRecipe(recipeId: number, rating?: number): Promise<{ success: boolean }> {
    const response = await axios.post(`${API_BASE}/user-data/favorites`, { 
      recipeId, 
      rating 
    }, this.getAxiosConfig());
    return response.data;
  }

  async removeFavoriteRecipe(recipeId: number): Promise<{ success: boolean }> {
    const response = await axios.delete(`${API_BASE}/user-data/favorites/${recipeId}`, this.getAxiosConfig());
    return response.data;
  }

  async exportUserData(userId: number): Promise<UserData> {
    const response = await axios.get(
      `${API_BASE}/users/${userId}/export`, 
      { ...this.getAxiosConfig(), responseType: 'blob' }
    );
    return response.data;
  }

  async importUserData(userId: number, data: Partial<UserData>): Promise<UserData> {
    const response = await axios.post(
      `${API_BASE}/users/${userId}/import`, 
      data, 
      this.getAxiosConfig()
    );
    return response.data;
  }

  // ============================================================================
  // AI RECIPE GENERATION
  // ============================================================================

  async generateRecipeFromAI(ingredients: string[], preferences?: {
    cuisineType?: string;
    difficulty?: string;
    cookingTime?: number;
    servings?: number;
  }): Promise<Recipe> {
    const response = await axios.post(
      `${API_BASE}/ai/generate-recipe`, 
      { ingredients, preferences }, 
      this.getAxiosConfig()
    );
    return response.data;
  }
}

// ============================================================================
// ADDITIONAL INTERFACES & TYPES
// ============================================================================

export interface CreateRecipeRequest {
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  cookingTime: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  servings: number;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  imageUrl?: string;
  isPublic: boolean;
  calories?: number;
  category?: string;
  tagsJson?: string;
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const userDataService = new UserDataService();
export default userDataService;

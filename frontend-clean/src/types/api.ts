// API interfaces cho tương tác với backend

// Enum cho SpicePreference
export enum SpicePreference {
  MILD = 'MILD',
  MEDIUM = 'MEDIUM',
  HOT = 'HOT',
  EXTRA_HOT = 'EXTRA_HOT'
}

// Enum cho AiType
export enum AiType {
  GPT = 'GPT',
  GEMINI = 'GEMINI',
  VOICE = 'VOICE',
  VISION = 'VISION'
}

// Interface cho UserPreference
export interface UserPreference {
  id?: number;
  userId: number;
  languagePreference: string;
  cuisinePreferences: string[];
  dietaryPreferences: string[];
  likedIngredients: string[];
  dislikedIngredients: string[];
  spicePreference: SpicePreference;
  aiAssistantEnabled: boolean;
  preferredAiModel: string;
  darkMode: boolean;
  personalizationLevel: number;
  enableRecommendations: boolean;
  dynamicPreferences?: any;
  createdAt?: string;
  updatedAt?: string;
}

// Interface cho AiGenerationRequest
export interface AiGenerationRequest {
  userId: number;
  prompt: string;
  aiModel?: string;
  generationType?: string;
  parameters?: any;
  languageCode?: string;
  includeDietaryRestrictions?: boolean;
  includePreferences?: boolean;
  maxTokens?: number;
  temperature?: number;
}

// Interface cho AiGenerationResponse
export interface AiGenerationResponse {
  content: string;
  success: boolean;
  errorMessage?: string;
  processingTimeMs: number;
  tokensUsed?: number;
  metadata?: any;
}

// Interface cho RecipeDto
export interface RecipeDto {
  id?: number;
  titleVi?: string;
  titleEn?: string;
  descriptionVi?: string;
  descriptionEn?: string;
  cookingTime?: number;
  difficulty?: string;
  servings?: number;
  imageUrl?: string;
  ingredients?: string[];
  instructions?: string[];
  tags?: string[];
  aiGenerated?: boolean;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
  source?: string;
  views?: number;
  favorites?: number;
  averageRating?: number;
  totalRatings?: number;
}

// Interface cho UserAiInteraction
export interface UserAiInteraction {
  id?: number;
  userId: number;
  input: string;
  output: string;
  aiType: AiType;
  metadata?: any;
  executionTimeMs?: number;
  tokensUsed?: number;
  costUsd?: number;
  success?: boolean;
  errorMessage?: string;
  createdAt?: string;
}

// Interface cho ParsedRecipe (phân tích từ output AI)
export interface ParsedRecipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  notes: string;
}

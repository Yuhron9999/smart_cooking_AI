// ===== USER & AUTHENTICATION =====
export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  role: "USER" | "ADMIN" | "CHEF";
  provider: "GOOGLE" | "LOCAL";
  providerId?: string;
  languagePreference: string;
  latitude?: number;
  longitude?: number;
  regionPreference?: string;
  city?: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresAt: string;
}

// ===== RECIPE MANAGEMENT =====
export interface Recipe {
  id: number;
  titleEn: string;
  titleVi?: string;
  descriptionEn?: string;
  descriptionVi?: string;
  imageUrl?: string;
  cookingTime: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  servings: number;
  calories?: number;
  createdBy: number;
  categoryId?: number;
  category?: Category;
  originRegion?: string;
  locationTag?: string;
  latitude?: number;
  longitude?: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  tags: string[];
  nutritionInfo?: NutritionInfo;
  ratings?: RecipeRating[];
  averageRating?: number;
  isFavorite?: boolean;
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  notes?: string;
  isOptional?: boolean;
}

export interface Instruction {
  id: number;
  stepNumber: number;
  description: string;
  imageUrl?: string;
  estimatedTime?: number;
  tips?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface RecipeRating {
  id: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Category {
  id: number;
  nameEn: string;
  nameVi?: string;
  descriptionEn?: string;
  descriptionVi?: string;
  imageUrl?: string;
  parentCategoryId?: number;
  active: boolean;
  recipeCount?: number;
}

// ===== AI FEATURES =====
export interface AIInteraction {
  id: number;
  userId: number;
  interactionType: "CHAT" | "RECIPE_GENERATION" | "IMAGE_RECOGNITION" | "VOICE";
  inputData: string;
  outputData: string;
  userLanguage: string;
  processingTimeMs: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: string;
  isLoading?: boolean;
  metadata?: {
    recipeId?: number;
    imageUrl?: string;
    voiceData?: VoiceData;
  };
}

export interface VoiceData {
  audioUrl: string;
  transcript: string;
  duration: number;
  language: string;
}

export interface AIRecipeRequest {
  ingredients: string[];
  preferences?: {
    difficulty?: "EASY" | "MEDIUM" | "HARD";
    cookingTime?: number;
    servings?: number;
    dietaryRestrictions?: string[];
    cuisine?: string;
  };
  language: string;
}

export interface AIRecipeResponse {
  recipe: Recipe;
  confidence: number;
  alternatives?: Recipe[];
  tips: string[];
}

export interface ImageRecognitionRequest {
  imageFile: File;
  language: string;
}

export interface ImageRecognitionResponse {
  recognizedItems: string[];
  confidence: number;
  suggestedRecipes: Recipe[];
  nutritionEstimate?: NutritionInfo;
}

// ===== LEARNING SYSTEM =====
export interface LearningPath {
  id: number;
  titleEn: string;
  titleVi?: string;
  descriptionEn?: string;
  descriptionVi?: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedHours: number;
  imageUrl?: string;
  createdBy: number;
  isActive: boolean;
  createdAt: string;
  steps: LearningPathStep[];
  enrollmentCount?: number;
  completionRate?: number;
}

export interface LearningPathStep {
  id: number;
  learningPathId: number;
  orderNumber: number;
  titleEn: string;
  titleVi?: string;
  descriptionEn?: string;
  descriptionVi?: string;
  estimatedMinutes: number;
  recipeId?: number;
  recipe?: Recipe;
  videoUrl?: string;
  isCompleted?: boolean;
}

export interface UserLearningProgress {
  id: number;
  userId: number;
  learningPathId: number;
  learningPath?: LearningPath;
  progressPercentage: number;
  isCompleted: boolean;
  startedAt: string;
  completedAt?: string;
  lastAccessedAt: string;
  totalTimeSpentMinutes: number;
  currentStepId?: number;
}

// ===== VOICE ASSISTANT =====
export interface VoiceCommand {
  command: string;
  parameters?: Record<string, any>;
  confidence: number;
}

export interface VoiceResponse {
  text: string;
  audioUrl?: string;
  actions?: VoiceAction[];
}

export interface VoiceAction {
  type: "navigation" | "recipe_search" | "timer" | "measurement_convert";
  payload: Record<string, any>;
}

// ===== NOTIFICATIONS =====
export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
}

// ===== SEARCH & FILTERS =====
export interface SearchFilters {
  query?: string;
  categoryId?: number;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  cookingTime?: {
    min?: number;
    max?: number;
  };
  servings?: number;
  dietaryRestrictions?: string[];
  ingredients?: string[];
  region?: string;
  rating?: number;
  sortBy?: "relevance" | "rating" | "cookingTime" | "createdAt" | "popularity";
  sortOrder?: "asc" | "desc";
}

export interface SearchResult<T> {
  items: T[];
  totalCount: number;
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
}

// ===== API RESPONSES =====
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

// ===== LOCATION =====
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
}

export interface NearbyStore {
  id: string;
  name: string;
  address: string;
  location: Location;
  distance: number;
  rating: number;
  type:
    | "supermarket"
    | "butcher"
    | "fish_market"
    | "vegetable_market"
    | "spice_shop";
  openingHours?: string;
  phoneNumber?: string;
}

// ===== UI COMPONENTS =====
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

// ===== FORM TYPES =====
export interface RecipeFormData {
  titleEn: string;
  titleVi?: string;
  descriptionEn?: string;
  descriptionVi?: string;
  cookingTime: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  servings: number;
  calories?: number;
  categoryId?: number;
  ingredients: Ingredient[];
  instructions: Instruction[];
  tags: string[];
  isPublic: boolean;
  imageFile?: File;
}

export interface UserProfileFormData {
  name: string;
  languagePreference: string;
  regionPreference?: string;
  dietaryRestrictions?: string[];
  skillLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

// ===== ANALYTICS =====
export interface UserStatistics {
  totalRecipes: number;
  favoriteRecipes: number;
  completedLearningPaths: number;
  aiInteractions: number;
  averageCookingTime: number;
  preferredCuisine: string;
  skillProgress: number;
}

export interface SystemHealthMetrics {
  status: "healthy" | "warning" | "error";
  uptime: number;
  totalUsers: number;
  totalRecipes: number;
  aiRequestsToday: number;
  averageResponseTime: number;
}

// ===== THEME =====
export interface ThemeConfig {
  mode: "light" | "dark" | "system";
  primaryColor: string;
  accentColor: string;
  fontSize: "sm" | "md" | "lg";
  animations: boolean;
}

// ===== REGIONAL FEATURES =====
export interface RegionalProfile {
  region: string;
  preferredCuisines: string[];
  spiceTolerance: "LOW" | "MEDIUM" | "HIGH";
  favoriteIngredients: string[];
  dietaryPreferences: string[];
}

export interface RegionalSuggestion {
  region: string;
  recipes: Recipe[];
  popularIngredients: string[];
  culturalTips: string[];
}

import { aiServiceApi } from "./api";
import {
  ApiResponse,
  AIRecipeRequest,
  AIRecipeResponse,
  ImageRecognitionRequest,
  ImageRecognitionResponse,
  ChatMessage,
  VoiceCommand,
  VoiceData,
  VoiceResponse,
} from "../types";

// AI Chat Types
export interface ChatRequest {
  message: string;
  language?: string;
}

export interface ChatResponse {
  response: string;
  model: string;
  timestamp?: string;
}

// Ingredient Suggestions Types
export interface IngredientSuggestionsRequest {
  dish_name: string;
  language?: string;
}

export interface IngredientSuggestionsResponse {
  main_ingredients: string[];
  seasonings: string[];
  vegetables: string[];
  optional: string[];
  cooking_tips: string[];
  dish_name: string;
  cuisine_type: string;
}

// Nutrition Analysis Types
export interface NutritionAnalysisRequest {
  dish_name: string;
  ingredients: string[];
  language?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
}

export interface IngredientNutrition {
  name: string;
  nutrition_per_100g: NutritionInfo;
}

export interface HealthAssessment {
  score: number;
  grade: string;
  recommendations: string[];
}

export interface NutritionAnalysisResponse {
  per_serving: NutritionInfo;
  total_dish: NutritionInfo;
  servings: number;
  detailed_ingredients: IngredientNutrition[];
  health_assessment: HealthAssessment;
}

// Learning Path Types
export interface LearningPathRequest {
  user_level: "beginner" | "intermediate" | "advanced";
  cuisine_preference: string;
  language?: string;
  available_time?: number;
}

export interface WeeklyPlan {
  week: number;
  title: string;
  skills: string[];
  practice_dishes: string[];
  estimated_time: string;
}

export interface LearningPathResponse {
  title: string;
  duration_weeks: number;
  total_dishes: number;
  weekly_plan: WeeklyPlan[];
  final_goals: string[];
  customized_for: {
    skill_level: string;
    cuisine_preference: string;
    available_time: number;
  };
}

// Vision Analysis Types
export interface VisionAnalysisRequest {
  image_data: string; // base64 encoded image
  language?: string;
}

export interface VisionAnalysisResponse {
  analysis: string;
  detected_items: string[];
  confidence: number;
}

// Regional Suggestions Types
export interface RegionalSuggestionsRequest {
  latitude: number;
  longitude: number;
  language?: string;
}

export interface RegionalSuggestionsResponse {
  region: string;
  suggestions: string[];
  message: string;
}

// Nearby Places Types
export interface NearbyPlacesRequest {
  latitude: number;
  longitude: number;
  ingredients: string[];
  radius?: number;
}

export interface NearbyPlace {
  name: string;
  address: string;
  rating: number;
  distance: number;
  place_type: string;
}

export interface NearbyPlacesResponse {
  places: NearbyPlace[];
  total_found: number;
}

export class AIService {
  // Recipe Generation
  static async generateRecipe(
    request: AIRecipeRequest
  ): Promise<AIRecipeResponse> {
    return aiServiceApi.post<AIRecipeResponse>(
      "/api/ai/generate-recipe",
      request
    );
  }

  static async generateRecipeFromIngredients(
    ingredients: string[],
    language: string = "vi"
  ): Promise<AIRecipeResponse> {
    return this.generateRecipe({
      ingredients,
      language,
    });
  }

  // Image Recognition
  static async recognizeFood(
    request: ImageRecognitionRequest
  ): Promise<ImageRecognitionResponse> {
    const formData = new FormData();
    formData.append("image", request.imageFile);
    formData.append("language", request.language);

    return aiServiceApi.upload<ImageRecognitionResponse>(
      "/api/ai/vision",
      formData
    );
  }

  static async recognizeFoodFromFile(
    file: File,
    language: string = "vi"
  ): Promise<ImageRecognitionResponse> {
    return this.recognizeFood({ imageFile: file, language });
  }

  // Chat System
  static async sendChatMessage(
    message: string,
    language: string = "vi",
    context?: any
  ): Promise<ChatMessage> {
    const response = await aiServiceApi.post<{ response: string }>(
      "/api/ai/chat",
      {
        message,
        language,
        context,
      }
    );

    return {
      id: Date.now().toString(),
      type: "assistant",
      content: response.response,
      timestamp: new Date().toISOString(),
    };
  }

  static async getChatHistory(
    userId: number,
    limit: number = 50
  ): Promise<ChatMessage[]> {
    return aiServiceApi.get<ChatMessage[]>("/api/ai/chat/history", {
      userId,
      limit,
    });
  }

  // Voice Processing
  static async processVoiceCommand(
    audioBlob: Blob,
    language: string = "vi"
  ): Promise<VoiceCommand> {
    const formData = new FormData();
    formData.append("audio", audioBlob, "voice.wav");
    formData.append("language", language);

    return aiServiceApi.upload<VoiceCommand>("/api/ai/voice/stt", formData);
  }

  static async synthesizeSpeech(
    text: string,
    language: string = "vi",
    voice: string = "default"
  ): Promise<VoiceData> {
    const response = await aiServiceApi.post<{ audioUrl: string }>(
      "/api/ai/voice/tts",
      {
        text,
        language,
        voice,
      }
    );

    return {
      audioUrl: response.audioUrl,
      transcript: text,
      duration: 0, // Will be calculated on client side
      language,
    };
  }

  static async processVoiceInteraction(
    audioBlob: Blob,
    language: string = "vi"
  ): Promise<VoiceResponse> {
    const formData = new FormData();
    formData.append("audio", audioBlob, "voice.wav");
    formData.append("language", language);

    return aiServiceApi.upload<VoiceResponse>("/api/ai/voice", formData);
  }

  // Smart Suggestions
  static async getRegionalSuggestions(
    location: { latitude: number; longitude: number },
    language: string = "vi"
  ) {
    return aiServiceApi.post("/api/ai/suggestions/regional", {
      location,
      language,
    });
  }

  static async getNearbyStores(
    location: { latitude: number; longitude: number },
    ingredients: string[]
  ) {
    return aiServiceApi.post("/api/ai/stores/nearby", {
      location,
      ingredients,
    });
  }

  // Nutrition Analysis
  static async analyzeNutrition(recipeId: number) {
    return aiServiceApi.get(`/api/ai/nutrition/analyze/${recipeId}`);
  }

  static async getHealthyAlternatives(
    recipeId: number,
    dietaryRestrictions: string[]
  ) {
    return aiServiceApi.post(`/api/ai/recipes/${recipeId}/alternatives`, {
      dietaryRestrictions,
    });
  }

  // Learning Assistance
  static async getCookingTips(
    recipeId: number,
    difficulty: string,
    language: string = "vi"
  ) {
    return aiServiceApi.get("/api/ai/cooking/tips", {
      recipeId,
      difficulty,
      language,
    });
  }

  static async getMeasurementConversion(
    from: string,
    to: string,
    amount: number
  ) {
    return aiServiceApi.post("/api/ai/convert/measurement", {
      from,
      to,
      amount,
    });
  }

  // Recipe Improvement
  static async suggestRecipeImprovements(
    recipeId: number,
    language: string = "vi"
  ) {
    return aiServiceApi.get(`/api/ai/recipes/${recipeId}/improve`, {
      language,
    });
  }

  static async adaptRecipeForDiet(
    recipeId: number,
    dietType: string,
    language: string = "vi"
  ) {
    return aiServiceApi.post(`/api/ai/recipes/${recipeId}/adapt`, {
      dietType,
      language,
    });
  }

  // Interaction Analytics
  static async logInteraction(
    type: "CHAT" | "RECIPE_GENERATION" | "IMAGE_RECOGNITION" | "VOICE",
    inputData: any,
    outputData: any,
    language: string = "vi"
  ) {
    return aiServiceApi.post("/api/ai/interactions/log", {
      interactionType: type,
      inputData: JSON.stringify(inputData),
      outputData: JSON.stringify(outputData),
      language,
    });
  }

  static async getInteractionHistory(userId: number, limit: number = 50) {
    return aiServiceApi.get("/api/ai/interactions/history", {
      userId,
      limit,
    });
  }
}

export default AIService;

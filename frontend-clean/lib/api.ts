// API Service for Smart Cooking AI
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const AI_SERVICE_URL =
  process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8001";

// Create axios instances
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

const aiClient = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptors for authentication
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

aiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptors for error handling
const handleResponseError = (error: any) => {
  if (error.response?.status === 401) {
    localStorage.removeItem("authToken");
    window.location.href = "/auth";
  }
  return Promise.reject(error);
};

apiClient.interceptors.response.use(
  (response) => response,
  handleResponseError
);
aiClient.interceptors.response.use((response) => response, handleResponseError);

// Authentication API
export const authAPI = {
  googleLogin: async (userData: any) => {
    const response = await apiClient.post("/api/auth/google-login", userData);
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    await apiClient.post("/api/auth/logout");
    localStorage.removeItem("authToken");
  },

  getCurrentUser: async () => {
    const response = await apiClient.get("/api/auth/me");
    return response.data;
  },
};

// Recipe API
export const recipeAPI = {
  getRecipes: async (params?: any) => {
    const response = await apiClient.get("/api/recipes", { params });
    return response.data;
  },

  getRecipe: async (id: string) => {
    const response = await apiClient.get(`/api/recipes/${id}`);
    return response.data;
  },

  createRecipe: async (recipe: any) => {
    const response = await apiClient.post("/api/recipes", recipe);
    return response.data;
  },

  updateRecipe: async (id: string, recipe: any) => {
    const response = await apiClient.put(`/api/recipes/${id}`, recipe);
    return response.data;
  },

  deleteRecipe: async (id: string) => {
    const response = await apiClient.delete(`/api/recipes/${id}`);
    return response.data;
  },

  favoriteRecipe: async (id: string) => {
    const response = await apiClient.post(`/api/recipes/${id}/favorite`);
    return response.data;
  },
};

// AI Service API
export const aiAPI = {
  generateRecipe: async (ingredients: string[], options?: any) => {
    const response = await aiClient.post("/api/ai/generate-recipe", {
      ingredients,
      ...options,
    });
    return response.data;
  },

  analyzeImage: async (imageFile: File) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await aiClient.post("/api/ai/vision", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  chatWithAI: async (message: string, context?: any) => {
    const response = await aiClient.post("/api/ai/chat", {
      message,
      context,
    });
    return response.data;
  },

  speechToText: async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "speech.wav");

    const response = await aiClient.post("/api/ai/voice/stt", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  textToSpeech: async (text: string, language = "vi") => {
    const response = await aiClient.post(
      "/api/ai/voice/tts",
      {
        text,
        language,
      },
      {
        responseType: "blob",
      }
    );
    return response.data;
  },
};

// User API
export const userAPI = {
  updateProfile: async (userId: string, profile: any) => {
    const response = await apiClient.put(
      `/api/user/${userId}/profile`,
      profile
    );
    return response.data;
  },

  updateLanguage: async (userId: string, language: string) => {
    const response = await apiClient.put(`/api/user/${userId}/language`, {
      language,
    });
    return response.data;
  },

  getProgress: async () => {
    const response = await apiClient.get("/api/learning/progress");
    return response.data;
  },

  createFeedback: async (feedback: any) => {
    const response = await apiClient.post("/api/feedback", feedback);
    return response.data;
  },

  updateLocation: async (location: any) => {
    const response = await apiClient.put("/api/user/location", location);
    return response.data;
  },

  getRegionalSuggestions: async () => {
    const response = await apiClient.get("/api/suggestions/regional");
    return response.data;
  },

  findNearbyStores: async (ingredients: string[]) => {
    const response = await apiClient.post("/api/stores/nearby", {
      ingredients,
    });
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  trackInteraction: async (data: any) => {
    const response = await apiClient.post("/api/analytics/track", data);
    return response.data;
  },

  getHistory: async () => {
    const response = await apiClient.get("/api/analytics/history");
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get("/api/analytics/stats");
    return response.data;
  },
};

export default {
  auth: authAPI,
  recipe: recipeAPI,
  ai: aiAPI,
  user: userAPI,
  analytics: analyticsAPI,
};

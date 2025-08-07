import { useState, useEffect, useContext } from 'react';
import axios, { AxiosInstance } from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { 
  UserPreference, 
  AiGenerationRequest, 
  AiGenerationResponse, 
  RecipeDto,
  UserAiInteraction
} from '../types/api';

interface SmartCookingApiState {
  loading: boolean;
  error: string | null;
}

interface SmartCookingApiHook extends SmartCookingApiState {
  // User preferences API
  getUserPreferences: (userId: number) => Promise<UserPreference>;
  saveUserPreferences: (preferences: UserPreference) => Promise<UserPreference>;
  updateUserPreference: (userId: number, field: string, value: any) => Promise<UserPreference>;
  addCuisinePreference: (userId: number, cuisine: string) => Promise<UserPreference>;
  addLikedIngredient: (userId: number, ingredient: string) => Promise<UserPreference>;
  addDislikedIngredient: (userId: number, ingredient: string) => Promise<UserPreference>;
  
  // AI generation API
  generateAiContent: (requestData: AiGenerationRequest) => Promise<AiGenerationResponse>;
  generateRecipe: (requestData: AiGenerationRequest) => Promise<AiGenerationResponse>;
  generateMealPlan: (requestData: AiGenerationRequest) => Promise<AiGenerationResponse>;
  getRecommendedRecipes: (userId: number, limit?: number) => Promise<RecipeDto[]>;
  getPersonalizedMealPlan: (userId: number, days?: number) => Promise<RecipeDto[]>;
  analyzeCookingTrends: (userId: number) => Promise<string>;
  
  // AI interaction history API
  getUserAiInteractions: (userId: number, page?: number, size?: number) => Promise<{ content: UserAiInteraction[], totalPages: number }>;
  searchAiInteractions: (userId: number, query: string) => Promise<UserAiInteraction[]>;
  getAiInteractionStats: (userId: number) => Promise<{ totalExecutionTimeMs: number, totalTokensUsed: number }>;
}

export const useSmartCookingApi = (): SmartCookingApiHook => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cấu hình axios
  const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Thêm token vào header nếu người dùng đã đăng nhập
  useEffect(() => {
    if (user && user.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [user]);

  // Xử lý lỗi
  const handleError = (err: any): Promise<never> => {
    console.error('API Error:', err);
    setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
    setLoading(false);
    return Promise.reject(err);
  };

  // --- USER PREFERENCES API ---

  // Lấy tùy chọn người dùng
  const getUserPreferences = async (userId: number): Promise<UserPreference> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/user-preferences/${userId}`);
      setLoading(false);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };

  // Lưu tùy chọn người dùng
  const saveUserPreferences = async (preferences: UserPreference): Promise<UserPreference> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/user-preferences', preferences);
      setLoading(false);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };

  // Cập nhật một trường trong tùy chọn người dùng
  const updateUserPreference = async (userId: number, field: string, value: any): Promise<UserPreference> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.patch(`/user-preferences/${userId}`, { [field]: value });
      setLoading(false);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };

  // Thêm sở thích ẩm thực
  const addCuisinePreference = async (userId: number, cuisine: string): Promise<UserPreference> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`/user-preferences/${userId}/cuisines`, { cuisine });
      setLoading(false);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };

  // Thêm nguyên liệu yêu thích
  const addLikedIngredient = async (userId: number, ingredient: string): Promise<UserPreference> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`/user-preferences/${userId}/liked-ingredients`, { ingredient });
      setLoading(false);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };

  // Thêm nguyên liệu không thích
  const addDislikedIngredient = async (userId: number, ingredient: string): Promise<UserPreference> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`/user-preferences/${userId}/disliked-ingredients`, { ingredient });
      setLoading(false);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };

  // --- AI GENERATION API ---

  // Tạo nội dung bằng AI
  const generateAiContent = async (requestData: AiGenerationRequest): Promise<AiGenerationResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/ai/generate', requestData);
      setLoading(false);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };

  // Tạo công thức nấu ăn bằng AI
  const generateRecipe = async (requestData: AiGenerationRequest): Promise<AiGenerationResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/ai/generate/recipe', requestData);
      setLoading(false);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };

  // Tạo kế hoạch bữa ăn bằng AI
  const generateMealPlan = async (requestData: AiGenerationRequest): Promise<AiGenerationResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/ai/generate/meal-plan', requestData);
      setLoading(false);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };

  // Lấy công thức được gợi ý
  const getRecommendedRecipes = async (userId: number, limit = 5): Promise<RecipeDto[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/ai/recommend/recipes/${userId}?limit=${limit}`);
      setLoading(false);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };

  // Lấy kế hoạch bữa ăn được cá nhân hóa
  const getPersonalizedMealPlan = async (userId: number, days = 7): Promise<RecipeDto[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/ai/recommend/meal-plan/${userId}?days=${days}`);
      setLoading(false);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };

  // Phân tích xu hướng nấu ăn
  const analyzeCookingTrends = async (userId: number): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/ai/analyze/cooking-trends/${userId}`);
      setLoading(false);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };

  // --- AI INTERACTION HISTORY API ---

  // Lấy lịch sử tương tác với AI
  const getUserAiInteractions = async (userId: number, page = 0, size = 10): Promise<{ content: UserAiInteraction[], totalPages: number }> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/ai-interactions/user/${userId}/paged?page=${page}&size=${size}`);
      setLoading(false);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };

  // Tìm kiếm tương tác AI
  const searchAiInteractions = async (userId: number, query: string): Promise<UserAiInteraction[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/ai-interactions/user/${userId}/search?query=${encodeURIComponent(query)}`);
      setLoading(false);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };

  // Lấy thống kê tương tác AI
  const getAiInteractionStats = async (userId: number): Promise<{ totalExecutionTimeMs: number, totalTokensUsed: number }> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/ai-interactions/user/${userId}/stats`);
      setLoading(false);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };

  return {
    loading,
    error,
    // User preferences API
    getUserPreferences,
    saveUserPreferences,
    updateUserPreference,
    addCuisinePreference,
    addLikedIngredient,
    addDislikedIngredient,
    // AI generation API
    generateAiContent,
    generateRecipe,
    generateMealPlan,
    getRecommendedRecipes,
    getPersonalizedMealPlan,
    analyzeCookingTrends,
    // AI interaction history API
    getUserAiInteractions,
    searchAiInteractions,
    getAiInteractionStats,
  };
};

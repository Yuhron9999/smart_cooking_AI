import { backendApi } from "./api";
import {
  LearningPath,
  LearningPathStep,
  UserLearningProgress,
  PaginatedResponse,
  SearchResult,
} from "@/types";

export class LearningService {
  // Learning Paths
  static async getAllLearningPaths(
    page: number = 0,
    size: number = 20
  ): Promise<SearchResult<LearningPath>> {
    const response = await backendApi.get<PaginatedResponse<LearningPath>>(
      "/api/learning/paths",
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

  static async getLearningPathById(id: number): Promise<LearningPath> {
    return backendApi.get<LearningPath>(`/api/learning/paths/${id}`);
  }

  static async searchLearningPaths(
    keyword: string,
    page: number = 0,
    size: number = 20
  ): Promise<SearchResult<LearningPath>> {
    const response = await backendApi.get<PaginatedResponse<LearningPath>>(
      "/api/learning/paths/search",
      {
        keyword,
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

  static async getPopularLearningPaths(
    limit: number = 10
  ): Promise<LearningPath[]> {
    return backendApi.get<LearningPath[]>("/api/learning/paths/popular", {
      limit,
    });
  }

  static async getRecommendedPaths(userId: number): Promise<LearningPath[]> {
    return backendApi.get<LearningPath[]>(
      `/api/learning/paths/recommended/${userId}`
    );
  }

  static async createLearningPath(
    data: Partial<LearningPath>
  ): Promise<LearningPath> {
    return backendApi.post<LearningPath>("/api/learning/paths", data);
  }

  static async updateLearningPath(
    id: number,
    data: Partial<LearningPath>
  ): Promise<LearningPath> {
    return backendApi.put<LearningPath>(`/api/learning/paths/${id}`, data);
  }

  static async deleteLearningPath(id: number): Promise<void> {
    return backendApi.delete<void>(`/api/learning/paths/${id}`);
  }

  // Learning Path Steps
  static async getStepsByPath(pathId: number): Promise<LearningPathStep[]> {
    return backendApi.get<LearningPathStep[]>(
      `/api/learning/paths/${pathId}/steps`
    );
  }

  static async addStepToPath(
    pathId: number,
    step: Partial<LearningPathStep>
  ): Promise<LearningPathStep> {
    return backendApi.post<LearningPathStep>(
      `/api/learning/paths/${pathId}/steps`,
      step
    );
  }

  static async updateStep(
    stepId: number,
    data: Partial<LearningPathStep>
  ): Promise<LearningPathStep> {
    return backendApi.put<LearningPathStep>(
      `/api/learning/steps/${stepId}`,
      data
    );
  }

  static async deleteStep(stepId: number): Promise<void> {
    return backendApi.delete<void>(`/api/learning/steps/${stepId}`);
  }

  static async reorderSteps(pathId: number, stepIds: number[]): Promise<void> {
    return backendApi.put<void>(`/api/learning/paths/${pathId}/steps/reorder`, {
      stepIds,
    });
  }

  // User Progress
  static async enrollUserInPath(
    userId: number,
    pathId: number
  ): Promise<UserLearningProgress> {
    return backendApi.post<UserLearningProgress>("/api/learning/enroll", {
      userId,
      pathId,
    });
  }

  static async getUserProgress(
    userId: number,
    pathId: number
  ): Promise<UserLearningProgress> {
    return backendApi.get<UserLearningProgress>(
      `/api/learning/progress/user/${userId}/path/${pathId}`
    );
  }

  static async updateProgress(
    userId: number,
    pathId: number,
    data: {
      progressPercentage?: number;
      currentStepId?: number;
      timeSpentMinutes?: number;
    }
  ): Promise<UserLearningProgress> {
    return backendApi.put<UserLearningProgress>(
      `/api/learning/progress/user/${userId}/path/${pathId}`,
      data
    );
  }

  static async markStepComplete(userId: number, stepId: number): Promise<void> {
    return backendApi.post<void>(
      `/api/learning/progress/step/${stepId}/complete`,
      { userId }
    );
  }

  static async markPathComplete(
    userId: number,
    pathId: number
  ): Promise<UserLearningProgress> {
    return backendApi.post<UserLearningProgress>(
      `/api/learning/progress/user/${userId}/path/${pathId}/complete`
    );
  }

  static async getUserLearningPaths(
    userId: number
  ): Promise<UserLearningProgress[]> {
    return backendApi.get<UserLearningProgress[]>(
      `/api/learning/progress/user/${userId}`
    );
  }

  static async getUserCompletedPaths(
    userId: number
  ): Promise<UserLearningProgress[]> {
    return backendApi.get<UserLearningProgress[]>(
      `/api/learning/progress/user/${userId}/completed`
    );
  }

  static async getUserInProgressPaths(
    userId: number
  ): Promise<UserLearningProgress[]> {
    return backendApi.get<UserLearningProgress[]>(
      `/api/learning/progress/user/${userId}/in-progress`
    );
  }

  // Statistics and Analytics
  static async getPathStatistics(pathId: number) {
    return backendApi.get(`/api/learning/paths/${pathId}/statistics`);
  }

  static async getUserLearningStatistics(userId: number) {
    return backendApi.get(`/api/learning/statistics/user/${userId}`);
  }

  static async getSystemLearningStatistics() {
    return backendApi.get("/api/learning/statistics/system");
  }

  static async getLeaderboard(limit: number = 10) {
    return backendApi.get("/api/learning/leaderboard", { limit });
  }

  // Certificates and Achievements
  static async generateCertificate(
    userId: number,
    pathId: number
  ): Promise<{ certificateUrl: string }> {
    return backendApi.post<{ certificateUrl: string }>(
      "/api/learning/certificate",
      {
        userId,
        pathId,
      }
    );
  }

  static async getUserCertificates(userId: number) {
    return backendApi.get(`/api/learning/certificates/user/${userId}`);
  }

  static async getUserAchievements(userId: number) {
    return backendApi.get(`/api/learning/achievements/user/${userId}`);
  }

  // Learning Recommendations
  static async getNextRecommendedStep(
    userId: number,
    pathId: number
  ): Promise<LearningPathStep> {
    return backendApi.get<LearningPathStep>(
      `/api/learning/recommendations/next-step`,
      {
        userId,
        pathId,
      }
    );
  }

  static async getSkillBasedRecommendations(
    userId: number
  ): Promise<LearningPath[]> {
    return backendApi.get<LearningPath[]>(
      `/api/learning/recommendations/skill-based/${userId}`
    );
  }

  static async getPersonalizedCurriculum(
    userId: number,
    skillLevel: string
  ): Promise<LearningPath[]> {
    return backendApi.get<LearningPath[]>(
      "/api/learning/curriculum/personalized",
      {
        userId,
        skillLevel,
      }
    );
  }
}

export default LearningService;

import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ApiResponse, PaginatedResponse } from "@/types";

// API Client Configuration
class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("auth_token")
            : null;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add language header
        const language =
          typeof window !== "undefined"
            ? localStorage.getItem("language") || "vi"
            : "vi";
        config.headers["Accept-Language"] = language;

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token");
            window.location.href = "/auth/login";
          }
        }

        // Handle network errors
        if (!error.response) {
          console.error("Network error:", error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  async upload<T>(url: string, formData: FormData): Promise<T> {
    const response = await this.client.post<T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
}

// API Clients
export const backendApi = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
);

export const aiServiceApi = new ApiClient(
  process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8001"
);

// Utility functions for API responses
export const handleApiResponse = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || "API request failed");
  }
  return response.data as T;
};

export const handlePaginatedResponse = <T>(response: PaginatedResponse<T>) => {
  return {
    items: response.content,
    totalCount: response.totalElements,
    hasNextPage: !response.last,
    currentPage: response.number,
    totalPages: response.totalPages,
  };
};

// Error handling utility
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors?.[0]) {
    return error.response.data.errors[0];
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

// Request retry utility
export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export default ApiClient;

// ============================================================================
// DYNAMIC USER DATA SYSTEM - FRONTEND INTEGRATION TESTS
// Tests all components and services for user data management
// ============================================================================

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { jest } from '@jest/globals';
import DynamicUserDashboard from '../../components/dynamic/DynamicUserDashboard';
import DynamicRecipeCreator from '../../components/dynamic/DynamicRecipeCreator';
import { userDataService } from '../../services/userDataService';

// Mock next-auth
jest.mock('next-auth/react', () => ({
    useSession: () => ({
        data: {
            user: {
                id: '1',
                email: 'test@example.com',
                name: 'Test User'
            }
        },
        status: 'authenticated'
    }),
    SessionProvider: ({ children }: any) => children
}));

// Mock userDataService
jest.mock('../../services/userDataService', () => ({
    userDataService: {
        getUserData: jest.fn(),
        updateUserProfile: jest.fn(),
        updateUserPreferences: jest.fn(),
        createRecipe: jest.fn(),
        getUserRecipes: jest.fn(),
        saveAiInteraction: jest.fn(),
        getUserAnalytics: jest.fn(),
        addFavoriteRecipe: jest.fn(),
        removeFavoriteRecipe: jest.fn(),
        bulkDeleteRecipes: jest.fn(),
        bulkUpdateRecipes: jest.fn()
    }
}));

// Mock data
const mockUserData = {
    profile: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        bio: 'Food enthusiast',
        cookingSkillLevel: 'INTERMEDIATE'
    },
    preferences: {
        id: 1,
        userId: 1,
        languagePreference: 'vi',
        servingSizePreference: 4,
        cookingTimePreference: 30,
        difficultyPreference: 'MEDIUM',
        calorieGoal: 2000
    },
    cuisinePreferences: [
        { id: 1, userId: 1, cuisine: 'Vietnamese', preferenceScore: 1.0 },
        { id: 2, userId: 1, cuisine: 'Italian', preferenceScore: 0.8 }
    ],
    dietaryRestrictions: [
        { id: 1, userId: 1, restriction: 'VEGETARIAN', severity: 'STRICT' }
    ],
    favoriteRecipes: [
        {
            id: 1,
            userId: 1,
            recipeId: 101,
            rating: 5,
            recipe: {
                id: 101,
                titleVi: 'Phở Bò',
                titleEn: 'Beef Pho',
                difficulty: 'MEDIUM',
                cookingTime: 120
            }
        }
    ],
    recipes: [
        {
            id: 101,
            titleVi: 'Phở Bò',
            titleEn: 'Beef Pho',
            descriptionVi: 'Món phở truyền thống',
            descriptionEn: 'Traditional Vietnamese pho',
            difficulty: 'MEDIUM',
            cookingTime: 120,
            servings: 4,
            calories: 450,
            createdBy: 1
        }
    ],
    learningProgress: {
        id: 1,
        userId: 1,
        completedLessons: 8,
        totalLessons: 20,
        completionPercentage: 40.0,
        currentSkillLevel: 'INTERMEDIATE',
        learningStreakDays: 5,
        totalLearningTimeMinutes: 240
    }
};

const mockAnalytics = {
    totalRecipes: 5,
    totalFavorites: 3,
    totalAiInteractions: 15,
    averageCookingTime: 45.5,
    averageCalories: 420.8,
    learningProgress: 40.0,
    weeklyActivity: [
        { date: '2024-01-01', activities: 3 },
        { date: '2024-01-02', activities: 5 },
        { date: '2024-01-03', activities: 2 }
    ],
    topCuisines: [
        { cuisine: 'Vietnamese', count: 8 },
        { cuisine: 'Italian', count: 5 },
        { cuisine: 'Japanese', count: 3 }
    ]
};

describe('DynamicUserDashboard Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (userDataService.getUserData as jest.Mock).mockResolvedValue(mockUserData);
        (userDataService.getUserAnalytics as jest.Mock).mockResolvedValue(mockAnalytics);
    });

    test('should render dashboard with user data', async () => {
        render(<DynamicUserDashboard />);

        // Wait for data to load
        await waitFor(() => {
            expect(screen.getByText('Dashboard Người dùng')).toBeInTheDocument();
        });

        // Check if user data service is called
        expect(userDataService.getUserData).toHaveBeenCalled();
        expect(userDataService.getUserAnalytics).toHaveBeenCalled();
    });

    test('should display user analytics', async () => {
        render(<DynamicUserDashboard />);

        await waitFor(() => {
            expect(screen.getByText('5')).toBeInTheDocument(); // Total recipes
            expect(screen.getByText('3')).toBeInTheDocument(); // Total favorites
            expect(screen.getByText('15')).toBeInTheDocument(); // Total AI interactions
        });
    });

    test('should handle profile editing', async () => {
        (userDataService.updateUserProfile as jest.Mock).mockResolvedValue({ success: true });

        render(<DynamicUserDashboard />);

        await waitFor(() => {
            const editButton = screen.getByText('Chỉnh sửa hồ sơ');
            expect(editButton).toBeInTheDocument();
        });

        // Click edit button
        const editButton = screen.getByText('Chỉnh sửa hồ sơ');
        fireEvent.click(editButton);

        // Check if edit form appears
        await waitFor(() => {
            expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
        });
    });

    test('should handle preferences updating', async () => {
        (userDataService.updateUserPreferences as jest.Mock).mockResolvedValue({ success: true });

        render(<DynamicUserDashboard />);

        await waitFor(() => {
            const preferencesSection = screen.getByText('Tùy chọn cá nhân');
            expect(preferencesSection).toBeInTheDocument();
        });

        // Test language preference change
        const languageSelect = screen.getByDisplayValue('Tiếng Việt');
        fireEvent.change(languageSelect, { target: { value: 'en' } });

        // Should trigger preferences update
        await waitFor(() => {
            expect(userDataService.updateUserPreferences).toHaveBeenCalled();
        });
    });
});

describe('DynamicRecipeCreator Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (userDataService.getUserRecipes as jest.Mock).mockResolvedValue(mockUserData.recipes);
    });

    test('should render recipe creator interface', async () => {
        render(<DynamicRecipeCreator />);

        await waitFor(() => {
            expect(screen.getByText('Quản lý Công thức')).toBeInTheDocument();
            expect(screen.getByText('Tạo công thức mới')).toBeInTheDocument();
        });

        expect(userDataService.getUserRecipes).toHaveBeenCalled();
    });

    test('should handle recipe creation', async () => {
        (userDataService.createRecipe as jest.Mock).mockResolvedValue({
            id: 102,
            titleVi: 'Bún Chả',
            success: true
        });

        render(<DynamicRecipeCreator />);

        await waitFor(() => {
            const createForm = screen.getByText('Tạo công thức mới');
            expect(createForm).toBeInTheDocument();
        });

        // Fill out recipe form
        const titleInput = screen.getByPlaceholderText('Tên món ăn...');
        const descriptionTextarea = screen.getByPlaceholderText('Mô tả món ăn...');

        fireEvent.change(titleInput, { target: { value: 'Bún Chả Hà Nội' } });
        fireEvent.change(descriptionTextarea, { target: { value: 'Món bún chả truyền thống' } });

        // Submit form
        const submitButton = screen.getByText('Tạo công thức');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(userDataService.createRecipe).toHaveBeenCalledWith(
                expect.objectContaining({
                    titleVi: 'Bún Chả Hà Nội',
                    descriptionVi: 'Món bún chả truyền thống'
                })
            );
        });
    });

    test('should handle bulk operations', async () => {
        (userDataService.bulkDeleteRecipes as jest.Mock).mockResolvedValue({
            deletedCount: 2,
            success: true
        });

        render(<DynamicRecipeCreator />);

        await waitFor(() => {
            const recipeList = screen.getByText('Phở Bò');
            expect(recipeList).toBeInTheDocument();
        });

        // Select recipes for bulk operations
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[1]); // Select first recipe

        // Click bulk delete
        const bulkDeleteButton = screen.getByText('Xóa đã chọn');
        fireEvent.click(bulkDeleteButton);

        await waitFor(() => {
            expect(userDataService.bulkDeleteRecipes).toHaveBeenCalledWith([101]);
        });
    });

    test('should handle AI recipe generation', async () => {
        const mockAiRecipe = {
            titleVi: 'Cơm tấm sườn nướng',
            descriptionVi: 'Món cơm tấm đặc trưng miền Nam',
            ingredients: ['sườn heo', 'gạo tấm', 'nước mắm'],
            instructions: ['Ướp sườn', 'Nướng sườn', 'Nấu cơm tấm']
        };

        // Mock AI service call through userDataService
        (userDataService.saveAiInteraction as jest.Mock).mockResolvedValue({
            success: true,
            data: mockAiRecipe
        });

        render(<DynamicRecipeCreator />);

        await waitFor(() => {
            const aiPanel = screen.getByText('AI Recipe Generator');
            expect(aiPanel).toBeInTheDocument();
        });

        // Fill AI generation form
        const ingredientsInput = screen.getByPlaceholderText('Nhập nguyên liệu...');
        fireEvent.change(ingredientsInput, {
            target: { value: 'sườn heo, gạo tấm, nước mắm' }
        });

        // Click generate button
        const generateButton = screen.getByText('Tạo công thức từ AI');
        fireEvent.click(generateButton);

        await waitFor(() => {
            expect(userDataService.saveAiInteraction).toHaveBeenCalledWith(
                expect.objectContaining({
                    interactionType: 'RECIPE_GENERATION',
                    inputData: expect.objectContaining({
                        ingredients: ['sườn heo', 'gạo tấm', 'nước mắm']
                    })
                })
            );
        });
    });
});

describe('UserDataService Integration Tests', () => {
    beforeEach(() => {
        // Mock fetch globally
        global.fetch = jest.fn();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should fetch user data correctly', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockUserData)
        });

        const result = await userDataService.getUserData();

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/user-data',
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json'
                })
            })
        );

        expect(result).toEqual(mockUserData);
    });

    test('should handle authentication errors', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 401,
            json: () => Promise.resolve({ message: 'Unauthorized' })
        });

        await expect(userDataService.getUserData()).rejects.toThrow('Unauthorized');
    });

    test('should create recipe successfully', async () => {
        const newRecipe = {
            titleVi: 'Bún Chả',
            descriptionVi: 'Món bún chả Hà Nội',
            difficulty: 'MEDIUM',
            cookingTime: 45,
            servings: 2
        };

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ ...newRecipe, id: 102 })
        });

        const result = await userDataService.createRecipe(newRecipe);

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/user-data/recipes',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify(newRecipe)
            })
        );

        expect(result.id).toBe(102);
    });

    test('should handle network errors', async () => {
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        await expect(userDataService.getUserData()).rejects.toThrow('Network error');
    });
});

describe('End-to-End User Data Flow Tests', () => {
    test('should complete full user data management flow', async () => {
        // Mock all service calls
        (userDataService.getUserData as jest.Mock).mockResolvedValue(mockUserData);
        (userDataService.getUserAnalytics as jest.Mock).mockResolvedValue(mockAnalytics);
        (userDataService.createRecipe as jest.Mock).mockResolvedValue({
            id: 103,
            titleVi: 'New Recipe',
            success: true
        });
        (userDataService.addFavoriteRecipe as jest.Mock).mockResolvedValue({ success: true });

        // Render dashboard
        render(<DynamicUserDashboard />);

        // Wait for initial data load
        await waitFor(() => {
            expect(screen.getByText('Dashboard Người dùng')).toBeInTheDocument();
        });

        // Verify user data is displayed
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument(); // Total recipes

        // Switch to recipe creator
        render(<DynamicRecipeCreator />);

        await waitFor(() => {
            expect(screen.getByText('Quản lý Công thức')).toBeInTheDocument();
        });

        // Create a new recipe
        const titleInput = screen.getByPlaceholderText('Tên món ăn...');
        fireEvent.change(titleInput, { target: { value: 'Bánh Mì Thịt Nướng' } });

        const submitButton = screen.getByText('Tạo công thức');
        fireEvent.click(submitButton);

        // Verify recipe creation
        await waitFor(() => {
            expect(userDataService.createRecipe).toHaveBeenCalled();
        });
    });
});

// Test runner configuration
describe('Component Export Tests', () => {
    test('should export all dynamic components correctly', () => {
        const DynamicUserDashboard = require('../../components/dynamic/DynamicUserDashboard').default;
        const DynamicRecipeCreator = require('../../components/dynamic/DynamicRecipeCreator').default;

        expect(DynamicUserDashboard).toBeDefined();
        expect(DynamicRecipeCreator).toBeDefined();
        expect(typeof DynamicUserDashboard).toBe('function');
        expect(typeof DynamicRecipeCreator).toBe('function');
    });
});

// Performance tests
describe('Performance Tests', () => {
    test('should load user data within acceptable time', async () => {
        const startTime = Date.now();

        (userDataService.getUserData as jest.Mock).mockImplementation(() =>
            new Promise(resolve =>
                setTimeout(() => resolve(mockUserData), 100)
            )
        );

        render(<DynamicUserDashboard />);

        await waitFor(() => {
            expect(screen.getByText('Dashboard Người dùng')).toBeInTheDocument();
        });

        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(2000); // Should load within 2 seconds
    });
});

export { mockUserData, mockAnalytics };

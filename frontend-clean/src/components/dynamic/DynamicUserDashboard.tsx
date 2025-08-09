// ============================================================================
// DYNAMIC USER DASHBOARD - Real-time User Data Management
// ============================================================================
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  User,
  Settings,
  ChefHat,
  Heart,
  BookOpen,
  BarChart3,
  Plus,
  Edit3,
  Save,
  X,
  Star,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';
import { userDataService, UserData, UserProfile, UserPreferences, DietaryRestriction } from '../../services/userDataService';
import { Card, CardHeader, CardContent } from '../ui/Card';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DynamicUserDashboard: React.FC = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  // Form states
  const [profileForm, setProfileForm] = useState<Partial<UserProfile>>({});
  const [preferencesForm, setPreferencesForm] = useState<Partial<UserPreferences>>({});

  // ============================================================================
  // EFFECTS & DATA LOADING
  // ============================================================================

  useEffect(() => {
    if (session?.user?.id) {
      loadUserData();
      loadAnalytics();
    }
  }, [session]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const data = await userDataService.getUserData(Number(session?.user?.id));
      setUserData(data);
      setProfileForm(data.profileData);
      setPreferencesForm(data.preferences);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const analyticsData = await userDataService.getUserAnalytics(Number(session?.user?.id));
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  // ============================================================================
  // PROFILE MANAGEMENT
  // ============================================================================

  const handleProfileUpdate = async () => {
    try {
      const updatedProfile = await userDataService.updateUserProfile(
        Number(session?.user?.id),
        profileForm
      );

      setUserData(prev => prev ? { ...prev, profileData: updatedProfile } : null);
      setEditMode(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePreferencesUpdate = async () => {
    try {
      const updatedPreferences = await userDataService.updateUserPreferences(
        Number(session?.user?.id),
        preferencesForm
      );

      setUserData(prev => prev ? { ...prev, preferences: updatedPreferences } : null);
      setEditMode(null);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  // ============================================================================
  // CUISINE PREFERENCES
  // ============================================================================

  const addCuisinePreference = async (cuisine: string) => {
    try {
      const updatedCuisines = await userDataService.addCuisinePreference(
        Number(session?.user?.id),
        cuisine
      );

      setUserData(prev => prev ? { ...prev, cuisinePreferences: updatedCuisines } : null);
    } catch (error) {
      console.error('Error adding cuisine preference:', error);
    }
  };

  const removeCuisinePreference = async (cuisine: string) => {
    try {
      const updatedCuisines = await userDataService.removeCuisinePreference(
        Number(session?.user?.id),
        cuisine
      );

      setUserData(prev => prev ? { ...prev, cuisinePreferences: updatedCuisines } : null);
    } catch (error) {
      console.error('Error removing cuisine preference:', error);
    }
  };

  // ============================================================================
  // DIETARY RESTRICTIONS
  // ============================================================================

  const updateDietaryRestrictions = async (restrictions: DietaryRestriction[]) => {
    try {
      const updatedRestrictions = await userDataService.updateDietaryRestrictions(
        Number(session?.user?.id),
        restrictions
      );

      setUserData(prev => prev ? { ...prev, dietaryRestrictions: updatedRestrictions } : null);
    } catch (error) {
      console.error('Error updating dietary restrictions:', error);
    }
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const ProfileEditForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Tên hiển thị</label>
        <input
          type="text"
          value={profileForm.displayName || ''}
          onChange={(e) => setProfileForm(prev => ({ ...prev, displayName: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Tên hiển thị của bạn"
          title="Tên hiển thị công khai"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Giới thiệu</label>
        <textarea
          value={profileForm.bio || ''}
          onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Giới thiệu về bản thân, sở thích nấu ăn..."
          title="Giới thiệu cá nhân"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Trình độ nấu ăn</label>
        <select
          value={profileForm.cookingSkillLevel || 'BEGINNER'}
          onChange={(e) => setProfileForm(prev => ({
            ...prev,
            cookingSkillLevel: e.target.value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          aria-label="Chọn trình độ nấu ăn"
          title="Trình độ nấu ăn hiện tại của bạn"
        >
          <option value="BEGINNER">Người mới bắt đầu</option>
          <option value="INTERMEDIATE">Trung cấp</option>
          <option value="ADVANCED">Nâng cao</option>
        </select>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleProfileUpdate}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Lưu
        </button>
        <button
          onClick={() => setEditMode(null)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center"
        >
          <X className="w-4 h-4 mr-2" />
          Hủy
        </button>
      </div>
    </div>
  );

  const CuisinePreferences = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Sở thích ẩm thực</h3>

      <div className="flex flex-wrap gap-2">
        {userData?.cuisinePreferences.map((cuisine) => (
          <span
            key={cuisine}
            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {cuisine}
            <button
              onClick={() => removeCuisinePreference(cuisine)}
              className="ml-2 text-blue-600 hover:text-blue-800"
              aria-label={`Xóa sở thích ẩm thực ${cuisine}`}
              title={`Xóa ${cuisine} khỏi danh sách sở thích`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Thêm sở thích ẩm thực..."
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value) {
              addCuisinePreference(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const DietaryRestrictionsManager = () => {
    const allRestrictions: DietaryRestriction[] = [
      'VEGAN', 'VEGETARIAN', 'GLUTEN_FREE', 'DAIRY_FREE',
      'NUT_FREE', 'KETO', 'PALEO', 'HALAL', 'KOSHER'
    ];

    const restrictionLabels: Record<DietaryRestriction, string> = {
      VEGAN: 'Thuần chay',
      VEGETARIAN: 'Chay',
      GLUTEN_FREE: 'Không gluten',
      DAIRY_FREE: 'Không sữa',
      NUT_FREE: 'Không hạt',
      KETO: 'Keto',
      PALEO: 'Paleo',
      HALAL: 'Halal',
      KOSHER: 'Kosher'
    };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Hạn chế chế độ ăn</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {allRestrictions.map((restriction) => (
            <label key={restriction} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={userData?.dietaryRestrictions.includes(restriction) || false}
                onChange={(e) => {
                  const currentRestrictions = userData?.dietaryRestrictions || [];
                  const newRestrictions = e.target.checked
                    ? [...currentRestrictions, restriction]
                    : currentRestrictions.filter(r => r !== restriction);

                  updateDietaryRestrictions(newRestrictions);
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{restrictionLabels[restriction]}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không thể tải dữ liệu người dùng</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header với Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Công thức</p>
                <p className="text-2xl font-bold text-blue-600">{analytics?.totalRecipes || 0}</p>
              </div>
              <ChefHat className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Yêu thích</p>
                <p className="text-2xl font-bold text-red-600">{userData.favoriteRecipes.length}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tương tác AI</p>
                <p className="text-2xl font-bold text-green-600">{analytics?.totalInteractions || 0}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiến độ học</p>
                <p className="text-2xl font-bold text-purple-600">{analytics?.learningProgress || 0}%</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <User className="w-5 h-5 mr-2" />
            Thông tin cá nhân
          </h2>
          {editMode !== 'profile' && (
            <button
              onClick={() => setEditMode('profile')}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Chỉnh sửa
            </button>
          )}
        </CardHeader>
        <CardContent>
          {editMode === 'profile' ? (
            <ProfileEditForm />
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{userData.profileData.displayName}</h3>
                <p className="text-gray-600">{userData.profileData.bio}</p>
                <p className="text-sm text-gray-500">
                  Trình độ: {userData.profileData.cookingSkillLevel}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <CuisinePreferences />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <DietaryRestrictionsManager />
          </CardContent>
        </Card>
      </div>

      {/* Recent Recipes */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center">
            <ChefHat className="w-5 h-5 mr-2" />
            Công thức của tôi
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData.createdRecipes.slice(0, 6).map((recipe) => (
              <div
                key={recipe.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium mb-2">{recipe.titleVi}</h3>
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {recipe.cookingTime} phút
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {recipe.servings} người
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicUserDashboard;

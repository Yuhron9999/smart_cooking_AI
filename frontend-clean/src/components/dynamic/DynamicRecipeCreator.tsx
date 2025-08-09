// ============================================================================
// DYNAMIC RECIPE CREATOR - AI-Powered Recipe Management
// ============================================================================
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Plus,
  Save,
  Trash2,
  Clock,
  Users,
  Star,
  ChefHat,
  Sparkles,
  Image,
  Upload,
  X
} from 'lucide-react';
import { userDataService, Recipe, CreateRecipeRequest } from '../../services/userDataService';
import { Card, CardHeader, CardContent } from '../ui/Card';

// ============================================================================
// INTERFACES
// ============================================================================

interface Ingredient {
  id?: number;
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

interface Instruction {
  id?: number;
  stepNumber: number;
  instructionVi: string;
  instructionEn: string;
  imageUrl?: string;
  tips: string[];
}

interface RecipeFormData {
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  cookingTime: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  servings: number;
  calories?: number;
  category: string;
  tags: string[];
  imageUrl?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DynamicRecipeCreator: React.FC = () => {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Form state
  const [formData, setFormData] = useState<RecipeFormData>({
    titleVi: '',
    titleEn: '',
    descriptionVi: '',
    descriptionEn: '',
    ingredients: [{ name: '', amount: 0, unit: '' }],
    instructions: [{ stepNumber: 1, instructionVi: '', instructionEn: '', tips: [] }],
    cookingTime: 30,
    difficulty: 'MEDIUM',
    servings: 4,
    calories: 0,
    category: '',
    tags: [],
    imageUrl: ''
  });

  // AI input state
  const [aiInput, setAiInput] = useState({
    ingredients: '',
    cuisine: '',
    dietary: '',
    cookingTime: 30,
    servings: 4
  });

  // ============================================================================
  // EFFECTS & DATA LOADING
  // ============================================================================

  useEffect(() => {
    if (session?.user?.id) {
      loadUserRecipes();
    }
  }, [session]);

  const loadUserRecipes = async () => {
    try {
      setLoading(true);
      const userRecipes = await userDataService.getUserRecipes(Number(session?.user?.id));
      setRecipes(userRecipes);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // FORM HANDLERS
  // ============================================================================

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: 0, unit: '' }]
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) =>
        i === index ? { ...ingredient, [field]: value } : ingredient
      )
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        { stepNumber: prev.instructions.length + 1, instructionVi: '', instructionEn: '', tips: [] }
      ]
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions
        .filter((_, i) => i !== index)
        .map((instruction, i) => ({ ...instruction, stepNumber: i + 1 }))
    }));
  };

  const updateInstruction = (index: number, instructionVi: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((instruction, i) =>
        i === index ? { ...instruction, instructionVi } : instruction
      )
    }));
  };

  // ============================================================================
  // AI RECIPE GENERATION
  // ============================================================================

  const generateRecipeWithAI = async () => {
    try {
      setAiGenerating(true);

      const prompt = `Tạo công thức nấu ăn với:
      - Nguyên liệu có sẵn: ${aiInput.ingredients}
      - Phong cách ẩm thực: ${aiInput.cuisine || 'Việt Nam'}
      - Hạn chế chế độ ăn: ${aiInput.dietary || 'Không'}
      - Thời gian nấu: ${aiInput.cookingTime} phút
      - Số người ăn: ${aiInput.servings} người`;

      // Simulate AI call - replace with actual API call
      const ingredientsList = aiInput.ingredients.split(',').map(i => i.trim());
      const preferences = {
        cuisineType: aiInput.cuisine,
        cookingTime: aiInput.cookingTime,
        servings: aiInput.servings
      };

      const aiResponse = await userDataService.generateRecipeFromAI(ingredientsList, preferences);

      // Fill form with AI-generated data
      setFormData({
        titleVi: aiResponse.titleVi || 'Món ăn từ AI',
        titleEn: aiResponse.titleEn || 'AI Generated Recipe',
        descriptionVi: aiResponse.descriptionVi || '',
        descriptionEn: aiResponse.descriptionEn || '',
        ingredients: aiResponse.ingredients || formData.ingredients,
        instructions: aiResponse.instructions || formData.instructions,
        cookingTime: aiResponse.cookingTime || aiInput.cookingTime,
        difficulty: aiResponse.difficulty || 'MEDIUM',
        servings: aiResponse.servings || aiInput.servings,
        calories: aiResponse.calories || 0,
        category: aiResponse.category || 'AI_GENERATED',
        tags: formData.tags.concat(['AI_GENERATED']),
        imageUrl: aiResponse.imageUrl || ''
      });

      setIsCreating(true);

    } catch (error) {
      console.error('Error generating recipe:', error);
    } finally {
      setAiGenerating(false);
    }
  };

  // ============================================================================
  // RECIPE CRUD OPERATIONS
  // ============================================================================

  const saveRecipe = async () => {
    try {
      if (!session?.user?.id) return;

      setLoading(true);

      const recipeData: CreateRecipeRequest = {
        ...formData,
        isPublic: true, // Default to public
        ingredients: formData.ingredients.map(ing => ({
          id: ing.id || 0,
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
          notes: ing.notes
        })),
        instructions: formData.instructions.map(inst => ({
          id: inst.id || 0,
          stepNumber: inst.stepNumber,
          instructionVi: inst.instructionVi,
          instructionEn: inst.instructionEn || '',
          imageUrl: inst.imageUrl,
          tips: inst.tips
        })),
        tagsJson: JSON.stringify(formData.tags)
      };

      let savedRecipe: Recipe;

      if (editingRecipe) {
        savedRecipe = await userDataService.updateRecipe(editingRecipe.id, recipeData);
        setRecipes(prev => prev.map(r => r.id === editingRecipe.id ? savedRecipe : r));
      } else {
        // Assuming userId = 1 for now - should come from auth context
        savedRecipe = await userDataService.createRecipe(1, recipeData);
        setRecipes(prev => [savedRecipe, ...prev]);
      }

      // Reset form
      resetForm();
      setIsCreating(false);
      setEditingRecipe(null);

    } catch (error) {
      console.error('Error saving recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (recipeId: number) => {
    try {
      await userDataService.deleteRecipe(recipeId);
      setRecipes(prev => prev.filter(r => r.id !== recipeId));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const editRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      titleVi: recipe.titleVi,
      titleEn: recipe.titleEn,
      descriptionVi: recipe.descriptionVi || '',
      descriptionEn: recipe.descriptionEn || '',
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      cookingTime: recipe.cookingTime,
      difficulty: recipe.difficulty,
      servings: recipe.servings,
      calories: recipe.calories || 0,
      category: recipe.category || '',
      tags: recipe.tagsJson ? JSON.parse(recipe.tagsJson) : [],
      imageUrl: recipe.imageUrl || ''
    });
    setIsCreating(true);
  };

  const resetForm = () => {
    setFormData({
      titleVi: '',
      titleEn: '',
      descriptionVi: '',
      descriptionEn: '',
      ingredients: [{ name: '', amount: 0, unit: '' }],
      instructions: [{ stepNumber: 1, instructionVi: '', instructionEn: '', tips: [] }],
      cookingTime: 30,
      difficulty: 'MEDIUM',
      servings: 4,
      calories: 0,
      category: '',
      tags: [],
      imageUrl: ''
    });
  };

  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================

  const AIGeneratorPanel = () => (
    <Card className="mb-6">
      <CardHeader>
        <h3 className="text-lg font-semibold flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
          Tạo công thức với AI
        </h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nguyên liệu có sẵn (cách nhau bằng dấu phẩy)
            </label>
            <textarea
              value={aiInput.ingredients}
              onChange={(e) => setAiInput(prev => ({ ...prev, ingredients: e.target.value }))}
              placeholder="Ví dụ: thịt heo, khoai tây, hành tây..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phong cách ẩm thực</label>
              <select
                value={aiInput.cuisine}
                onChange={(e) => setAiInput(prev => ({ ...prev, cuisine: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                aria-label="Chọn phong cách ẩm thực"
                title="Chọn phong cách ẩm thực"
              >
                <option value="">Chọn phong cách</option>
                <option value="Việt Nam">Việt Nam</option>
                <option value="Trung Hoa">Trung Hoa</option>
                <option value="Nhật Bản">Nhật Bản</option>
                <option value="Hàn Quốc">Hàn Quốc</option>
                <option value="Âu">Châu Âu</option>
                <option value="Mỹ">Châu Mỹ</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-2">Thời gian (phút)</label>
                <input
                  type="number"
                  value={aiInput.cookingTime}
                  onChange={(e) => setAiInput(prev => ({ ...prev, cookingTime: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="30"
                  title="Thời gian nấu tính theo phút"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Số người</label>
                <input
                  type="number"
                  value={aiInput.servings}
                  onChange={(e) => setAiInput(prev => ({ ...prev, servings: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="4"
                  title="Số người ăn"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={generateRecipeWithAI}
            disabled={aiGenerating || !aiInput.ingredients.trim()}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 flex items-center"
          >
            {aiGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang tạo...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Tạo công thức với AI
              </>
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );

  const RecipeForm = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-semibold">
          {editingRecipe ? 'Chỉnh sửa công thức' : 'Tạo công thức mới'}
        </h3>
        <button
          onClick={() => {
            setIsCreating(false);
            setEditingRecipe(null);
            resetForm();
          }}
          className="p-2 text-gray-500 hover:text-gray-700"
          aria-label="Đóng form tạo công thức"
          title="Đóng form"
        >
          <X className="w-5 h-5" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên món (Tiếng Việt)</label>
              <input
                type="text"
                value={formData.titleVi}
                onChange={(e) => setFormData(prev => ({ ...prev, titleVi: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ví dụ: Phở bò Hà Nội"
                title="Tên món ăn bằng tiếng Việt"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tên món (English)</label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Example: Vietnamese Pho"
                title="Dish name in English"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Mô tả</label>
            <textarea
              value={formData.descriptionVi}
              onChange={(e) => setFormData(prev => ({ ...prev, descriptionVi: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Mô tả về món ăn, nguồn gốc, hương vị..."
              title="Mô tả chi tiết về món ăn"
            />
          </div>

          {/* Recipe Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Thời gian (phút)</label>
              <input
                type="number"
                value={formData.cookingTime}
                onChange={(e) => setFormData(prev => ({ ...prev, cookingTime: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="30"
                title="Thời gian nấu ăn tính theo phút"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Độ khó</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'EASY' | 'MEDIUM' | 'HARD' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                title="Chọn độ khó của món ăn"
                aria-label="Độ khó món ăn"
              >
                <option value="EASY">Dễ</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HARD">Khó</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Số người</label>
              <input
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData(prev => ({ ...prev, servings: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="4"
                title="Số lượng người ăn"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Calories</label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData(prev => ({ ...prev, calories: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="500"
                title="Lượng calories ước tính"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium">Nguyên liệu</h4>
              <button
                onClick={addIngredient}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Thêm
              </button>
            </div>

            <div className="space-y-2">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Tên nguyên liệu"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Số lượng"
                    value={ingredient.amount}
                    onChange={(e) => updateIngredient(index, 'amount', Number(e.target.value))}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Đơn vị"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      onClick={() => removeIngredient(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                      aria-label={`Xóa nguyên liệu ${ingredient.name}`}
                      title={`Xóa nguyên liệu ${ingredient.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium">Hướng dẫn</h4>
              <button
                onClick={addInstruction}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Thêm bước
              </button>
            </div>

            <div className="space-y-3">
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {instruction.stepNumber}
                  </div>
                  <textarea
                    placeholder="Mô tả bước thực hiện..."
                    value={instruction.instructionVi}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                  {formData.instructions.length > 1 && (
                    <button
                      onClick={() => removeInstruction(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                      aria-label={`Xóa bước ${instruction.stepNumber}`}
                      title={`Xóa bước thứ ${instruction.stepNumber}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4 border-t">
            <button
              onClick={saveRecipe}
              disabled={loading || !formData.titleVi.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingRecipe ? 'Cập nhật' : 'Lưu công thức'}
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsCreating(false);
                setEditingRecipe(null);
                resetForm();
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Hủy
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const RecipeList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            {recipe.imageUrl && (
              <img
                src={recipe.imageUrl}
                alt={recipe.titleVi}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
            )}

            <h3 className="font-semibold text-lg mb-2">{recipe.titleVi}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.descriptionVi}</p>

            <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {recipe.cookingTime} phút
              </span>
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {recipe.servings} người
              </span>
              <span className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                {recipe.difficulty}
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => editRecipe(recipe)}
                className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                aria-label={`Chỉnh sửa công thức ${recipe.titleVi}`}
                title={`Chỉnh sửa công thức ${recipe.titleVi}`}
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => deleteRecipe(recipe.id)}
                className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                aria-label={`Xóa công thức ${recipe.titleVi}`}
                title={`Xóa công thức ${recipe.titleVi}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <ChefHat className="w-7 h-7 mr-3 text-blue-500" />
          Quản lý Công thức
        </h1>

        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo công thức mới
          </button>
        )}
      </div>

      {/* AI Generator */}
      {!isCreating && <AIGeneratorPanel />}

      {/* Recipe Form */}
      {isCreating && <RecipeForm />}

      {/* Recipe List */}
      {!isCreating && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Công thức của tôi ({recipes.length})</h2>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : recipes.length > 0 ? (
              <RecipeList />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ChefHat className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Chưa có công thức nào. Hãy tạo công thức đầu tiên!</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DynamicRecipeCreator;

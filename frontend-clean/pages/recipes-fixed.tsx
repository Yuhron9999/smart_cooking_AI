import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../src/components/layout/Header';
import { ChefHat, Clock, Users, Star, Search, Heart, BookOpen, Sparkles } from 'lucide-react';

interface Recipe {
    id: number;
    title: string;
    image?: string;
    cookingTime: number;
    servings: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    rating: number;
    description: string;
    ingredients?: string[];
    calories?: number;
    isLoading?: boolean;
}

// Enhanced AI Service calls with rate limiting and retry logic
let requestQueue: Promise<unknown>[] = [];
let isServiceThrottled = false;

const callAIService = async (endpoint: string, data: Record<string, unknown>) => {
    // Circuit breaker pattern
    if (isServiceThrottled) {
        console.log('🚫 Service throttled, skipping request to:', endpoint);
        return { success: false, error: 'Service temporarily throttled' };
    }

    // Limit concurrent requests
    if (requestQueue.length >= 3) {
        console.log('⏳ Request queue full, waiting...', endpoint);
        await Promise.race(requestQueue);
    }

    const maxRetries = 2;
    const baseDelay = 1000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const requestPromise = (async () => {
            try {
                console.log(`🔄 API Call (attempt ${attempt}/${maxRetries}):`, endpoint);

                const response = await fetch(`http://localhost:8001${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    if (response.status === 429 || response.status === 503) {
                        isServiceThrottled = true;
                        setTimeout(() => { isServiceThrottled = false; }, 5000); // Reset after 5s
                    }
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();
                console.log(`✅ API Success:`, endpoint);
                return result;

            } catch (error) {
                console.error(`❌ API Error (attempt ${attempt}):`, error);

                if (attempt === maxRetries) {
                    return { success: false, error: (error as Error).message };
                }

                // Exponential backoff delay
                const delay = baseDelay * Math.pow(2, attempt - 1);
                console.log(`⏳ Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        })();

        // Add to queue
        requestQueue.push(requestPromise);

        try {
            const result = await requestPromise;
            return result;
        } finally {
            // Remove from queue
            requestQueue = requestQueue.filter(p => p !== requestPromise);
        }
    }
};

const Recipes: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([
        {
            id: 1,
            title: 'Phở Bò Hà Nội',
            cookingTime: 120,
            servings: 4,
            difficulty: 'Medium',
            rating: 4.8,
            description: 'Món phở bò truyền thống Hà Nội với nước dùng thanh trong, thơm ngon.',
            ingredients: ['thịt bò', 'bánh phở', 'hành tây', 'gừng']
        },
        {
            id: 2,
            title: 'Bánh Xèo Miền Nam',
            cookingTime: 45,
            servings: 2,
            difficulty: 'Easy',
            rating: 4.6,
            description: 'Bánh xèo giòn tan với nhân tôm thịt, ăn kèm rau sống.',
            ingredients: ['bột bánh xèo', 'tôm', 'thịt ba chỉ', 'giá đỗ']
        },
        {
            id: 3,
            title: 'Bún Chả Hà Nội',
            cookingTime: 60,
            servings: 3,
            difficulty: 'Medium',
            rating: 4.9,
            description: 'Bún chả thơm lừng với chả nướng than hoa, nước mắm chua ngọt.',
            ingredients: ['thịt nướng', 'bún tươi', 'nước mắm', 'đường phèn']
        },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [isProcessingRecipes, setIsProcessingRecipes] = useState(false);

    // Generate image for recipe using Google Vision API and Custom Search
    const generateRecipeImage = useCallback(async (recipe: Recipe) => {
        try {
            setRecipes(prev => prev.map(r =>
                r.id === recipe.id ? { ...r, isLoading: true } : r
            ));

            // Call AI service to search for food images using Google Custom Search
            const response = await callAIService('/api/ai/search-food-images', {
                dish_name: recipe.title,
                max_results: 3,
                language: 'vi'
            });

            let imageUrl: string;

            if (response.success && response.data && response.data.images && response.data.images.length > 0) {
                // Use best image from Google Custom Search
                imageUrl = response.data.images[0].url;
                console.log(`✅ Found Google image for ${recipe.title}:`, imageUrl);
            } else {
                // Smart fallback based on Vietnamese dish types
                imageUrl = getSmartFallbackImage(recipe.title);
                console.log(`🔄 Using fallback image for ${recipe.title}:`, imageUrl);
            }

            setRecipes(prev => prev.map(r =>
                r.id === recipe.id ? { ...r, image: imageUrl, isLoading: false } : r
            ));
        } catch (err) {
            console.error('Error generating image:', err);
            // Final fallback to placeholder
            const fallbackUrl = `https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=${encodeURIComponent(recipe.title)}`;
            setRecipes(prev => prev.map(r =>
                r.id === recipe.id ? { ...r, image: fallbackUrl, isLoading: false } : r
            ));
        }
    }, []);

    // Smart fallback image selection
    const getSmartFallbackImage = (dishName: string): string => {
        const dishLower = dishName.toLowerCase();

        if (dishLower.includes('phở')) {
            return 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop';
        } else if (dishLower.includes('bánh')) {
            return 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop';
        } else if (dishLower.includes('bún')) {
            return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop';
        } else if (dishLower.includes('cơm')) {
            return 'https://images.unsplash.com/photo-1512058454905-6b841e7ad132?w=400&h=300&fit=crop';
        } else if (dishLower.includes('canh')) {
            return 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop';
        } else {
            // Generic Vietnamese food image
            return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop';
        }
    };

    // Get nutrition info for recipe
    const getRecipeNutrition = useCallback(async (recipe: Recipe) => {
        if (!recipe.ingredients) return;

        try {
            const response = await callAIService('/api/ai/nutrition-analysis', {
                dish_name: recipe.title,
                ingredients: recipe.ingredients,
                language: 'vi'
            });

            if (response.success && response.data && response.data.per_serving) {
                setRecipes(prev => prev.map(r =>
                    r.id === recipe.id ? { ...r, calories: Math.round(response.data.per_serving.calories || 0) } : r
                ));
            }
        } catch (err) {
            console.error('Error getting nutrition:', err);
        }
    }, []);

    // Generate new recipe using AI
    const generateNewRecipe = async () => {
        setIsGenerating(true);
        setError('');

        try {
            const response = await callAIService('/api/ai/ingredient-suggestions', {
                dish_name: 'món ăn Việt Nam ngẫu nhiên',
                language: 'vi'
            });

            if (response.success && response.data) {
                const dishNames = ['Canh chua', 'Thịt kho tàu', 'Gà nướng', 'Cà ri gà', 'Bánh mì', 'Chả cá'];
                const randomDish = dishNames[Math.floor(Math.random() * dishNames.length)];

                const newRecipe: Recipe = {
                    id: Date.now(),
                    title: response.data.dish_name || randomDish,
                    cookingTime: Math.floor(Math.random() * 60) + 30,
                    servings: Math.floor(Math.random() * 4) + 2,
                    difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)] as Recipe['difficulty'],
                    rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
                    description: `Món ${response.data.dish_name || randomDish} thơm ngon, dinh dưỡng`,
                    ingredients: response.data.main_ingredients || ['nguyên liệu cơ bản']
                };

                setRecipes(prev => [newRecipe, ...prev]);

                // Generate image and nutrition for new recipe
                setTimeout(() => {
                    generateRecipeImage(newRecipe);
                    getRecipeNutrition(newRecipe);
                }, 500);
            }
        } catch (err) {
            setError('Không thể tạo công thức mới. Vui lòng thử lại.');
            console.error('Error generating recipe:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    // Filter recipes based on search and difficulty
    const filteredRecipes = useMemo(() => {
        return recipes.filter(recipe => {
            const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
            return matchesSearch && matchesDifficulty;
        });
    }, [recipes, searchQuery, selectedDifficulty]);

    // Load images and nutrition for initial recipes - CONTROLLED VERSION
    useEffect(() => {
        let isComponentMounted = true;

        const loadRecipeData = async () => {
            if (isProcessingRecipes || !isComponentMounted) return;

            setIsProcessingRecipes(true);
            console.log('🚀 Starting controlled recipe data loading...');

            // Process only recipes that need data and limit to prevent resource exhaustion
            const recipesToProcess = recipes.filter(recipe =>
                (!recipe.image || (!recipe.calories && recipe.ingredients))
            ).slice(0, 3); // LIMIT to max 3 recipes at once

            console.log(`📊 Processing ${recipesToProcess.length} recipes with controlled batching`);

            for (let i = 0; i < recipesToProcess.length; i++) {
                if (!isComponentMounted) break;

                const recipe = recipesToProcess[i];

                try {
                    if (!recipe.image && isComponentMounted) {
                        console.log(`🖼️ Loading image for: ${recipe.title}`);
                        await generateRecipeImage(recipe);
                        // Mandatory delay between requests
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }

                    if (!recipe.calories && recipe.ingredients && isComponentMounted) {
                        console.log(`📊 Loading nutrition for: ${recipe.title}`);
                        await getRecipeNutrition(recipe);
                        // Mandatory delay between requests
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                } catch (error) {
                    console.error(`❌ Error processing recipe ${recipe.title}:`, error);
                }

                // Longer delay between recipes
                if (i < recipesToProcess.length - 1 && isComponentMounted) {
                    console.log(`⏳ Recipe completed, waiting before next...`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }

            if (isComponentMounted) {
                console.log('✅ Controlled recipe data loading completed');
                setIsProcessingRecipes(false);
            }
        };

        // Only run once when component mounts and recipes exist
        if (recipes.length > 0 && !isProcessingRecipes) {
            const hasUnprocessedRecipes = recipes.some(recipe =>
                !recipe.image || (!recipe.calories && recipe.ingredients)
            );

            if (hasUnprocessedRecipes) {
                loadRecipeData();
            }
        }

        return () => {
            isComponentMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array - only run once on mount

    return (
        <>
            <Head>
                <title>Công Thức Nấu Ăn - Smart Cooking AI</title>
                <meta name="description" content="Khám phá hàng ngàn công thức nấu ăn từ truyền thống đến hiện đại" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Header />

                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                🍲 Công Thức Nấu Ăn
                            </h1>
                            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                                Khám phá hàng ngàn công thức từ món truyền thống Việt Nam đến ẩm thực quốc tế,
                                được tạo ra bởi AI và đầu bếp chuyên nghiệp.
                            </p>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                ❌ {error}
                            </div>
                        )}

                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Tìm kiếm công thức..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <select
                                    value={selectedDifficulty}
                                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    title="Chọn độ khó"
                                    aria-label="Chọn độ khó"
                                >
                                    <option value="all">Tất cả độ khó</option>
                                    <option value="Easy">Dễ</option>
                                    <option value="Medium">Trung bình</option>
                                    <option value="Hard">Khó</option>
                                </select>

                                <button
                                    onClick={generateNewRecipe}
                                    disabled={isGenerating}
                                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    {isGenerating ? 'Đang tạo...' : 'Tạo món mới'}
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                                <ChefHat className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-900">1,500</div>
                                <div className="text-sm text-gray-600">Công Thức</div>
                            </div>
                            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                                <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-900">30 phút</div>
                                <div className="text-sm text-gray-600">Thời gian TB</div>
                            </div>
                            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                                <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-900">25,000</div>
                                <div className="text-sm text-gray-600">Người dùng</div>
                            </div>
                            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-900">4.7</div>
                                <div className="text-sm text-gray-600">Đánh giá</div>
                            </div>
                        </div>

                        {/* Recipe Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRecipes.map((recipe) => (
                                <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="h-48 relative bg-gradient-to-r from-orange-200 to-pink-200 flex items-center justify-center">
                                        {recipe.isLoading ? (
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                                        ) : recipe.image ? (
                                            <Image
                                                src={recipe.image}
                                                alt={recipe.title}
                                                width={400}
                                                height={300}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    // Fallback to icon if image fails to load
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <ChefHat className="h-16 w-16 text-orange-500" />
                                        )}

                                        {!recipe.image && !recipe.isLoading && (
                                            <button
                                                onClick={() => generateRecipeImage(recipe)}
                                                className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-orange-500 p-2 rounded-full shadow-md transition-colors"
                                                title="Tạo hình ảnh"
                                            >
                                                <Sparkles className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900 flex-1">
                                                {recipe.title}
                                            </h3>
                                            <button
                                                className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                                                title="Yêu thích"
                                            >
                                                <Heart className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4">
                                            {recipe.description}
                                        </p>

                                        {recipe.calories && (
                                            <div className="text-sm text-green-600 mb-2">
                                                🔥 {recipe.calories} calories
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    {recipe.cookingTime} phút
                                                </div>
                                                <div className="flex items-center">
                                                    <Users className="h-4 w-4 mr-1" />
                                                    {recipe.servings} người
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                                {recipe.rating}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${recipe.difficulty === 'Easy'
                                                ? 'bg-green-100 text-green-800'
                                                : recipe.difficulty === 'Medium'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {recipe.difficulty}
                                            </span>

                                            <div className="flex gap-2">
                                                <button
                                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors flex items-center gap-1"
                                                    title="Xem công thức"
                                                >
                                                    <BookOpen className="h-3 w-3" />
                                                    Công thức
                                                </button>
                                                <button className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors">
                                                    Nấu ngay
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More */}
                        <div className="text-center mt-12">
                            <button
                                onClick={generateNewRecipe}
                                disabled={isGenerating}
                                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 font-medium disabled:opacity-50"
                            >
                                {isGenerating ? 'Đang tạo món mới...' : 'Xem Thêm Công Thức'}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Recipes;

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
    ChefHat,
    Clock,
    Users,
    Star,
    Search,
    Heart,
    BookOpen,
    Sparkles,
    Grid,
    List,
    ArrowLeft,
    Plus,
    TrendingUp,
    Award,
    Flame
} from 'lucide-react';

interface Recipe {
    id: number;
    title: string;
    image: string;
    cookingTime: number;
    servings: number;
    difficulty: 'Dễ' | 'Trung bình' | 'Khó';
    rating: number;
    description: string;
    calories: number;
    cuisine: string;
    tags: string[];
    author: string;
    isPopular?: boolean;
    isNew?: boolean;
}

export default function RecipesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('Tất cả');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('rating');
    const [isLoading, setIsLoading] = useState(true);
    const [favorites, setFavorites] = useState<Set<number>>(new Set());

    const difficulties = ['Tất cả', 'Dễ', 'Trung bình', 'Khó'];

    useEffect(() => {
        // Sample data - In real app, this would come from API
        const sampleRecipes: Recipe[] = [
            {
                id: 1,
                title: "Phở Bò Hà Nội",
                image: "/api/placeholder/400/300",
                cookingTime: 120,
                servings: 4,
                difficulty: "Khó",
                rating: 4.8,
                description: "Phở bò truyền thống với nước dùng trong vắt, thơm ngon",
                calories: 350,
                cuisine: "Việt Nam",
                tags: ["Truyền thống", "Nước dùng", "Bò"],
                author: "Chef Minh",
                isPopular: true
            },
            {
                id: 2,
                title: "Bánh Mì Thịt Nướng",
                image: "/api/placeholder/400/300",
                cookingTime: 30,
                servings: 2,
                difficulty: "Dễ",
                rating: 4.6,
                description: "Bánh mì Việt Nam với thịt nướng thơm lừng",
                calories: 420,
                cuisine: "Việt Nam",
                tags: ["Nhanh", "Nướng", "Sandwich"],
                author: "Chef An",
                isNew: true
            },
            {
                id: 3,
                title: "Gỏi Cuốn Tôm Thịt",
                image: "/api/placeholder/400/300",
                cookingTime: 20,
                servings: 4,
                difficulty: "Dễ",
                rating: 4.7,
                description: "Gỏi cuốn tươi mát với tôm và thịt heo",
                calories: 180,
                cuisine: "Việt Nam",
                tags: ["Khỏe mạnh", "Tươi", "Không dầu"],
                author: "Chef Linh"
            },
            {
                id: 4,
                title: "Cơm Tấm Sài Gòn",
                image: "/api/placeholder/400/300",
                cookingTime: 45,
                servings: 2,
                difficulty: "Trung bình",
                rating: 4.5,
                description: "Cơm tấm truyền thống với sườn nướng",
                calories: 520,
                cuisine: "Việt Nam",
                tags: ["Nướng", "Cơm", "Miền Nam"],
                author: "Chef Đức",
                isPopular: true
            },
            {
                id: 5,
                title: "Bún Bò Huế",
                image: "/api/placeholder/400/300",
                cookingTime: 90,
                servings: 4,
                difficulty: "Khó",
                rating: 4.9,
                description: "Bún bò Huế cay nồng đặc trưng miền Trung",
                calories: 380,
                cuisine: "Việt Nam",
                tags: ["Cay", "Miền Trung", "Bún"],
                author: "Chef Hương"
            },
            {
                id: 6,
                title: "Chả Cá Lã Vọng",
                image: "/api/placeholder/400/300",
                cookingTime: 40,
                servings: 3,
                difficulty: "Trung bình",
                rating: 4.4,
                description: "Chả cá truyền thống Hà Nội với thì là",
                calories: 290,
                cuisine: "Việt Nam",
                tags: ["Cá", "Hà Nội", "Thì là"],
                author: "Chef Tuấn",
                isNew: true
            }
        ];

        // Simulate API call
        const loadRecipes = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setRecipes(sampleRecipes);
            setFilteredRecipes(sampleRecipes);
            setIsLoading(false);
        };
        loadRecipes();
    }, []);

    useEffect(() => {
        let filtered = [...recipes];

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(recipe =>
                recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Filter by difficulty
        if (selectedDifficulty !== 'Tất cả') {
            filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
        }

        // Sort recipes
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    return b.rating - a.rating;
                case 'time':
                    return a.cookingTime - b.cookingTime;
                case 'popular':
                    return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
                case 'newest':
                    return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
                default:
                    return 0;
            }
        });

        setFilteredRecipes(filtered);
    }, [searchQuery, selectedDifficulty, sortBy, recipes]);

    const toggleFavorite = (recipeId: number) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(recipeId)) {
                newFavorites.delete(recipeId);
            } else {
                newFavorites.add(recipeId);
            }
            return newFavorites;
        });
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Dễ': return 'text-green-600 bg-green-100';
            case 'Trung bình': return 'text-yellow-600 bg-yellow-100';
            case 'Khó': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="page-container">
            <Head>
                <title>Công Thức Nấu Ăn - Smart Cooking AI</title>
                <meta name="description" content="Khám phá hàng ngàn công thức nấu ăn từ khắp Việt Nam và thế giới" />
            </Head>

            {/* Header Navigation */}
            <nav className="navbar">
                <div className="container-modern">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                                <span>Về trang chủ</span>
                            </Link>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <div className="flex items-center space-x-2">
                                <ChefHat className="w-6 h-6 text-orange-500" />
                                <span className="text-xl font-bold gradient-text">Công Thức Nấu Ăn</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/ai-chat" className="btn-outline">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Tạo công thức với AI
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section py-16">
                <div className="hero-content">
                    <h1 className="hero-title text-4xl md:text-5xl mb-6">
                        🍳 Kho Tàng Công Thức
                    </h1>
                    <p className="hero-subtitle">
                        Khám phá hàng ngàn công thức nấu ăn từ truyền thống đến hiện đại, từ đơn giản đến tinh tế
                    </p>
                </div>
            </section>

            {/* Search & Filter Section */}
            <section className="py-8 bg-white">
                <div className="container-modern">
                    <div className="card p-6">
                        {/* Search Bar */}
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm công thức... (VD: Phở, Bánh mì, Cơm tấm)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-field pl-12 text-lg"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            {/* Difficulty Filter */}
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="input-field max-w-xs"
                                aria-label="Lọc theo độ khó"
                                title="Chọn độ khó"
                            >
                                {difficulties.map(difficulty => (
                                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                                ))}
                            </select>

                            {/* Sort Options */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="input-field max-w-xs"
                                aria-label="Sắp xếp theo"
                                title="Chọn cách sắp xếp"
                            >
                                <option value="rating">Đánh giá cao nhất</option>
                                <option value="time">Thời gian nấu</option>
                                <option value="popular">Phổ biến nhất</option>
                                <option value="newest">Mới nhất</option>
                            </select>

                            {/* View Mode */}
                            <div className="flex bg-gray-100 rounded-lg p-1 ml-auto">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                                    title="Chế độ lưới"
                                    aria-label="Chuyển sang chế độ lưới"
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                                    title="Chế độ danh sách"
                                    aria-label="Chuyển sang chế độ danh sách"
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                Tìm thấy <span className="font-semibold text-orange-600">{filteredRecipes.length}</span> công thức
                            </p>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">
                                    {filteredRecipes.filter(r => r.isPopular).length} phổ biến
                                </span>
                                <span className="text-sm text-gray-500">
                                    {filteredRecipes.filter(r => r.isNew).length} mới
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recipes Grid */}
            <section className="py-8">
                <div className="container-modern">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="card animate-pulse">
                                    <div className="bg-gray-300 h-48 rounded-xl mb-4"></div>
                                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                            {filteredRecipes.map((recipe) => (
                                <div key={recipe.id} className="recipe-card">
                                    {/* Recipe Image */}
                                    <div className="relative overflow-hidden rounded-xl mb-4">
                                        <div className="recipe-image bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                                            <ChefHat className="w-16 h-16 text-orange-300" />
                                        </div>

                                        {/* Badges */}
                                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                                            {recipe.isPopular && (
                                                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                                    <TrendingUp className="w-3 h-3" />
                                                    Phổ biến
                                                </span>
                                            )}
                                            {recipe.isNew && (
                                                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                    Mới
                                                </span>
                                            )}
                                        </div>

                                        {/* Favorite Button */}
                                        <button
                                            onClick={() => toggleFavorite(recipe.id)}
                                            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 hover:scale-110"
                                            aria-label="Thêm vào yêu thích"
                                            title="Thêm vào yêu thích"
                                        >
                                            <Heart className={`w-5 h-5 ${favorites.has(recipe.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                                        </button>
                                    </div>

                                    {/* Recipe Info */}
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <h3 className="recipe-title text-lg">{recipe.title}</h3>
                                            <div className="flex items-center space-x-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm font-medium">{recipe.rating}</span>
                                            </div>
                                        </div>

                                        <p className="recipe-description text-sm">{recipe.description}</p>

                                        {/* Meta Info */}
                                        <div className="recipe-meta">
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{recipe.cookingTime} phút</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Users className="w-4 h-4" />
                                                <span>{recipe.servings} người</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Flame className="w-4 h-4" />
                                                <span>{recipe.calories} cal</span>
                                            </div>
                                        </div>

                                        {/* Difficulty Badge */}
                                        <div className="flex items-center justify-between">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                                                {recipe.difficulty}
                                            </span>
                                            <span className="text-xs text-gray-500">bởi {recipe.author}</span>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1">
                                            {recipe.tags.slice(0, 3).map((tag, index) => (
                                                <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-2">
                                            <Link href={`/recipes/${recipe.id}`} className="btn-primary flex-1 text-center">
                                                <BookOpen className="w-4 h-4 mr-2" />
                                                Xem công thức
                                            </Link>
                                            <button
                                                className="btn-outline px-3"
                                                aria-label="Thêm vào danh sách nấu"
                                                title="Thêm vào danh sách nấu"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* List View */
                        <div className="space-y-4 animate-fade-in">
                            {filteredRecipes.map((recipe) => (
                                <div key={recipe.id} className="card flex items-center space-x-6 p-6">
                                    <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <ChefHat className="w-8 h-8 text-orange-300" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-xl font-bold text-gray-800 truncate">{recipe.title}</h3>
                                            <div className="flex items-center space-x-4 flex-shrink-0">
                                                <div className="flex items-center space-x-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span className="text-sm font-medium">{recipe.rating}</span>
                                                </div>
                                                <button
                                                    onClick={() => toggleFavorite(recipe.id)}
                                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                    aria-label="Thêm vào yêu thích"
                                                    title="Thêm vào yêu thích"
                                                >
                                                    <Heart className={`w-5 h-5 ${favorites.has(recipe.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{recipe.cookingTime}p</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Users className="w-4 h-4" />
                                                    <span>{recipe.servings}</span>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                                                    {recipe.difficulty}
                                                </span>
                                            </div>

                                            <Link href={`/recipes/${recipe.id}`} className="btn-primary">
                                                Xem công thức
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {filteredRecipes.length === 0 && !isLoading && (
                        <div className="text-center py-12">
                            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-600 mb-2">Không tìm thấy công thức nào</h3>
                            <p className="text-gray-500 mb-4">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedDifficulty('Tất cả');
                                }}
                                className="btn-outline"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white">
                <div className="container-modern text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Chưa tìm thấy công thức ưng ý? 🤔
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Hãy để AI tạo ra công thức hoàn hảo dành riêng cho bạn!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/ai-chat" className="btn-glass text-lg px-8 py-4 inline-flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Tạo công thức với AI
                        </Link>
                        <Link href="/simple-ai-test" className="btn-primary bg-white text-orange-500 hover:bg-gray-100 text-lg px-8 py-4 inline-flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Test AI Features
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

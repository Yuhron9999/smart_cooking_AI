import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import Header from '@/components/layout/Header';
import {
    Heart,
    Users,
    Star,
    ChefHat,
    Filter,
    Search,
    Grid3X3,
    List,
    Bookmark,
    Share2,
    Eye,
    Trash2,
    Calendar,
    Tag,
    MapPin,
    Timer,
    Award
} from 'lucide-react';

interface FavoriteRecipe {
    id: number;
    title: string;
    image: string;
    cookingTime: number;
    servings: number;
    difficulty: 'Dễ' | 'Trung bình' | 'Khó';
    rating: number;
    description: string;
    category: string;
    author: string;
    addedAt: string;
    tags: string[];
    location?: string;
    nutrition?: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
}

interface Collection {
    id: number;
    name: string;
    icon: string;
    count: number;
    color: string;
}

const Favorites: React.FC = () => {
    const { data: session, status } = useSession();
    const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
    const [filteredFavorites, setFilteredFavorites] = useState<FavoriteRecipe[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
    const [selectedDifficulty, setSelectedDifficulty] = useState('Tất cả');
    const [selectedCollection, setSelectedCollection] = useState('Tất cả');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);

    // Sample collections
    const sampleCollections: Collection[] = useMemo(() => [
        { id: 1, name: 'Món Việt', icon: '🇻🇳', count: 15, color: 'bg-red-100 text-red-700' },
        { id: 2, name: 'Món chay', icon: '🥬', count: 8, color: 'bg-green-100 text-green-700' },
        { id: 3, name: 'Tráng miệng', icon: '🍮', count: 12, color: 'bg-pink-100 text-pink-700' },
        { id: 4, name: 'Nấu nhanh', icon: '⚡', count: 20, color: 'bg-yellow-100 text-yellow-700' },
        { id: 5, name: 'Cao cấp', icon: '⭐', count: 6, color: 'bg-purple-100 text-purple-700' }
    ], []);

    // Sample favorite recipes
    const sampleFavorites: FavoriteRecipe[] = useMemo(() => [
        {
            id: 1,
            title: 'Phở Bò Hà Nội',
            image: '/images/pho-bo.jpg',
            cookingTime: 180,
            servings: 4,
            difficulty: 'Khó',
            rating: 4.8,
            description: 'Phở bò truyền thống với nước dùng trong vắt, thịt bò tươi ngon và bánh phở dai ngon.',
            category: 'Món chính',
            author: 'Chef Nam',
            addedAt: '2024-01-15',
            tags: ['Truyền thống', 'Món Việt', 'Nước dùng'],
            location: 'Hà Nội',
            nutrition: {
                calories: 450,
                protein: 28,
                carbs: 65,
                fat: 8
            }
        },
        {
            id: 2,
            title: 'Bánh Xèo Miền Nam',
            image: '/images/banh-xeo.jpg',
            cookingTime: 45,
            servings: 2,
            difficulty: 'Trung bình',
            rating: 4.6,
            description: 'Bánh xèo giòn tan với nhân tôm thịt, ăn kèm rau sống và nước chấm chua ngọt.',
            category: 'Món chính',
            author: 'Chef Lan',
            addedAt: '2024-01-20',
            tags: ['Miền Nam', 'Giòn rụm', 'Tôm thịt'],
            location: 'TP.HCM',
            nutrition: {
                calories: 380,
                protein: 25,
                carbs: 42,
                fat: 15
            }
        },
        {
            id: 3,
            title: 'Gỏi Cuốn Tôm Thịt',
            image: '/images/goi-cuon.jpg',
            cookingTime: 30,
            servings: 6,
            difficulty: 'Dễ',
            rating: 4.4,
            description: 'Gỏi cuốn tươi mát với tôm, thịt heo, rau thơm và bánh tráng trong suốt.',
            category: 'Khai vị',
            author: 'Chef Minh',
            addedAt: '2024-01-25',
            tags: ['Tươi mát', 'Healthy', 'Nhanh gọn'],
            location: 'Miền Nam',
            nutrition: {
                calories: 180,
                protein: 15,
                carbs: 18,
                fat: 6
            }
        },
        {
            id: 4,
            title: 'Chè Ba Màu',
            image: '/images/che-ba-mau.jpg',
            cookingTime: 90,
            servings: 4,
            difficulty: 'Dễ',
            rating: 4.5,
            description: 'Tráng miệng mát lạnh với đậu xanh, đậu đỏ và thạch rau câu.',
            category: 'Tráng miệng',
            author: 'Chef Mai',
            addedAt: '2024-02-01',
            tags: ['Mát lạnh', 'Tráng miệng', 'Truyền thống'],
            location: 'Miền Nam',
            nutrition: {
                calories: 250,
                protein: 8,
                carbs: 58,
                fat: 2
            }
        },
        {
            id: 5,
            title: 'Bún Bò Huế',
            image: '/images/bun-bo-hue.jpg',
            cookingTime: 120,
            servings: 4,
            difficulty: 'Khó',
            rating: 4.7,
            description: 'Bún bò Huế cay nồng với nước lèo đậm đà, chả cua và giò heo.',
            category: 'Món chính',
            author: 'Chef Huệ',
            addedAt: '2024-02-05',
            tags: ['Cay nồng', 'Miền Trung', 'Đặc sản'],
            location: 'Huế',
            nutrition: {
                calories: 420,
                protein: 30,
                carbs: 55,
                fat: 12
            }
        },
        {
            id: 6,
            title: 'Bánh Mì Chả Cá',
            image: '/images/banh-mi-cha-ca.jpg',
            cookingTime: 25,
            servings: 2,
            difficulty: 'Dễ',
            rating: 4.3,
            description: 'Bánh mì giòn với chả cá nướng thơm lừng, rau thơm và nước sốt đặc biệt.',
            category: 'Đồ ăn nhẹ',
            author: 'Chef Đức',
            addedAt: '2024-02-10',
            tags: ['Nhanh gọn', 'Hải sản', 'Sáng tạo'],
            location: 'Hà Nội',
            nutrition: {
                calories: 320,
                protein: 22,
                carbs: 35,
                fat: 10
            }
        }
    ], []);

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            setLoading(false);
            return;
        }

        // Simulate API call to load user's favorites
        const loadFavorites = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setFavorites(sampleFavorites);
            setFilteredFavorites(sampleFavorites);
            setCollections(sampleCollections);
            setLoading(false);
        };

        loadFavorites();
    }, [session, status, sampleFavorites, sampleCollections]);

    // Filter and sort favorites
    useEffect(() => {
        let filtered = [...favorites];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(recipe =>
                recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Category filter
        if (selectedCategory !== 'Tất cả') {
            filtered = filtered.filter(recipe => recipe.category === selectedCategory);
        }

        // Difficulty filter
        if (selectedDifficulty !== 'Tất cả') {
            filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
        }

        // Collection filter
        if (selectedCollection !== 'Tất cả') {
            // Mock collection filtering logic
            filtered = filtered.filter(recipe => {
                switch (selectedCollection) {
                    case 'Món Việt':
                        return recipe.tags.includes('Truyền thống') || recipe.tags.includes('Món Việt');
                    case 'Món chay':
                        return recipe.tags.includes('Healthy') || recipe.category === 'Khai vị';
                    case 'Tráng miệng':
                        return recipe.category === 'Tráng miệng';
                    case 'Nấu nhanh':
                        return recipe.cookingTime <= 45;
                    case 'Cao cấp':
                        return recipe.difficulty === 'Khó' && recipe.rating >= 4.5;
                    default:
                        return true;
                }
            });
        }

        // Sort
        switch (sortBy) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime());
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'cookingTime':
                filtered.sort((a, b) => a.cookingTime - b.cookingTime);
                break;
            case 'alphabetical':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        setFilteredFavorites(filtered);
    }, [searchTerm, selectedCategory, selectedDifficulty, selectedCollection, sortBy, favorites]);

    const categories = ['Tất cả', ...Array.from(new Set(favorites.map(r => r.category)))];
    const difficulties = ['Tất cả', 'Dễ', 'Trung bình', 'Khó'];

    const toggleRecipeSelection = (recipeId: number) => {
        setSelectedRecipes(prev =>
            prev.includes(recipeId)
                ? prev.filter(id => id !== recipeId)
                : [...prev, recipeId]
        );
    };

    const selectAllRecipes = () => {
        setSelectedRecipes(filteredFavorites.map(r => r.id));
    };

    const clearSelection = () => {
        setSelectedRecipes([]);
    };

    const removeFromFavorites = (recipeIds: number[]) => {
        setFavorites(prev => prev.filter(recipe => !recipeIds.includes(recipe.id)));
        setSelectedRecipes([]);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Dễ': return 'text-green-600 bg-green-100';
            case 'Trung bình': return 'text-yellow-600 bg-yellow-100';
            case 'Khó': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <>
                <Head>
                    <title>Yêu thích - Smart Cooking AI</title>
                    <meta name="description" content="Các công thức nấu ăn yêu thích của bạn" />
                </Head>

                <div className="min-h-screen bg-gray-50">
                    <Header />

                    <main className="container mx-auto px-4 py-8">
                        <div className="max-w-2xl mx-auto text-center">
                            <div className="bg-white rounded-lg shadow-md p-8">
                                <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                    Đăng nhập để xem yêu thích
                                </h1>
                                <p className="text-gray-600 mb-6">
                                    Đăng nhập để lưu các công thức yêu thích và truy cập mọi lúc mọi nơi
                                </p>
                                <button
                                    onClick={() => signIn('google')}
                                    className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    Đăng nhập với Google
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Yêu thích - Smart Cooking AI</title>
                <meta name="description" content="Các công thức nấu ăn yêu thích của bạn" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Header />

                <main className="container mx-auto px-4 py-6">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                        <div className="mb-4 lg:mb-0">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                                <Heart className="h-8 w-8 text-red-500 mr-3 fill-current" />
                                Yêu thích của tôi
                            </h1>
                            <p className="text-gray-600">
                                {filteredFavorites.length} công thức đã lưu
                                {selectedRecipes.length > 0 && (
                                    <span className="ml-2 text-orange-600 font-medium">
                                        • {selectedRecipes.length} đã chọn
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* View Controls */}
                        <div className="flex items-center space-x-2">
                            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                    title="Dạng lưới"
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                    title="Dạng danh sách"
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center px-3 py-2 rounded-lg border ${showFilters ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                title="Bộ lọc"
                            >
                                <Filter className="h-4 w-4 mr-1" />
                                Lọc
                            </button>
                        </div>
                    </div>

                    {/* Collections */}
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Bookmark className="h-5 w-5 mr-2 text-orange-500" />
                            Bộ sưu tập
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCollection('Tất cả')}
                                className={`px-3 py-1 rounded-full text-sm font-medium border ${selectedCollection === 'Tất cả'
                                    ? 'bg-orange-500 text-white border-orange-500'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                Tất cả ({favorites.length})
                            </button>
                            {collections.map((collection) => (
                                <button
                                    key={collection.id}
                                    onClick={() => setSelectedCollection(collection.name)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center ${selectedCollection === collection.name
                                        ? 'bg-orange-500 text-white border-orange-500'
                                        : `${collection.color} border-transparent hover:opacity-80`
                                        }`}
                                >
                                    <span className="mr-1">{collection.icon}</span>
                                    {collection.name} ({collection.count})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Search */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <input
                                            type="text"
                                            placeholder="Tìm trong yêu thích..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        title="Chọn danh mục"
                                    >
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Difficulty */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Độ khó</label>
                                    <select
                                        value={selectedDifficulty}
                                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        title="Chọn độ khó"
                                    >
                                        {difficulties.map((difficulty) => (
                                            <option key={difficulty} value={difficulty}>
                                                {difficulty}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sort */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        title="Chọn cách sắp xếp"
                                    >
                                        <option value="newest">Mới nhất</option>
                                        <option value="oldest">Cũ nhất</option>
                                        <option value="rating">Đánh giá cao</option>
                                        <option value="cookingTime">Thời gian nấu</option>
                                        <option value="alphabetical">Tên A-Z</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Selection Actions */}
                    {selectedRecipes.length > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="text-orange-700 font-medium mr-4">
                                        {selectedRecipes.length} công thức đã chọn
                                    </span>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={selectAllRecipes}
                                            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                                        >
                                            Chọn tất cả
                                        </button>
                                        <span className="text-gray-400">|</span>
                                        <button
                                            onClick={clearSelection}
                                            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                                        >
                                            Bỏ chọn
                                        </button>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="flex items-center px-3 py-2 bg-white text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 text-sm font-medium">
                                        <Share2 className="h-4 w-4 mr-1" />
                                        Chia sẻ
                                    </button>
                                    <button
                                        onClick={() => removeFromFavorites(selectedRecipes)}
                                        className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Xóa khỏi yêu thích
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Favorites List */}
                    {filteredFavorites.length === 0 ? (
                        <div className="text-center py-12">
                            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm || selectedCategory !== 'Tất cả' || selectedDifficulty !== 'Tất cả' || selectedCollection !== 'Tất cả'
                                    ? 'Không tìm thấy công thức nào'
                                    : 'Chưa có công thức yêu thích'
                                }
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm || selectedCategory !== 'Tất cả' || selectedDifficulty !== 'Tất cả' || selectedCollection !== 'Tất cả'
                                    ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                                    : 'Khám phá các công thức ngon và thêm vào yêu thích'
                                }
                            </p>
                            {!searchTerm && selectedCategory === 'Tất cả' && selectedDifficulty === 'Tất cả' && selectedCollection === 'Tất cả' && (
                                <Link
                                    href="/ai-chat"
                                    className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
                                >
                                    <ChefHat className="h-4 w-4 mr-1" />
                                    Tạo công thức với AI
                                </Link>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Grid View */}
                            {viewMode === 'grid' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredFavorites.map((recipe) => (
                                        <div
                                            key={recipe.id}
                                            className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 ${selectedRecipes.includes(recipe.id) ? 'ring-2 ring-orange-500' : ''
                                                }`}
                                        >
                                            {/* Recipe Image */}
                                            <div className="relative h-48 bg-gradient-to-br from-orange-200 via-pink-200 to-purple-200">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <ChefHat className="h-16 w-16 text-orange-500 opacity-50" />
                                                </div>

                                                {/* Selection Checkbox */}
                                                <div className="absolute top-2 left-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRecipes.includes(recipe.id)}
                                                        onChange={() => toggleRecipeSelection(recipe.id)}
                                                        className="w-4 h-4 text-orange-600 bg-white border-gray-300 rounded focus:ring-orange-500"
                                                        title="Chọn công thức này"
                                                    />
                                                </div>

                                                {/* Difficulty Badge */}
                                                <div className="absolute bottom-2 left-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                                                        {recipe.difficulty}
                                                    </span>
                                                </div>

                                                {/* Location */}
                                                {recipe.location && (
                                                    <div className="absolute bottom-2 right-2">
                                                        <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded-full flex items-center">
                                                            <MapPin className="h-3 w-3 mr-1" />
                                                            {recipe.location}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Recipe Content */}
                                            <div className="p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 flex-1">
                                                        {recipe.title}
                                                    </h3>
                                                    <div className="flex items-center ml-2">
                                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                        <span className="text-sm text-gray-600 ml-1">{recipe.rating}</span>
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                    {recipe.description}
                                                </p>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {recipe.tags.slice(0, 3).map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                                        >
                                                            <Tag className="h-3 w-3 inline mr-1" />
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {recipe.tags.length > 3 && (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                            +{recipe.tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Recipe Meta */}
                                                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                                    <div className="flex items-center">
                                                        <Timer className="h-4 w-4 mr-1" />
                                                        <span>{recipe.cookingTime} phút</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Users className="h-4 w-4 mr-1" />
                                                        <span>{recipe.servings} người</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Award className="h-4 w-4 mr-1" />
                                                        <span>{recipe.category}</span>
                                                    </div>
                                                </div>

                                                {/* Nutrition Info */}
                                                {recipe.nutrition && (
                                                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 mb-3">
                                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                                            <div className="flex items-center">
                                                                <span className="text-red-500 mr-1">🔥</span>
                                                                <span className="text-gray-600">{recipe.nutrition.calories} cal</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <span className="text-orange-500 mr-1">🥩</span>
                                                                <span className="text-gray-600">{recipe.nutrition.protein}g protein</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <span className="text-yellow-500 mr-1">🌾</span>
                                                                <span className="text-gray-600">{recipe.nutrition.carbs}g carbs</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <span className="text-green-500 mr-1">🥑</span>
                                                                <span className="text-gray-600">{recipe.nutrition.fat}g fat</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex space-x-2 mb-3">
                                                    <button className="flex-1 bg-gradient-to-r from-orange-400 to-pink-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center">
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Xem công thức
                                                    </button>
                                                    <button
                                                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                                        title="Chia sẻ công thức"
                                                    >
                                                        <Share2 className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                {/* Author & Added Date */}
                                                <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                                                    <span className="flex items-center">
                                                        <ChefHat className="h-3 w-3 mr-1" />
                                                        {recipe.author}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        {new Date(recipe.addedAt).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* List View */}
                            {viewMode === 'list' && (
                                <div className="space-y-4">
                                    {filteredFavorites.map((recipe) => (
                                        <div
                                            key={recipe.id}
                                            className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 ${selectedRecipes.includes(recipe.id) ? 'ring-2 ring-orange-500' : ''
                                                }`}
                                        >
                                            <div className="flex items-center space-x-4">
                                                {/* Checkbox */}
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRecipes.includes(recipe.id)}
                                                    onChange={() => toggleRecipeSelection(recipe.id)}
                                                    className="w-4 h-4 text-orange-600 bg-white border-gray-300 rounded focus:ring-orange-500"
                                                    title="Chọn công thức này"
                                                />

                                                {/* Recipe Image */}
                                                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-orange-200 via-pink-200 to-purple-200 rounded-lg flex items-center justify-center">
                                                    <ChefHat className="h-8 w-8 text-orange-500 opacity-50" />
                                                </div>

                                                {/* Recipe Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                                {recipe.title}
                                                            </h3>
                                                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                                                {recipe.description}
                                                            </p>

                                                            {/* Tags */}
                                                            <div className="flex flex-wrap gap-1 mb-2">
                                                                {recipe.tags.slice(0, 4).map((tag) => (
                                                                    <span
                                                                        key={tag}
                                                                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>

                                                            {/* Meta Info */}
                                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                                <span className="flex items-center">
                                                                    <Timer className="h-4 w-4 mr-1" />
                                                                    {recipe.cookingTime} phút
                                                                </span>
                                                                <span className="flex items-center">
                                                                    <Users className="h-4 w-4 mr-1" />
                                                                    {recipe.servings} người
                                                                </span>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                                                                    {recipe.difficulty}
                                                                </span>
                                                                <span className="flex items-center">
                                                                    <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                                                                    {recipe.rating}
                                                                </span>
                                                                {recipe.location && (
                                                                    <span className="flex items-center">
                                                                        <MapPin className="h-4 w-4 mr-1" />
                                                                        {recipe.location}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center space-x-2 ml-4">
                                                            <button className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center">
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                Xem
                                                            </button>
                                                            <button
                                                                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                                                title="Chia sẻ công thức"
                                                            >
                                                                <Share2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </>
    );
};

export default Favorites;

import React, { useState } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Header from '@/components/layout/Header';
import {
    Heart,
    Clock,
    Users,
    Filter,
    Search,
    Star,
    ChefHat,
    Utensils,
    BookOpen,
    Eye,
    Share2,
    Trash2,
    Plus,
    Grid3X3,
    List,
    SortAsc,
    Calendar
} from 'lucide-react';

interface Recipe {
    id: string;
    title: string;
    description: string;
    image: string;
    cookingTime: string;
    difficulty: 'Dễ' | 'Trung bình' | 'Khó';
    servings: number;
    rating: number;
    author: string;
    cuisine: string;
    dateAdded: string;
    tags: string[];
    ingredients: string[];
    instructions: string[];
    nutrition: {
        calories: number;
        protein: string;
        carbs: string;
        fat: string;
    };
}

interface Collection {
    id: string;
    name: string;
    description: string;
    recipes: Recipe[];
    isPrivate: boolean;
    dateCreated: string;
}

export default function FavoritesPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'dateAdded' | 'rating' | 'cookingTime' | 'title'>('dateAdded');
    const [filterCuisine, setFilterCuisine] = useState<string>('all');
    const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCollection, setSelectedCollection] = useState<string>('all');
    const [showCreateCollection, setShowCreateCollection] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');

    // Mock data
    const favoriteRecipes: Recipe[] = [
        {
            id: '1',
            title: 'Phở Bò Hà Nội',
            description: 'Món phở truyền thống với nước dùng trong vắt, thịt bò tươi ngon',
            image: '/images/pho-bo.jpg',
            cookingTime: '3 giờ',
            difficulty: 'Khó',
            servings: 4,
            rating: 4.8,
            author: 'Chef Mai',
            cuisine: 'Việt Nam',
            dateAdded: '2024-01-15',
            tags: ['Truyền thống', 'Nước dùng', 'Bò'],
            ingredients: ['Xương bò', 'Thịt bò', 'Bánh phở', 'Hành tây', 'Gừng'],
            instructions: ['Ninh xương 3 tiếng', 'Chuẩn bị bánh phở', 'Thái thịt bò'],
            nutrition: { calories: 450, protein: '25g', carbs: '45g', fat: '15g' }
        },
        {
            id: '2',
            title: 'Bánh Xèo Miền Tây',
            description: 'Bánh xèo giòn rụm với tôm tươi, thịt heo và giá đỗ',
            image: '/images/banh-xeo.jpg',
            cookingTime: '45 phút',
            difficulty: 'Trung bình',
            servings: 6,
            rating: 4.6,
            author: 'Chef Lan',
            cuisine: 'Miền Tây',
            dateAdded: '2024-01-10',
            tags: ['Miền Tây', 'Tôm', 'Giòn'],
            ingredients: ['Bột bánh xèo', 'Tôm', 'Thịt heo', 'Giá đỗ'],
            instructions: ['Pha bột', 'Nướng bánh', 'Cuốn với rau'],
            nutrition: { calories: 320, protein: '18g', carbs: '38g', fat: '12g' }
        },
        {
            id: '3',
            title: 'Cơm Tấm Sài Gòn',
            description: 'Cơm tấm với sườn nướng, chả trứng và tôm khô',
            image: '/images/com-tam.jpg',
            cookingTime: '1 giờ',
            difficulty: 'Dễ',
            servings: 2,
            rating: 4.7,
            author: 'Chef Nam',
            cuisine: 'Miền Nam',
            dateAdded: '2024-01-12',
            tags: ['Sài Gòn', 'Sườn nướng', 'Cơm'],
            ingredients: ['Cơm tấm', 'Sườn heo', 'Trứng', 'Tôm khô'],
            instructions: ['Ướp sườn', 'Nướng sườn', 'Chiên trứng'],
            nutrition: { calories: 580, protein: '28g', carbs: '55g', fat: '22g' }
        },
        {
            id: '4',
            title: 'Bún Chả Hà Nội',
            description: 'Bún chả thơm lừng với chả nướng và nước mắm chua ngọt',
            image: '/images/bun-cha.jpg',
            cookingTime: '1.5 giờ',
            difficulty: 'Trung bình',
            servings: 4,
            rating: 4.9,
            author: 'Chef Hùng',
            cuisine: 'Miền Bắc',
            dateAdded: '2024-01-08',
            tags: ['Hà Nội', 'Nướng', 'Truyền thống'],
            ingredients: ['Thịt heo', 'Bún tươi', 'Rau sống', 'Nước mắm'],
            instructions: ['Ướp thịt', 'Nướng chả', 'Pha nước mắm'],
            nutrition: { calories: 420, protein: '22g', carbs: '48g', fat: '16g' }
        }
    ];

    const collections: Collection[] = [
        {
            id: '1',
            name: 'Món Việt truyền thống',
            description: 'Các món ăn truyền thống Việt Nam',
            recipes: favoriteRecipes.filter(r => r.tags.includes('Truyền thống')),
            isPrivate: false,
            dateCreated: '2024-01-01'
        },
        {
            id: '2',
            name: 'Nấu nhanh cuối tuần',
            description: 'Những món ăn dễ làm cho cuối tuần',
            recipes: favoriteRecipes.filter(r => r.difficulty === 'Dễ'),
            isPrivate: true,
            dateCreated: '2024-01-05'
        }
    ];

    const cuisineTypes = ['Việt Nam', 'Miền Bắc', 'Miền Trung', 'Miền Nam', 'Miền Tây'];
    const difficultyLevels = ['Dễ', 'Trung bình', 'Khó'];

    // Filter and sort recipes
    const filteredRecipes = favoriteRecipes
        .filter(recipe => {
            const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCuisine = filterCuisine === 'all' || recipe.cuisine === filterCuisine;
            const matchesDifficulty = filterDifficulty === 'all' || recipe.difficulty === filterDifficulty;

            return matchesSearch && matchesCuisine && matchesDifficulty;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    return b.rating - a.rating;
                case 'cookingTime':
                    return parseInt(a.cookingTime) - parseInt(b.cookingTime);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'dateAdded':
                default:
                    return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
            }
        });

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Dễ': return 'text-green-600 bg-green-100';
            case 'Trung bình': return 'text-yellow-600 bg-yellow-100';
            case 'Khó': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const handleCreateCollection = () => {
        if (newCollectionName.trim()) {
            // Create new collection logic here
            setShowCreateCollection(false);
            setNewCollectionName('');
        }
    };

    const handleRemoveFavorite = (recipeId: string) => {
        // Remove from favorites logic here
        console.log('Remove favorite:', recipeId);
    };

    return (
        <>
            <Head>
                <title>Favorites - Smart Cooking AI</title>
                <meta name="description" content="Quản lý công thức yêu thích - Smart Cooking AI" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Header />

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                                <Heart className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Favorites ❤️
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Quản lý và tổ chức các công thức nấu ăn yêu thích của bạn
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                            <div className="text-2xl font-bold text-red-600 mb-1">{favoriteRecipes.length}</div>
                            <div className="text-sm text-gray-600">Công thức yêu thích</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-1">{collections.length}</div>
                            <div className="text-sm text-gray-600">Bộ sưu tập</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {favoriteRecipes.filter(r => r.difficulty === 'Dễ').length}
                            </div>
                            <div className="text-sm text-gray-600">Công thức dễ làm</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                            <div className="text-2xl font-bold text-purple-600 mb-1">
                                {Math.round(favoriteRecipes.reduce((sum, r) => sum + r.rating, 0) / favoriteRecipes.length * 10) / 10}
                            </div>
                            <div className="text-sm text-gray-600">Đánh giá trung bình</div>
                        </div>
                    </div>

                    {/* Collections */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Bộ sưu tập của tôi</h2>
                            <button
                                onClick={() => setShowCreateCollection(true)}
                                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Tạo bộ sưu tập</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {collections.map((collection) => (
                                <div
                                    key={collection.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-300"
                                    onClick={() => setSelectedCollection(collection.id)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-gray-900">{collection.name}</h3>
                                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {collection.recipes.length} món
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{collection.description}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{collection.isPrivate ? '🔒 Riêng tư' : '🌐 Công khai'}</span>
                                        <span>{new Date(collection.dateCreated).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm công thức..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex gap-4">
                                <select
                                    aria-label="Lọc theo vùng miền"
                                    value={filterCuisine}
                                    onChange={(e) => setFilterCuisine(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">Tất cả vùng miền</option>
                                    {cuisineTypes.map(cuisine => (
                                        <option key={cuisine} value={cuisine}>{cuisine}</option>
                                    ))}
                                </select>

                                <select
                                    aria-label="Lọc theo độ khó"
                                    value={filterDifficulty}
                                    onChange={(e) => setFilterDifficulty(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">Tất cả độ khó</option>
                                    {difficultyLevels.map(difficulty => (
                                        <option key={difficulty} value={difficulty}>{difficulty}</option>
                                    ))}
                                </select>

                                <select
                                    title="Sắp xếp công thức"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="dateAdded">Mới nhất</option>
                                    <option value="rating">Đánh giá cao</option>
                                    <option value="cookingTime">Thời gian nấu</option>
                                    <option value="title">Tên A-Z</option>
                                </select>

                                {/* View Mode Toggle */}
                                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
                                        title="Xem dạng lưới"
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
                                        title="Xem dạng danh sách"
                                    >
                                        <List className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recipes Grid/List */}
                    <div className={`${viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        : 'space-y-4'
                        }`}>
                        {filteredRecipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${viewMode === 'list' ? 'flex' : ''
                                    }`}
                            >
                                {/* Recipe Image */}
                                <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'} bg-gradient-to-br from-orange-400 to-red-500 relative`}>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <ChefHat className="h-16 w-16 text-white opacity-50" />
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <button
                                            onClick={() => handleRemoveFavorite(recipe.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                                            title="Bỏ yêu thích"
                                        >
                                            <Heart className="h-4 w-4 fill-current" />
                                        </button>
                                    </div>
                                </div>

                                {/* Recipe Content */}
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{recipe.title}</h3>
                                        <div className="flex items-center space-x-1 text-yellow-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="text-sm font-medium">{recipe.rating}</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>

                                    {/* Recipe Meta */}
                                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                                        <span className="flex items-center space-x-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{recipe.cookingTime}</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <Users className="h-4 w-4" />
                                            <span>{recipe.servings} người</span>
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(recipe.difficulty)}`}>
                                            {recipe.difficulty}
                                        </span>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {recipe.tags.slice(0, 3).map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Nutrition Info */}
                                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                        <div className="grid grid-cols-4 gap-2 text-xs text-center">
                                            <div>
                                                <div className="font-medium text-orange-600">{recipe.nutrition.calories}</div>
                                                <div className="text-gray-500">cal</div>
                                            </div>
                                            <div>
                                                <div className="font-medium text-blue-600">{recipe.nutrition.protein}</div>
                                                <div className="text-gray-500">protein</div>
                                            </div>
                                            <div>
                                                <div className="font-medium text-green-600">{recipe.nutrition.carbs}</div>
                                                <div className="text-gray-500">carbs</div>
                                            </div>
                                            <div>
                                                <div className="font-medium text-purple-600">{recipe.nutrition.fat}</div>
                                                <div className="text-gray-500">fat</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex space-x-2">
                                        <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2">
                                            <Eye className="h-4 w-4" />
                                            <span>Xem chi tiết</span>
                                        </button>
                                        <button
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-colors"
                                            title="Chia sẻ công thức"
                                        >
                                            <Share2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredRecipes.length === 0 && (
                        <div className="text-center py-12">
                            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-500 mb-2">Không tìm thấy công thức</h3>
                            <p className="text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                        </div>
                    )}

                    {/* Create Collection Modal */}
                    {showCreateCollection && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Tạo bộ sưu tập mới</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tên bộ sưu tập
                                        </label>
                                        <input
                                            type="text"
                                            value={newCollectionName}
                                            onChange={(e) => setNewCollectionName(e.target.value)}
                                            placeholder="Ví dụ: Món ăn cuối tuần"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            onClick={() => setShowCreateCollection(false)}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            onClick={handleCreateCollection}
                                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                                        >
                                            Tạo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const session = await getSession(context);

    return {
        props: {
            session,
        },
    };
};

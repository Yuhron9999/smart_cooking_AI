// Pages - Recipes Listing Page
import React, { useState } from 'react';
import { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Clock, Users, Star, ChefHat } from 'lucide-react';
import Header from '@/components/layout/Header';

interface Recipe {
    id: number;
    title: string;
    description: string;
    image: string;
    prepTime: number;
    cookTime: number;
    difficulty: 'easy' | 'medium' | 'hard';
    rating: number;
    servings: number;
    calories?: number;
    tags: string[];
    category: string;
}

interface RecipesPageProps {
    recipes: Recipe[];
    categories: string[];
}

const RecipesPage: NextPage<RecipesPageProps> = ({ recipes, categories }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [sortBy, setSortBy] = useState('rating');

    // Filter recipes based on search and filters
    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;

        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort recipes
    const sortedRecipes = [...filteredRecipes].sort((a, b) => {
        switch (sortBy) {
            case 'rating':
                return b.rating - a.rating;
            case 'time':
                return (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime);
            case 'difficulty':
                const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
                return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
            default:
                return 0;
        }
    });

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'text-green-600 bg-green-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'hard': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getDifficultyText = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'Dễ';
            case 'medium': return 'Trung bình';
            case 'hard': return 'Khó';
            default: return difficulty;
        }
    };

    const getCategoryText = (category: string) => {
        switch (category) {
            case 'vietnamese': return 'Món Việt';
            case 'italian': return 'Món Ý';
            case 'chinese': return 'Món Trung';
            case 'japanese': return 'Món Nhật';
            case 'thai': return 'Món Thái';
            default: return category;
        }
    };

    return (
        <>
            <Head>
                <title>Công thức nấu ăn - Smart Cooking AI</title>
                <meta name="description" content="Khám phá hàng ngàn công thức nấu ăn đa dạng với Smart Cooking AI" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Header />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            🍳 Công thức nấu ăn
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Khám phá hàng ngàn công thức nấu ăn đa dạng từ khắp nơi trên thế giới
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm công thức..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            {/* Category Filter */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                aria-label="Chọn danh mục món ăn"
                            >
                                <option value="all">Tất cả danh mục</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {getCategoryText(category)}
                                    </option>
                                ))}
                            </select>

                            {/* Difficulty Filter */}
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                aria-label="Chọn độ khó"
                            >
                                <option value="all">Tất cả độ khó</option>
                                <option value="easy">Dễ</option>
                                <option value="medium">Trung bình</option>
                                <option value="hard">Khó</option>
                            </select>

                            {/* Sort By */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                aria-label="Sắp xếp theo"
                            >
                                <option value="rating">Đánh giá cao nhất</option>
                                <option value="time">Thời gian nấu</option>
                                <option value="difficulty">Độ khó</option>
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-6">
                        <p className="text-gray-600">
                            Hiển thị {sortedRecipes.length} trong tổng số {recipes.length} công thức
                        </p>
                    </div>

                    {/* Recipes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedRecipes.map((recipe) => (
                            <Link
                                key={recipe.id}
                                href={`/recipes/${recipe.id}`}
                                className="group block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="relative">
                                    <Image
                                        src={recipe.image}
                                        alt={recipe.title}
                                        width={400}
                                        height={300}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                                            {getDifficultyText(recipe.difficulty)}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                        {recipe.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {recipe.description}
                                    </p>

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center space-x-4">
                                            <span className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {recipe.prepTime + recipe.cookTime}p
                                            </span>
                                            <span className="flex items-center">
                                                <Users className="h-4 w-4 mr-1" />
                                                {recipe.servings}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                            <span>{recipe.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Empty State */}
                    {sortedRecipes.length === 0 && (
                        <div className="text-center py-12">
                            <ChefHat className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                Không tìm thấy công thức phù hợp
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                    setSelectedDifficulty('all');
                                }}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    // Mock recipes data
    const recipes: Recipe[] = [
        {
            id: 1,
            title: "Phở Bò Hà Nội",
            description: "Món phở truyền thống của Hà Nội với nước dùng thanh ngọt từ xương bò",
            image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",
            prepTime: 30,
            cookTime: 180,
            difficulty: 'hard',
            rating: 4.8,
            servings: 4,
            calories: 450,
            tags: ['vietnamese', 'soup', 'beef'],
            category: 'vietnamese'
        },
        {
            id: 2,
            title: "Bánh Mì Thịt Nướng",
            description: "Bánh mì Việt Nam với thịt nướng thơm lừng và rau sống tươi mát",
            image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
            prepTime: 20,
            cookTime: 15,
            difficulty: 'easy',
            rating: 4.6,
            servings: 2,
            calories: 380,
            tags: ['vietnamese', 'sandwich', 'pork'],
            category: 'vietnamese'
        },
        {
            id: 3,
            title: "Spaghetti Carbonara",
            description: "Món pasta Ý cổ điển với trứng, phô mai và bacon",
            image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
            prepTime: 10,
            cookTime: 20,
            difficulty: 'medium',
            rating: 4.7,
            servings: 3,
            calories: 520,
            tags: ['italian', 'pasta', 'bacon'],
            category: 'italian'
        },
        {
            id: 4,
            title: "Bún Bò Huế",
            description: "Món bún đặc trưng miền Trung với vị cay nồng đậm đà",
            image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
            prepTime: 25,
            cookTime: 120,
            difficulty: 'hard',
            rating: 4.9,
            servings: 4,
            calories: 520,
            tags: ['vietnamese', 'soup', 'spicy'],
            category: 'vietnamese'
        },
        {
            id: 5,
            title: "Ramen Tonkotsu",
            description: "Ramen Nhật Bản với nước dùng đậm đà từ xương heo",
            image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400",
            prepTime: 30,
            cookTime: 240,
            difficulty: 'hard',
            rating: 4.8,
            servings: 2,
            calories: 680,
            tags: ['japanese', 'ramen', 'pork'],
            category: 'japanese'
        },
        {
            id: 6,
            title: "Pad Thai",
            description: "Món xào nổi tiếng của Thái Lan với vị chua ngọt đặc trưng",
            image: "https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400",
            prepTime: 15,
            cookTime: 10,
            difficulty: 'medium',
            rating: 4.5,
            servings: 3,
            calories: 450,
            tags: ['thai', 'noodles', 'stir-fry'],
            category: 'thai'
        }
    ];

    const categories = ['vietnamese', 'italian', 'chinese', 'japanese', 'thai'];

    return {
        props: {
            recipes,
            categories
        }
    };
};

export default RecipesPage;
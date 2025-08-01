import React, { useState } from 'react';
import { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import RecipeCardFixed from '@/components/recipe/RecipeCardFixed';
import {
    Search,
    Filter,
    Clock,
    ChefHat,
    Star,
    Heart,
    Plus
} from 'lucide-react';

interface Recipe {
    id: string;
    title: string;
    description: string;
    image: string;
    prepTime: number;
    cookTime: number;
    difficulty: 'easy' | 'medium' | 'hard';
    rating: number;
    ingredients: string[];
    instructions: string[];
    category: string;
    calories: number;
    servings: number;
    tags: string[];
    isAIGenerated?: boolean;
    isFavorite?: boolean;
}

const RecipesPage: NextPage = () => {
    const { t } = useTranslation('common');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [selectedTime, setSelectedTime] = useState('all');
    const [favorites, setFavorites] = useState<string[]>([]);

    // Mock data - sẽ được thay thế bằng API call
    const mockRecipes: Recipe[] = [
        {
            id: '1',
            title: 'Phở Bò Hà Nội',
            description: 'Món phở truyền thống với nước dùng thơm ngon từ xương bò',
            image: '/images/recipes/pho-bo.jpg',
            prepTime: 30,
            cookTime: 180,
            difficulty: 'medium',
            rating: 4.8,
            ingredients: ['Xương bò', 'Bánh phở', 'Hành tây', 'Gừng', 'Ngò rí'],
            instructions: ['Nấu nước dùng', 'Chuẩn bị bánh phở', 'Trình bày'],
            category: 'main',
            calories: 450,
            servings: 4,
            tags: ['vietnamese', 'noodles', 'beef'],
            isAIGenerated: false,
            isFavorite: false
        },
        {
            id: '2',
            title: 'Bánh mì thịt nướng',
            description: 'Bánh mì Việt Nam với thịt nướng thơm lừng',
            image: '/images/recipes/banh-mi.jpg',
            prepTime: 15,
            cookTime: 20,
            difficulty: 'easy',
            rating: 4.6,
            ingredients: ['Bánh mì', 'Thịt nướng', 'Đồ chua', 'Rau sống'],
            instructions: ['Nướng thịt', 'Chuẩn bị rau', 'Lắp bánh mì'],
            category: 'snack',
            calories: 320,
            servings: 2,
            tags: ['vietnamese', 'sandwich', 'grilled'],
            isAIGenerated: true,
            isFavorite: true
        }
    ];

    const [recipes] = useState<Recipe[]>(mockRecipes);

    const categories = [
        { id: 'all', name: t('common:all'), icon: ChefHat },
        { id: 'main', name: t('recipes:main_course'), icon: ChefHat },
        { id: 'appetizer', name: t('recipes:appetizer'), icon: Star },
        { id: 'dessert', name: t('recipes:dessert'), icon: Heart },
        { id: 'snack', name: t('recipes:snack'), icon: Plus }
    ];

    const difficulties = [
        { id: 'all', name: t('common:all') },
        { id: 'easy', name: t('recipes:easy') },
        { id: 'medium', name: t('recipes:medium') },
        { id: 'hard', name: t('recipes:hard') }
    ];

    const timeRanges = [
        { id: 'all', name: t('common:all') },
        { id: 'quick', name: t('recipes:under_30_min') },
        { id: 'medium', name: t('recipes:30_60_min') },
        { id: 'long', name: t('recipes:over_60_min') }
    ];

    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;

        let matchesTime = true;
        if (selectedTime === 'quick') matchesTime = (recipe.prepTime + recipe.cookTime) <= 30;
        else if (selectedTime === 'medium') matchesTime = (recipe.prepTime + recipe.cookTime) > 30 && (recipe.prepTime + recipe.cookTime) <= 60;
        else if (selectedTime === 'long') matchesTime = (recipe.prepTime + recipe.cookTime) > 60;

        return matchesSearch && matchesCategory && matchesDifficulty && matchesTime;
    });

    const toggleFavorite = (recipeId: string) => {
        setFavorites(prev =>
            prev.includes(recipeId)
                ? prev.filter(id => id !== recipeId)
                : [...prev, recipeId]
        );
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
                {/* Hero Section */}
                <section className="relative py-20 overflow-hidden">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center max-w-4xl mx-auto"
                        >
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                                {t('recipes:page_title')}
                                <span className="text-orange-500 ml-4">🍳</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8">
                                {t('recipes:page_description')}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Search and Filters */}
                <section className="py-8 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row gap-4 items-center">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    type="text"
                                    placeholder={t('recipes:search_placeholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex gap-4 flex-wrap">
                                {/* Category Filter */}
                                <select
                                    aria-label={t('recipes:category_filter')}
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
                                >
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Difficulty Filter */}
                                <select
                                    aria-label={t('recipes:difficulty_filter')}
                                    value={selectedDifficulty}
                                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
                                >
                                    {difficulties.map(difficulty => (
                                        <option key={difficulty.id} value={difficulty.id}>
                                            {difficulty.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Time Filter */}
                                <select
                                    aria-label={t('recipes:time_filter')}
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
                                >
                                    {timeRanges.map(time => (
                                        <option key={time.id} value={time.id}>
                                            {time.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recipes Grid */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {t('recipes:found_recipes', { count: filteredRecipes.length })}
                            </h2>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Filter className="w-4 h-4" />
                                {t('common:filter')}
                            </Button>
                        </div>

                        {filteredRecipes.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                {filteredRecipes.map((recipe) => (
                                    <motion.div
                                        key={recipe.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ y: -5 }}
                                        className="group"
                                    >
                                        <RecipeCardFixed
                                            title={recipe.title}
                                            description={recipe.description}
                                            image={recipe.image}
                                            prepTime={recipe.prepTime}
                                            cookTime={recipe.cookTime}
                                            difficulty={recipe.difficulty}
                                            rating={recipe.rating}
                                            calories={recipe.calories}
                                            servings={recipe.servings}
                                            isAIGenerated={recipe.isAIGenerated}
                                            isFavorite={favorites.includes(recipe.id)}
                                            onToggleFavorite={() => toggleFavorite(recipe.id)}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    {t('recipes:no_recipes_found')}
                                </h3>
                                <p className="text-gray-500">
                                    {t('recipes:try_different_search')}
                                </p>
                            </motion.div>
                        )}
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'vi', ['common', 'recipes'])),
        },
    };
};

export default RecipesPage;

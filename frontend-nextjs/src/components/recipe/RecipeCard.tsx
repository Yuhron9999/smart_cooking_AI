// components/recipe/RecipeCardFixed.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ChefHat, Star, Heart, Zap, Users } from 'lucide-react';

interface RecipeCardFixedProps {
    title: string;
    description: string;
    image: string;
    prepTime: number;
    cookTime: number;
    difficulty: 'easy' | 'medium' | 'hard';
    rating: number;
    calories: number;
    servings: number;
    isAIGenerated?: boolean;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
    onClick?: () => void;
}

const RecipeCard: React.FC<RecipeCardFixedProps> = ({
    title,
    description,
    image,
    prepTime,
    cookTime,
    difficulty,
    rating,
    calories,
    servings,
    isAIGenerated = false,
    isFavorite = false,
    onToggleFavorite,
    onClick
}) => {
    const difficultyColors = {
        easy: 'text-green-600 bg-green-100',
        medium: 'text-yellow-600 bg-yellow-100',
        hard: 'text-red-600 bg-red-100'
    };

    const difficultyLabels = {
        easy: 'Dễ',
        medium: 'Trung bình',
        hard: 'Khó'
    };

    const totalTime = prepTime + cookTime;

    return (
        <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="relative" onClick={onClick}>
                {/* Recipe Image */}
                <div className="aspect-video overflow-hidden bg-gray-200">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/recipes/placeholder.jpg';
                        }}
                    />
                </div>

                {/* AI Generated Badge */}
                {isAIGenerated && (
                    <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <Zap className="w-3 h-3" />
                            AI
                        </span>
                    </div>
                )}

                {/* Favorite Button */}
                <button
                    type="button"
                    title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite?.();
                    }}
                >
                    <Heart
                        className={`w-4 h-4 ${isFavorite
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-600'
                            }`}
                    />
                </button>
            </div>

            <div className="p-4">
                {/* Title and Description */}
                <div className="mb-3">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {description}
                    </p>
                </div>

                {/* Recipe Stats */}
                <div className="flex items-center justify-between mb-3">
                    {/* Time */}
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{totalTime} phút</span>
                    </div>

                    {/* Difficulty */}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[difficulty]}`}>
                        {difficultyLabels[difficulty]}
                    </span>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{rating}</span>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{servings} người</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <ChefHat className="w-4 h-4" />
                        <span>{calories} kcal</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                    <button
                        type="button"
                        className="flex-1 px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick?.();
                        }}
                    >
                        Xem chi tiết
                    </button>
                    <button
                        type="button"
                        className="flex-1 px-3 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Handle cooking action
                        }}
                    >
                        Nấu ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;

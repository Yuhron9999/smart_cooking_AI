import React, { useState } from 'react';
import { AIService } from '@/services/aiService';

export default function AITestPage() {
    const [chatMessage, setChatMessage] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [dishName, setDishName] = useState('phở bò');
    const [ingredients, setIngredients] = useState(['thịt bò', 'bánh phở', 'hành tây']);
    const [nutritionData, setNutritionData] = useState(null);
    const [ingredientSuggestions, setIngredientSuggestions] = useState(null);
    const [learningPath, setLearningPath] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const testChat = async () => {
        if (!chatMessage.trim()) return;

        setIsLoading(true);
        setError('');
        try {
            const response = await AIService.chat({
                message: chatMessage,
                language: 'vi'
            });

            if (response.success) {
                setChatResponse(response.data.response);
            } else {
                setError(response.message || 'Chat failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Chat error');
        } finally {
            setIsLoading(false);
        }
    };

    const testIngredientSuggestions = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await AIService.getIngredientSuggestions({
                dish_name: dishName,
                language: 'vi'
            });

            if (response.success) {
                setIngredientSuggestions(response.data);
            } else {
                setError(response.message || 'Ingredient suggestions failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ingredient suggestions error');
        } finally {
            setIsLoading(false);
        }
    };

    const testNutritionAnalysis = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await AIService.analyzeNutrition({
                dish_name: dishName,
                ingredients: ingredients,
                language: 'vi'
            });

            if (response.success) {
                setNutritionData(response.data);
            } else {
                setError(response.message || 'Nutrition analysis failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Nutrition analysis error');
        } finally {
            setIsLoading(false);
        }
    };

    const testLearningPath = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await AIService.createLearningPath({
                user_level: 'beginner',
                cuisine_preference: 'vietnamese',
                language: 'vi'
            });

            if (response.success) {
                setLearningPath(response.data);
            } else {
                setError(response.message || 'Learning path failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Learning path error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold text-green-600 mb-8">🧪 Smart Cooking AI - Test Page</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    ❌ {error}
                </div>
            )}

            {/* AI Chat Test */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">💬 AI Chat Test</h2>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Hỏi AI về nấu ăn..."
                        className="flex-1 px-3 py-2 border rounded-lg"
                        onKeyPress={(e) => e.key === 'Enter' && testChat()}
                    />
                    <button
                        onClick={testChat}
                        disabled={isLoading}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isLoading ? '⏳' : '📤'} Send
                    </button>
                </div>
                {chatResponse && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <strong>AI Response:</strong>
                        <p className="mt-2 whitespace-pre-wrap">{chatResponse}</p>
                    </div>
                )}
            </div>

            {/* Ingredient Suggestions Test */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">🥕 Ingredient Suggestions Test</h2>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={dishName}
                        onChange={(e) => setDishName(e.target.value)}
                        placeholder="Tên món ăn..."
                        className="flex-1 px-3 py-2 border rounded-lg"
                    />
                    <button
                        onClick={testIngredientSuggestions}
                        disabled={isLoading}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                    >
                        {isLoading ? '⏳' : '🔍'} Get Suggestions
                    </button>
                </div>
                {ingredientSuggestions && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm overflow-auto">{JSON.stringify(ingredientSuggestions, null, 2)}</pre>
                    </div>
                )}
            </div>

            {/* Nutrition Analysis Test */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">🥗 Nutrition Analysis Test</h2>
                <div className="mb-4">
                    <p><strong>Dish:</strong> {dishName}</p>
                    <p><strong>Ingredients:</strong> {ingredients.join(', ')}</p>
                </div>
                <button
                    onClick={testNutritionAnalysis}
                    disabled={isLoading}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
                >
                    {isLoading ? '⏳' : '📊'} Analyze Nutrition
                </button>
                {nutritionData && (
                    <div className="bg-gray-50 p-4 rounded-lg mt-4">
                        <pre className="text-sm overflow-auto">{JSON.stringify(nutritionData, null, 2)}</pre>
                    </div>
                )}
            </div>

            {/* Learning Path Test */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">📚 Learning Path Test</h2>
                <button
                    onClick={testLearningPath}
                    disabled={isLoading}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
                >
                    {isLoading ? '⏳' : '🎯'} Create Learning Path
                </button>
                {learningPath && (
                    <div className="bg-gray-50 p-4 rounded-lg mt-4">
                        <h3 className="font-semibold text-lg mb-2">{learningPath.title}</h3>
                        <p className="mb-2"><strong>Duration:</strong> {learningPath.duration_weeks} weeks</p>
                        <p className="mb-4"><strong>Total Dishes:</strong> {learningPath.total_dishes}</p>
                        <div className="space-y-3">
                            {learningPath.weekly_plan?.slice(0, 3).map((week, index) => (
                                <div key={index} className="border-l-4 border-purple-500 pl-3">
                                    <h4 className="font-medium">Week {week.week}: {week.title}</h4>
                                    <p className="text-sm text-gray-600">Skills: {week.skills.join(', ')}</p>
                                    <p className="text-sm text-gray-600">Dishes: {week.practice_dishes.join(', ')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="text-center text-gray-500 text-sm">
                🚀 Smart Cooking AI Service is running on localhost:8001
            </div>
        </div>
    );
}

import React, { useState } from 'react';

export default function SimpleAITest() {
    const [chatMessage, setChatMessage] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const testChat = async () => {
        if (!chatMessage.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8001/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: chatMessage,
                    language: 'vi'
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setChatResponse(data.data.response);
            } else {
                setError(data.message || 'Chat failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error');
        } finally {
            setIsLoading(false);
        }
    };

    const testIngredientSuggestions = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8001/api/ai/ingredient-suggestions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dish_name: 'phở bò',
                    language: 'vi'
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setChatResponse(JSON.stringify(data.data, null, 2));
            } else {
                setError(data.message || 'Ingredient suggestions failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error');
        } finally {
            setIsLoading(false);
        }
    };

    const testNutritionAnalysis = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8001/api/ai/nutrition-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dish_name: 'phở bò',
                    ingredients: ['thịt bò', 'bánh phở', 'hành tây', 'gừng'],
                    language: 'vi'
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setChatResponse(JSON.stringify(data.data, null, 2));
            } else {
                setError(data.message || 'Nutrition analysis failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error');
        } finally {
            setIsLoading(false);
        }
    };

    const testLearningPath = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8001/api/ai/learning-path', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_level: 'beginner',
                    cuisine_preference: 'vietnamese',
                    language: 'vi'
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setChatResponse(JSON.stringify(data.data, null, 2));
            } else {
                setError(data.message || 'Learning path failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold text-green-600 mb-8">🧪 AI Service Test - Direct Fetch</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    ❌ {error}
                </div>
            )}

            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">🤖 AI Service Tests</h2>

                {/* Chat Input */}
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
                        {isLoading ? '⏳' : '💬'} Chat
                    </button>
                </div>

                {/* Test Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                    <button
                        onClick={testIngredientSuggestions}
                        disabled={isLoading}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                    >
                        {isLoading ? '⏳' : '🥕'} Ingredient Suggestions
                    </button>
                    <button
                        onClick={testNutritionAnalysis}
                        disabled={isLoading}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
                    >
                        {isLoading ? '⏳' : '🥗'} Nutrition Analysis
                    </button>
                    <button
                        onClick={testLearningPath}
                        disabled={isLoading}
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
                    >
                        {isLoading ? '⏳' : '📚'} Learning Path
                    </button>
                </div>

                {/* Response Display */}
                {chatResponse && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Response:</h3>
                        <pre className="text-sm overflow-auto whitespace-pre-wrap">{chatResponse}</pre>
                    </div>
                )}
            </div>

            <div className="text-center text-gray-500 text-sm">
                🚀 Testing AI Service on localhost:8001
                <br />
                ✅ Backend running on localhost:8080
                <br />
                🤖 AI Service running on localhost:8001
            </div>
        </div>
    );
}

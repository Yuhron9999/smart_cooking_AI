import React, { useState } from 'react';
import Link from 'next/link';
import {
    MessageCircle,
    Sparkles,
    TestTube,
    Play,
    ArrowLeft,
    Bot,
    ChefHat,
    Loader2,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

export default function SimpleAITest() {
    const [chatMessage, setChatMessage] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentTest, setCurrentTest] = useState<string>('');

    const testChat = async () => {
        if (!chatMessage.trim()) return;

        setIsLoading(true);
        setError('');
        setCurrentTest('chat');

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
            setCurrentTest('');
        }
    };

    const testIngredientSuggestions = async () => {
        setIsLoading(true);
        setError('');
        setCurrentTest('ingredients');

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
            setCurrentTest('');
        }
    };

    const testNutritionAnalysis = async () => {
        setIsLoading(true);
        setError('');
        setCurrentTest('nutrition');

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
            setCurrentTest('');
        }
    };

    const testLearningPath = async () => {
        setIsLoading(true);
        setError('');
        setCurrentTest('learning');

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
            setCurrentTest('');
        }
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="navbar">
                <div className="container-modern">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                                <span>Về trang chủ</span>
                            </Link>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <div className="flex items-center space-x-2">
                                <TestTube className="w-6 h-6 text-orange-500" />
                                <span className="text-xl font-bold gradient-text">AI Service Testing</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-gray-600">AI Service Running</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="content-wrapper">
                <div className="max-w-6xl mx-auto">

                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-6">
                            <Bot className="w-5 h-5" />
                            <span className="font-medium">AI Testing Environment</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                            🧪 AI Service Testing Lab
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Test tất cả các tính năng AI của Smart Cooking AI platform trong môi trường thực tế
                        </p>
                    </div>

                    {/* Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="card text-center">
                            <div className="flex justify-center mb-3">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-800">Backend Server</h3>
                            <p className="text-sm text-gray-600">localhost:8080</p>
                            <div className="flex items-center justify-center space-x-1 mt-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-xs text-green-600">Online</span>
                            </div>
                        </div>

                        <div className="card text-center">
                            <div className="flex justify-center mb-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-800">AI Service</h3>
                            <p className="text-sm text-gray-600">localhost:8001</p>
                            <div className="flex items-center justify-center space-x-1 mt-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                <span className="text-xs text-blue-600">Ready</span>
                            </div>
                        </div>

                        <div className="card text-center">
                            <div className="flex justify-center mb-3">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <ChefHat className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-800">Test Environment</h3>
                            <p className="text-sm text-gray-600">Direct API Calls</p>
                            <div className="flex items-center justify-center space-x-1 mt-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                <span className="text-xs text-purple-600">Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="alert-error mb-6 animate-fade-in">
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Chat Section */}
                    <div className="chat-container mb-8">
                        <div className="flex items-center space-x-2 mb-6">
                            <MessageCircle className="w-6 h-6 text-orange-500" />
                            <h2 className="text-2xl font-bold text-gray-800">💬 AI Chat Testing</h2>
                        </div>

                        {/* Chat Input */}
                        <div className="relative mb-6">
                            <input
                                type="text"
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                placeholder="Hỏi AI về nấu ăn... (VD: Cách làm phở bò?)"
                                className="chat-input"
                                onKeyPress={(e) => e.key === 'Enter' && !isLoading && testChat()}
                                disabled={isLoading}
                            />
                            <button
                                onClick={testChat}
                                disabled={isLoading || !chatMessage.trim()}
                                className="chat-send-btn"
                            >
                                {isLoading && currentTest === 'chat' ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Play className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        {/* Test Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <button
                                onClick={testIngredientSuggestions}
                                disabled={isLoading}
                                className="btn-success flex items-center justify-center space-x-2"
                            >
                                {isLoading && currentTest === 'ingredients' ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <span>🥕</span>
                                )}
                                <span>Ingredient Suggestions</span>
                            </button>

                            <button
                                onClick={testNutritionAnalysis}
                                disabled={isLoading}
                                className="btn-secondary flex items-center justify-center space-x-2"
                            >
                                {isLoading && currentTest === 'nutrition' ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <span>🥗</span>
                                )}
                                <span>Nutrition Analysis</span>
                            </button>

                            <button
                                onClick={testLearningPath}
                                disabled={isLoading}
                                className="btn-primary flex items-center justify-center space-x-2"
                            >
                                {isLoading && currentTest === 'learning' ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <span>📚</span>
                                )}
                                <span>Learning Path</span>
                            </button>
                        </div>

                        {/* Response Display */}
                        {chatResponse && (
                            <div className="card-gradient animate-fade-in">
                                <div className="flex items-center space-x-2 mb-4">
                                    <Sparkles className="w-5 h-5 text-orange-500" />
                                    <h3 className="font-semibold text-gray-800">AI Response:</h3>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 border">
                                    <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto max-h-96">
                                        {chatResponse}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="card text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/ai-chat" className="btn-outline">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Full AI Chat
                            </Link>
                            <Link href="/" className="btn-glass">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


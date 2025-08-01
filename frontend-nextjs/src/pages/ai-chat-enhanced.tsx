import React, { useState, useRef, useEffect } from 'react';
import { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/Loading';
import Image from 'next/image';
import {
    Send,
    Mic,
    MicOff,
    Bot,
    User,
    Sparkles,
    ChefHat,
    Clock,
    Heart,
    BookOpen,
    Volume2,
    VolumeX,
    Camera,
    Image as ImageIcon
} from 'lucide-react';

// Types
interface Message {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    isLoading?: boolean;
    recipeData?: any;
    imageUrl?: string;
}

interface AIFeature {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    action: () => void;
}

const AIChatPage: NextPage = () => {
    const { t } = useTranslation('common');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // AI Features
    const aiFeatures: AIFeature[] = [
        {
            id: 'chat',
            title: 'Trò chuyện với AI',
            description: 'Hỏi đáp về nấu ăn, công thức, mẹo vặt',
            icon: <Bot className="w-6 h-6" />,
            color: 'bg-blue-50 border-blue-200 text-blue-700',
            action: () => setSelectedFeature('chat')
        },
        {
            id: 'recipe-gen',
            title: 'Tạo công thức',
            description: 'Tạo công thức từ nguyên liệu có sẵn',
            icon: <ChefHat className="w-6 h-6" />,
            color: 'bg-green-50 border-green-200 text-green-700',
            action: () => setSelectedFeature('recipe-gen')
        },
        {
            id: 'image-analysis',
            title: 'Nhận dạng món ăn',
            description: 'Upload ảnh để AI phân tích món ăn',
            icon: <Camera className="w-6 h-6" />,
            color: 'bg-purple-50 border-purple-200 text-purple-700',
            action: () => setSelectedFeature('image-analysis')
        },
        {
            id: 'ingredients',
            title: 'Gợi ý nguyên liệu',
            description: 'Tìm nguyên liệu cho món ăn cụ thể',
            icon: <Sparkles className="w-6 h-6" />,
            color: 'bg-orange-50 border-orange-200 text-orange-700',
            action: () => setSelectedFeature('ingredients')
        },
        {
            id: 'learning',
            title: 'Lộ trình học nấu ăn',
            description: 'Tạo kế hoạch học nấu ăn cá nhân',
            icon: <BookOpen className="w-6 h-6" />,
            color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
            action: () => setSelectedFeature('learning')
        },
        {
            id: 'nutrition',
            title: 'Phân tích dinh dưỡng',
            description: 'Kiểm tra giá trị dinh dưỡng món ăn',
            icon: <Heart className="w-6 h-6" />,
            color: 'bg-red-50 border-red-200 text-red-700',
            action: () => setSelectedFeature('nutrition')
        }
    ];

    // Send message to AI
    const sendMessage = async (messageContent: string, isImageAnalysis = false) => {
        if (!messageContent.trim() && !imageFile) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: messageContent,
            timestamp: new Date(),
            imageUrl: imagePreview || undefined
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        // Add loading message
        const loadingMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: 'Đang suy nghĩ...',
            timestamp: new Date(),
            isLoading: true
        };
        setMessages(prev => [...prev, loadingMessage]);

        try {
            let response;

            if (isImageAnalysis && imageFile) {
                // Image analysis
                const formData = new FormData();
                formData.append('file', imageFile);

                response = await fetch('/api/ai/vision', {
                    method: 'POST',
                    body: formData
                });
            } else {
                // Regular chat
                response = await fetch('/api/ai/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: messageContent,
                        language: 'vi',
                        context: messages.slice(-5).map(m => ({ role: m.type, content: m.content }))
                    })
                });
            }

            const data = await response.json();

            // Remove loading message and add AI response
            setMessages(prev => {
                const filtered = prev.filter(m => !m.isLoading);
                const aiMessage: Message = {
                    id: (Date.now() + 2).toString(),
                    type: 'ai',
                    content: data.success ? (data.data?.response || data.analysis || 'Phản hồi từ AI') : 'Xin lỗi, có lỗi xảy ra.',
                    timestamp: new Date(),
                    recipeData: data.data?.recipe_data
                };
                return [...filtered, aiMessage];
            });

        } catch (error) {
            console.error('AI Chat Error:', error);
            setMessages(prev => {
                const filtered = prev.filter(m => !m.isLoading);
                const errorMessage: Message = {
                    id: (Date.now() + 2).toString(),
                    type: 'ai',
                    content: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',
                    timestamp: new Date()
                };
                return [...filtered, errorMessage];
            });
        }

        setIsLoading(false);
        setInput('');
        setImageFile(null);
        setImagePreview(null);
    };

    // Handle image upload
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Feature-specific handlers
    const handleRecipeGeneration = async () => {
        const ingredients = input.split(',').map(i => i.trim()).filter(Boolean);
        if (ingredients.length === 0) {
            alert('Vui lòng nhập nguyên liệu, cách nhau bởi dấu phẩy');
            return;
        }

        try {
            const response = await fetch('/api/ai/generate-recipe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ingredients,
                    preferences: {},
                    language: 'vi'
                })
            });

            const data = await response.json();

            if (data.success && data.data?.recipe) {
                const recipe = data.data.recipe;
                const recipeText = `
**${recipe.title}**

**Nguyên liệu:**
${recipe.ingredients?.map((ing: string) => `• ${ing}`).join('\n') || ''}

**Cách làm:**
${recipe.instructions?.map((step: string, index: number) => `${index + 1}. ${step}`).join('\n') || ''}

**Thời gian:** ${recipe.cook_time || 30} phút
**Độ khó:** ${recipe.difficulty || 'Trung bình'}
                `.trim();

                const aiMessage: Message = {
                    id: Date.now().toString(),
                    type: 'ai',
                    content: recipeText,
                    timestamp: new Date(),
                    recipeData: recipe
                };

                setMessages(prev => [...prev, {
                    id: (Date.now() - 1).toString(),
                    type: 'user',
                    content: `Tạo công thức từ: ${ingredients.join(', ')}`,
                    timestamp: new Date()
                }, aiMessage]);
            }
        } catch (error) {
            console.error('Recipe generation error:', error);
        }

        setInput('');
    };

    const handleIngredientSuggestions = async () => {
        const dishName = input.trim();
        if (!dishName) {
            alert('Vui lòng nhập tên món ăn');
            return;
        }

        try {
            const response = await fetch('/api/ai/ingredient-suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dish_name: dishName,
                    cuisine_type: 'vietnamese'
                })
            });

            const data = await response.json();

            if (data.success && data.data) {
                const suggestions = data.data;
                const suggestionText = `
**Nguyên liệu cho món ${dishName}:**

**Nguyên liệu chính:**
${suggestions.main_ingredients?.map((ing: string) => `• ${ing}`).join('\n') || ''}

**Gia vị:**
${suggestions.seasonings?.map((ing: string) => `• ${ing}`).join('\n') || ''}

**Rau củ:**
${suggestions.vegetables?.map((ing: string) => `• ${ing}`).join('\n') || ''}

${suggestions.optional?.length > 0 ? `**Tùy chọn:**\n${suggestions.optional.map((ing: string) => `• ${ing}`).join('\n')}` : ''}

${suggestions.cooking_tips?.length > 0 ? `**Mẹo:**\n${suggestions.cooking_tips.map((tip: string) => `• ${tip}`).join('\n')}` : ''}
                `.trim();

                const aiMessage: Message = {
                    id: Date.now().toString(),
                    type: 'ai',
                    content: suggestionText,
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, {
                    id: (Date.now() - 1).toString(),
                    type: 'user',
                    content: `Gợi ý nguyên liệu cho món: ${dishName}`,
                    timestamp: new Date()
                }, aiMessage]);
            }
        } catch (error) {
            console.error('Ingredient suggestions error:', error);
        }

        setInput('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedFeature === 'recipe-gen') {
            handleRecipeGeneration();
        } else if (selectedFeature === 'ingredients') {
            handleIngredientSuggestions();
        } else if (selectedFeature === 'image-analysis' && imageFile) {
            sendMessage('Phân tích hình ảnh này', true);
        } else {
            sendMessage(input);
        }
    };

    // Voice functions (mock for now)
    const startListening = () => {
        setIsListening(true);
        // Mock voice recognition
        setTimeout(() => {
            setIsListening(false);
            setInput('Làm thế nào để nấu phở bò?');
        }, 2000);
    };

    const stopListening = () => {
        setIsListening(false);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <motion.div
                            className="text-center mb-8"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
                                <Bot className="w-10 h-10 text-green-600" />
                                Smart Cooking AI Assistant
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Trợ lý AI thông minh cho mọi nhu cầu nấu ăn của bạn
                            </p>
                        </motion.div>

                        <div className="grid lg:grid-cols-4 gap-6">
                            {/* AI Features Sidebar */}
                            <motion.div
                                className="lg:col-span-1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <Card className="sticky top-6">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-yellow-500" />
                                            Chức năng AI
                                        </h3>
                                        <div className="space-y-3">
                                            {aiFeatures.map((feature) => (
                                                <motion.button
                                                    key={feature.id}
                                                    onClick={feature.action}
                                                    className={`w-full text-left p-4 rounded-xl transition-all border-2 ${selectedFeature === feature.id
                                                            ? `${feature.color} scale-105 shadow-lg`
                                                            : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    whileHover={{ scale: selectedFeature === feature.id ? 1.05 : 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <div className="flex-shrink-0 mt-1">
                                                            {feature.icon}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-gray-800 text-sm mb-1">
                                                                {feature.title}
                                                            </div>
                                                            <div className="text-gray-500 text-xs leading-relaxed">
                                                                {feature.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Chat Area */}
                            <motion.div
                                className="lg:col-span-3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <Card className="h-[700px] flex flex-col">
                                    {/* Chat Header */}
                                    <div className="border-b border-gray-200 p-4 bg-white rounded-t-xl">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                                {selectedFeature ? (
                                                    <>
                                                        {aiFeatures.find(f => f.id === selectedFeature)?.icon}
                                                        {aiFeatures.find(f => f.id === selectedFeature)?.title}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Bot className="w-5 h-5" />
                                                        Trò chuyện với AI
                                                    </>
                                                )}
                                            </h3>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                <span>Trực tuyến</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                        <AnimatePresence>
                                            {messages.length === 0 ? (
                                                <motion.div
                                                    className="text-center py-16"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    <div className="text-6xl mb-6">🍳</div>
                                                    <h3 className="text-xl font-medium text-gray-800 mb-3">
                                                        Xin chào! Tôi là trợ lý AI nấu ăn
                                                    </h3>
                                                    <p className="text-gray-600 mb-6">
                                                        Hãy chọn một chức năng bên trái hoặc bắt đầu trò chuyện với tôi
                                                    </p>
                                                    <div className="flex justify-center gap-3">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => setSelectedFeature('chat')}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Bot className="w-4 h-4" />
                                                            Bắt đầu trò chuyện
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => setSelectedFeature('recipe-gen')}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <ChefHat className="w-4 h-4" />
                                                            Tạo công thức
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                messages.map((message) => (
                                                    <motion.div
                                                        key={message.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                                                            <div className={`rounded-2xl px-4 py-3 shadow-sm ${message.type === 'user'
                                                                    ? 'bg-green-500 text-white'
                                                                    : 'bg-white text-gray-800 border border-gray-200'
                                                                } ${message.isLoading ? 'animate-pulse' : ''}`}>
                                                                {message.imageUrl && (
                                                                    <div className="mb-3">
                                                                        <Image
                                                                            src={message.imageUrl}
                                                                            alt="Uploaded image"
                                                                            width={250}
                                                                            height={180}
                                                                            className="rounded-lg object-cover"
                                                                        />
                                                                    </div>
                                                                )}
                                                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                                                    {message.content}
                                                                </div>
                                                                {message.recipeData && (
                                                                    <motion.div
                                                                        className="mt-3 p-3 bg-white rounded-lg border border-gray-200"
                                                                        initial={{ opacity: 0, height: 0 }}
                                                                        animate={{ opacity: 1, height: 'auto' }}
                                                                    >
                                                                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                                                            <ChefHat className="w-4 h-4" />
                                                                            Công thức được tạo
                                                                        </div>
                                                                        <Button
                                                                            size="sm"
                                                                            className="text-xs h-7 px-3"
                                                                        >
                                                                            <Heart className="w-3 h-3 mr-1" />
                                                                            Lưu công thức
                                                                        </Button>
                                                                    </motion.div>
                                                                )}
                                                            </div>
                                                            <div className={`text-xs text-gray-500 mt-1 flex items-center gap-1 ${message.type === 'user' ? 'justify-end' : 'justify-start'
                                                                }`}>
                                                                {message.type === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                                                                <Clock className="w-3 h-3" />
                                                                {message.timestamp.toLocaleTimeString('vi-VN', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            )}
                                        </AnimatePresence>
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input Area */}
                                    <div className="border-t border-gray-200 p-4 bg-white rounded-b-xl">
                                        {/* Image Preview */}
                                        {imagePreview && (
                                            <motion.div
                                                className="mb-4 relative"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                            >
                                                <div className="relative inline-block">
                                                    <Image
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        width={120}
                                                        height={90}
                                                        className="rounded-lg border border-gray-200 object-cover"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            setImageFile(null);
                                                            setImagePreview(null);
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}

                                        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
                                            <div className="flex-1">
                                                <Input
                                                    value={input}
                                                    onChange={(e) => setInput(e.target.value)}
                                                    placeholder={
                                                        selectedFeature === 'recipe-gen'
                                                            ? 'Nhập nguyên liệu (cách nhau bởi dấu phẩy)...'
                                                            : selectedFeature === 'ingredients'
                                                                ? 'Nhập tên món ăn...'
                                                                : selectedFeature === 'image-analysis'
                                                                    ? 'Mô tả hoặc hỏi về hình ảnh...'
                                                                    : 'Nhập tin nhắn của bạn...'
                                                    }
                                                    className="resize-none h-12"
                                                    disabled={isLoading}
                                                />
                                            </div>

                                            <div className="flex space-x-2">
                                                {/* Voice button */}
                                                <Button
                                                    type="button"
                                                    variant={isListening ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={isListening ? stopListening : startListening}
                                                    className="h-12 w-12 p-0"
                                                >
                                                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                                </Button>

                                                {/* Image upload button */}
                                                {selectedFeature === 'image-analysis' && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="h-12 w-12 p-0"
                                                    >
                                                        <ImageIcon className="w-4 h-4" />
                                                    </Button>
                                                )}

                                                {/* Send button */}
                                                <Button
                                                    type="submit"
                                                    disabled={isLoading || (!input.trim() && !imageFile)}
                                                    className="h-12 px-6 flex items-center space-x-2"
                                                >
                                                    {isLoading ? (
                                                        <LoadingSpinner size="sm" />
                                                    ) : (
                                                        <>
                                                            <Send className="w-4 h-4" />
                                                            <span>Gửi</span>
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </form>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            title="Chọn ảnh để phân tích"
                                            placeholder="Chọn ảnh để phân tích"
                                        />
                                    </div>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale || 'vi', ['common', 'navigation']))
        }
    };
};

export default AIChatPage;

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import EnhancedLayout from '../src/components/layout/EnhancedLayout';
import {
    ChefHat,
    Send,
    Mic,
    Camera,
    Sparkles,
    Brain,
    User,
    Bot,
    Upload,
    ImageIcon,
    Copy,
    ThumbsUp,
    ThumbsDown,
    RefreshCcw,
    MessageSquare,
    Clock,
    Star,
    Utensils,
    Timer,
    Users,
    Settings,
    Volume2,
    VolumeX,
    Loader2
} from 'lucide-react';
import { aiAPI } from '../lib/api';

interface Message {
    id: string;
    type: 'user' | 'ai' | 'system';
    content: string;
    timestamp: Date;
    isTyping?: boolean;
    recipe?: any;
    images?: string[];
}

export default function AIChatPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const quickPrompts = [
        'Tạo công thức với tôm, thịt heo và rau cải',
        'Món ăn nhẹ cho bữa sáng nhanh gọn',
        'Cách làm phở bò ngon như hàng quán',
        'Món chay dinh dưỡng cho cả tuần',
        'Bánh ngọt dễ làm cho người mới bắt đầu',
        'Món ăn từ nguyên liệu có sẵn trong tủ lạnh'
    ];

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth');
        }
    }, [status, router]);

    useEffect(() => {
        // Welcome message
        if (session && messages.length === 0) {
            const welcomeMessage: Message = {
                id: '1',
                type: 'ai',
                content: `Xin chào ${session.user?.name}! 🍳 Tôi là AI Assistant của Smart Cooking. Tôi có thể giúp bạn:\n\n• Tạo công thức từ nguyên liệu có sẵn\n• Phân tích hình ảnh món ăn\n• Tư vấn về nấu ăn và dinh dưỡng\n• Hướng dẫn nấu ăn bằng giọng nói\n\nBạn muốn làm gì hôm nay?`,
                timestamp: new Date()
            };
            setMessages([welcomeMessage]);
        }
    }, [session, messages.length]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (message?: string) => {
        const messageText = message || inputMessage.trim();
        if (!messageText && !selectedImage) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: messageText,
            timestamp: new Date(),
            images: selectedImage ? [URL.createObjectURL(selectedImage)] : undefined
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        // Add typing indicator
        const typingMessage: Message = {
            id: 'typing',
            type: 'ai',
            content: 'Đang suy nghĩ...',
            timestamp: new Date(),
            isTyping: true
        };
        setMessages(prev => [...prev, typingMessage]);

        try {
            let response;

            if (selectedImage) {
                // Handle image analysis
                response = await aiAPI.analyzeImage(selectedImage);
                setSelectedImage(null);
            } else {
                // Handle text chat
                response = await aiAPI.chatWithAI(messageText, {
                    userId: session?.user?.id,
                    previousMessages: messages.slice(-5) // Last 5 messages for context
                });
            }

            // Remove typing indicator
            setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: response.message || response.description || 'Xin lỗi, tôi không thể xử lý yêu cầu này.',
                timestamp: new Date(),
                recipe: response.recipe
            };

            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error('AI Chat Error:', error);

            // Remove typing indicator
            setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: 'Xin lỗi, tôi đang gặp vấn đề kỹ thuật. Vui lòng thử lại sau.',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoiceRecording = async () => {
        if (!isRecording) {
            // Start recording
            setIsRecording(true);
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                // Implement voice recording logic here
                // For now, simulate recording
                setTimeout(() => {
                    setIsRecording(false);
                    // Simulate speech to text
                    setInputMessage('Tôi muốn nấu phở bò');
                }, 3000);
            } catch (error) {
                console.error('Voice recording error:', error);
                setIsRecording(false);
            }
        } else {
            // Stop recording
            setIsRecording(false);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleTextToSpeech = async (text: string) => {
        if (isSpeaking) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        try {
            setIsSpeaking(true);

            // Use browser's built-in TTS for now
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'vi-VN';
            utterance.rate = 0.9;
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            speechSynthesis.speak(utterance);

            // Alternative: Use AI service TTS
            // const audioBlob = await aiAPI.textToSpeech(text, 'vi');
            // const audioUrl = URL.createObjectURL(audioBlob);
            // const audio = new Audio(audioUrl);
            // audio.play();
        } catch (error) {
            console.error('Text to speech error:', error);
            setIsSpeaking(false);
        }
    };

    const handleCopyMessage = (content: string) => {
        navigator.clipboard.writeText(content);
        // Show toast notification
    };

    const renderMessage = (message: Message) => {
        const isUser = message.type === 'user';

        return (
            <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-orange-500 ml-2' : 'bg-blue-500 mr-2'
                        }`}>
                        {isUser ? (
                            <User className="w-4 h-4 text-white" />
                        ) : (
                            <Bot className="w-4 h-4 text-white" />
                        )}
                    </div>

                    {/* Message Content */}
                    <div className={`rounded-2xl px-4 py-3 ${isUser
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                        }`}>
                        {message.images && (
                            <div className="mb-2">
                                {message.images.map((image, index) => (
                                    <Image
                                        key={index}
                                        src={image}
                                        alt="Uploaded"
                                        width={128}
                                        height={128}
                                        className="max-w-full h-32 object-cover rounded-lg"
                                    />
                                ))}
                            </div>
                        )}

                        {message.isTyping ? (
                            <div className="flex items-center space-x-1">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                                <span className="text-sm text-gray-500 ml-2">{message.content}</span>
                            </div>
                        ) : (
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {message.content}
                            </div>
                        )}

                        {message.recipe && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                    <ChefHat className="w-4 h-4 mr-2" />
                                    {message.recipe.title}
                                </h4>
                                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-2">
                                    <div className="flex items-center">
                                        <Timer className="w-3 h-3 mr-1" />
                                        {message.recipe.cookingTime}p
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="w-3 h-3 mr-1" />
                                        {message.recipe.servings}
                                    </div>
                                    <div className="flex items-center">
                                        <Star className="w-3 h-3 mr-1" />
                                        {message.recipe.difficulty}
                                    </div>
                                </div>
                                <Link
                                    href={`/recipes/${message.recipe.id}`}
                                    className="btn-primary btn-sm inline-flex items-center"
                                >
                                    <Utensils className="w-3 h-3 mr-1" />
                                    Xem chi tiết
                                </Link>
                            </div>
                        )}

                        {/* Message Actions */}
                        {!message.isTyping && !isUser && (
                            <div className="flex items-center justify-end space-x-2 mt-2 text-xs">
                                <button
                                    onClick={() => handleTextToSpeech(message.content)}
                                    className="text-gray-500 hover:text-blue-500 transition-colors"
                                    title="Đọc to"
                                >
                                    {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                                </button>
                                <button
                                    onClick={() => handleCopyMessage(message.content)}
                                    className="text-gray-500 hover:text-green-500 transition-colors"
                                    title="Sao chép"
                                >
                                    <Copy className="w-3 h-3" />
                                </button>
                                <button className="text-gray-500 hover:text-green-500 transition-colors" title="Thích">
                                    <ThumbsUp className="w-3 h-3" />
                                </button>
                                <button className="text-gray-500 hover:text-red-500 transition-colors" title="Không thích">
                                    <ThumbsDown className="w-3 h-3" />
                                </button>
                            </div>
                        )}

                        {/* Timestamp */}
                        <div className={`text-xs mt-2 ${isUser ? 'text-orange-200' : 'text-gray-400'}`}>
                            {message.timestamp.toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-600">Đang khởi động AI Assistant...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <EnhancedLayout
            title="AI Assistant - Smart Cooking AI"
            description="Trò chuyện với AI Assistant để tạo công thức nấu ăn thông minh"
            pageIcon={Brain}
            pageTitle="AI Assistant"
            pageSubtitle="Trò chuyện thông minh để nhận công thức nấu ăn và hướng dẫn chi tiết"
            navbarTheme="glass"
            showBackButton={true}
            backButtonHref="/dashboard"
            actions={
                <button className="bg-orange-500 text-white rounded-lg px-4 py-2 flex items-center hover:bg-orange-600 transition-colors">
                    <Settings className="w-4 h-4 mr-2" />
                    Tùy chỉnh
                </button>
            }
        >
            <div className="flex h-[calc(100vh-80px)]">
                {/* Sidebar */}
                <div className="hidden lg:block w-80 bg-white border-r border-gray-200 overflow-y-auto">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gợi ý nhanh</h3>
                        <div className="space-y-2">
                            {quickPrompts.map((prompt, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSendMessage(prompt)}
                                    className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-orange-50 hover:border-orange-200 border border-transparent rounded-lg transition-all group"
                                >
                                    <div className="flex items-start space-x-2">
                                        <Sparkles className="w-4 h-4 text-orange-500 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span className="text-gray-700 group-hover:text-orange-700">{prompt}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tính năng</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                    <Brain className="w-6 h-6 text-blue-500" />
                                    <div>
                                        <div className="font-medium text-blue-900">Tạo công thức AI</div>
                                        <div className="text-sm text-blue-600">Từ nguyên liệu có sẵn</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                    <Camera className="w-6 h-6 text-green-500" />
                                    <div>
                                        <div className="font-medium text-green-900">Nhận dạng hình ảnh</div>
                                        <div className="text-sm text-green-600">Phân tích món ăn từ ảnh</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                                    <Mic className="w-6 h-6 text-purple-500" />
                                    <div>
                                        <div className="font-medium text-purple-900">Trợ lý giọng nói</div>
                                        <div className="text-sm text-purple-600">Nấu ăn rảnh tay</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map(renderMessage)}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="bg-white border-t border-gray-200 p-6">
                        {selectedImage && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <ImageIcon className="w-5 h-5 text-blue-500" />
                                        <span className="text-sm text-blue-700">Hình ảnh đã chọn</span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        ×
                                    </button>
                                </div>
                                <Image
                                    src={URL.createObjectURL(selectedImage)}
                                    alt="Selected"
                                    width={128}
                                    height={80}
                                    className="mt-2 max-w-32 h-20 object-cover rounded"
                                />
                            </div>
                        )}

                        <div className="flex items-end space-x-3">
                            <div className="flex-1">
                                <div className="relative">
                                    <textarea
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                        placeholder="Hỏi về công thức nấu ăn, nguyên liệu, hoặc upload hình ảnh..."
                                        className="w-full min-h-[60px] max-h-32 p-4 pr-24 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                        disabled={isLoading}
                                    />

                                    {/* Input Actions */}
                                    <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            title="Chọn hình ảnh để upload"
                                            placeholder="Chọn hình ảnh"
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="p-2 text-gray-500 hover:text-orange-500 transition-colors"
                                            title="Upload hình ảnh"
                                        >
                                            <Camera className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={handleVoiceRecording}
                                            className={`p-2 transition-colors ${isRecording
                                                ? 'text-red-500 animate-pulse'
                                                : 'text-gray-500 hover:text-orange-500'
                                                }`}
                                            title={isRecording ? 'Đang ghi âm...' : 'Ghi âm'}
                                        >
                                            <Mic className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleSendMessage()}
                                disabled={isLoading || (!inputMessage.trim() && !selectedImage)}
                                className="btn-primary p-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        <div className="mt-3 text-xs text-gray-500 text-center">
                            Smart Cooking AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
                        </div>
                    </div>
                </div>
            </div>
        </EnhancedLayout>
    );
}
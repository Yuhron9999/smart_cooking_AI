// Pages - AI Assistant Page
import React, { useState, useRef, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Send, Bot, User, Mic, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import Header from '@/components/layout/Header';
import Image from 'next/image';

interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    type?: 'text' | 'image';
    imageUrl?: string;
}

const AIAssistantPage: NextPage = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: 'Xin chào! Tôi là trợ lý AI của Smart Cooking. Tôi có thể giúp bạn tạo công thức nấu ăn, nhận dạng món ăn từ hình ảnh, hoặc tư vấn về nấu ăn. Bạn cần tôi giúp gì hôm nay?',
            role: 'assistant',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            role: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                content: generateAIResponse(input),
                role: 'assistant',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsLoading(false);
        }, 1500);
    };

    const generateAIResponse = (userInput: string): string => {
        const lowerInput = userInput.toLowerCase();

        if (lowerInput.includes('công thức') || lowerInput.includes('nấu')) {
            return 'Tôi có thể giúp bạn tạo công thức nấu ăn! Bạn có thể cho tôi biết:\n\n• Những nguyên liệu bạn có\n• Loại món ăn bạn muốn (chính, tráng miệng, v.v.)\n• Thời gian nấu mong muốn\n• Khẩu vị đặc biệt (cay, ngọt, v.v.)\n\nHãy chia sẻ thông tin này và tôi sẽ tạo công thức phù hợp cho bạn!';
        }

        if (lowerInput.includes('hình ảnh') || lowerInput.includes('ảnh') || lowerInput.includes('nhận dạng')) {
            return 'Để nhận dạng món ăn từ hình ảnh, bạn có thể:\n\n📸 Nhấn vào biểu tượng camera để chụp ảnh\n🖼️ Hoặc tải lên hình ảnh có sẵn\n\nTôi sẽ phân tích hình ảnh và:\n• Nhận dạng món ăn\n• Ước tính nguyên liệu\n• Gợi ý công thức tương tự\n• Đánh giá dinh dưỡng';
        }

        if (lowerInput.includes('dinh dưỡng') || lowerInput.includes('calo')) {
            return 'Tôi có thể giúp bạn phân tích dinh dưỡng! Hãy cho tôi biết:\n\n🍽️ Món ăn bạn muốn phân tích\n📏 Khẩu phần ăn\n⚖️ Cân nặng nguyên liệu (nếu có)\n\nTôi sẽ cung cấp thông tin về:\n• Calories\n• Protein, carbs, chất béo\n• Vitamin và khoáng chất\n• Gợi ý cải thiện dinh dưỡng';
        }

        if (lowerInput.includes('kỹ thuật') || lowerInput.includes('cách nấu')) {
            return 'Tôi có thể hướng dẫn các kỹ thuật nấu ăn:\n\n🔥 Kỹ thuật nhiệt (xào, luộc, nướng, hấp)\n🔪 Kỹ thuật dao (cắt, thái, băm)\n🥄 Kỹ thuật gia vị và nêm nếm\n⏰ Timing và độ chín\n\nBạn muốn học kỹ thuật nào cụ thể?';
        }

        return 'Cảm ơn bạn đã chia sẻ! Tôi hiểu bạn đang quan tâm đến nấu ăn. Tôi có thể giúp bạn:\n\n• 📝 Tạo công thức từ nguyên liệu có sẵn\n• 📸 Nhận dạng món ăn qua hình ảnh\n• 🍎 Tư vấn dinh dưỡng\n• 👨‍🍳 Hướng dẫn kỹ thuật nấu ăn\n• 🌟 Gợi ý món ăn phù hợp\n\nBạn muốn tôi giúp gì cụ thể hơn không?';
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleVoiceInput = () => {
        setIsListening(!isListening);
        // Voice recognition logic would go here
        setTimeout(() => setIsListening(false), 3000);
    };

    const handleImageUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            const imageMessage: Message = {
                id: Date.now().toString(),
                content: 'Đã tải lên hình ảnh để phân tích',
                role: 'user',
                timestamp: new Date(),
                type: 'image',
                imageUrl
            };

            setMessages(prev => [...prev, imageMessage]);
            setIsLoading(true);

            // Simulate image analysis
            setTimeout(() => {
                const aiResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    content: '🔍 **Kết quả phân tích hình ảnh:**\n\nMón ăn được nhận dạng: **Phở Bò**\n\n**Nguyên liệu chính:**\n• Bánh phở\n• Thịt bò thái lát\n• Hành tây\n• Ngò gai, hành lá\n• Nước dùng xương bò\n\n**Ước tính dinh dưỡng:**\n• Calories: ~450 kcal\n• Protein: 25g\n• Carbs: 60g\n• Chất béo: 12g\n\n**Gợi ý:** Món phở này trông rất ngon! Bạn có muốn tôi chia sẻ công thức nấu phở bò truyền thống không?',
                    role: 'assistant',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, aiResponse]);
                setIsLoading(false);
            }, 2000);
        }
    };

    const quickActions = [
        {
            text: "Tạo công thức từ nguyên liệu",
            icon: <Sparkles className="h-4 w-4" />,
            action: () => setInput("Tôi có [nguyên liệu bạn có], hãy tạo công thức nấu ăn cho tôi")
        },
        {
            text: "Phân tích dinh dưỡng",
            icon: <Bot className="h-4 w-4" />,
            action: () => setInput("Hãy phân tích dinh dưỡng của món ăn này cho tôi")
        },
        {
            text: "Hướng dẫn kỹ thuật nấu ăn",
            icon: <User className="h-4 w-4" />,
            action: () => setInput("Tôi muốn học kỹ thuật nấu ăn cơ bản")
        }
    ];

    return (
        <>
            <Head>
                <title>Trợ lý AI - Smart Cooking AI</title>
                <meta name="description" content="Trò chuyện với trợ lý AI thông minh về nấu ăn, tạo công thức và nhận dạng món ăn" />
            </Head>

            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />

                <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
                    {/* Page Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                            <Bot className="h-8 w-8 mr-3 text-orange-500" />
                            Trợ lý AI Smart Cooking
                        </h1>
                        <p className="text-gray-600">
                            Hỏi tôi về công thức nấu ăn, kỹ thuật, hoặc tải lên hình ảnh để nhận dạng món ăn
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={action.action}
                                    className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-colors"
                                >
                                    {action.icon}
                                    <span className="ml-2">{action.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex items-start space-x-2 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-orange-500' : 'bg-gray-100'}`}>
                                            {message.role === 'user' ? (
                                                <User className="h-4 w-4 text-white" />
                                            ) : (
                                                <Bot className="h-4 w-4 text-gray-600" />
                                            )}
                                        </div>
                                        <div className={`px-4 py-2 rounded-lg ${message.role === 'user' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                                            {message.type === 'image' && message.imageUrl && (
                                                <div className="mb-2">
                                                    <Image
                                                        src={message.imageUrl}
                                                        alt="Uploaded"
                                                        className="max-w-xs rounded-lg"
                                                        style={{ width: 'auto', height: 'auto' }}
                                                    />
                                                </div>
                                            )}
                                            <div className="whitespace-pre-wrap">{message.content}</div>
                                            <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-orange-100' : 'text-gray-500'}`}>
                                                {message.timestamp.toLocaleTimeString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex items-start space-x-2">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                            <Bot className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <div className="px-4 py-2 rounded-lg bg-gray-100">
                                            <div className="flex items-center space-x-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Đang suy nghĩ...</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-gray-200 p-4">
                            <div className="flex items-end space-x-2">
                                <button
                                    onClick={handleImageUpload}
                                    className="flex-shrink-0 p-2 text-gray-400 hover:text-orange-500 transition-colors"
                                    title="Tải lên hình ảnh"
                                >
                                    <ImageIcon className="h-5 w-5" />
                                </button>

                                <button
                                    onClick={handleVoiceInput}
                                    className={`flex-shrink-0 p-2 transition-colors ${isListening ? 'text-red-500' : 'text-gray-400 hover:text-orange-500'}`}
                                    title="Ghi âm giọng nói"
                                >
                                    <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
                                </button>

                                <div className="flex-1 relative">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Nhập tin nhắn... (Enter để gửi)"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ai-assistant-textarea"
                                        rows={1}
                                    />
                                </div>

                                <button
                                    onClick={handleSendMessage}
                                    disabled={!input.trim() || isLoading}
                                    aria-label="Send message"
                                    className="flex-shrink-0 p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        title="Tải lên hình ảnh"
                        placeholder="Chọn hình ảnh để tải lên"
                    />
                </main>
            </div>
        </>
    );
};

export default AIAssistantPage;

import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Header from '@/components/layout/Header';
import {
    Send,
    Mic,
    MicOff,
    Camera,
    Image as ImageIcon,
    Sparkles,
    ChefHat,
    Clock,
    Users,
    Star,
    Bot,
    User
} from 'lucide-react';

interface Message {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    isTyping?: boolean;
}

export default function AIChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'ai',
            content: 'Xin chào! Tôi là trợ lý AI của Smart Cooking. Bạn có thể hỏi tôi về công thức nấu ăn, cách chế biến món ăn, hoặc tôi có thể giúp bạn tạo món ăn từ nguyên liệu có sẵn. Bạn muốn làm gì hôm nay? 🍳',
            timestamp: new Date()
        }
    ]);

    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const quickPrompts = [
        {
            text: "Tạo công thức từ nguyên liệu có sẵn",
            icon: <Sparkles className="h-4 w-4" />,
            prompt: "Tôi có thịt bò, rau muống, cà chua, hành tây trong tủ lạnh. Bạn có thể gợi ý món ăn và công thức nấu không?"
        },
        {
            text: "Món ăn truyền thống Việt Nam",
            icon: <ChefHat className="h-4 w-4" />,
            prompt: "Hướng dẫn tôi nấu một món ăn truyền thống Việt Nam dễ làm cho người mới bắt đầu"
        },
        {
            text: "Món ăn nhanh 15 phút",
            icon: <Clock className="h-4 w-4" />,
            prompt: "Gợi ý món ăn có thể làm xong trong 15 phút cho bữa sáng"
        },
        {
            text: "Món ăn cho nhóm bạn",
            icon: <Users className="h-4 w-4" />,
            prompt: "Tôi cần nấu cho 6 người, gợi ý món ăn dễ làm và ngon"
        }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        // Simulate AI typing
        const typingMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: '',
            timestamp: new Date(),
            isTyping: true
        };
        setMessages(prev => [...prev, typingMessage]);

        try {
            // Call AI API
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputMessage,
                    conversation_history: messages.slice(-10) // Last 10 messages for context
                }),
            });

            if (response.ok) {
                const data = await response.json();

                // Remove typing indicator and add real response
                setMessages(prev => {
                    const filtered = prev.filter(msg => !msg.isTyping);
                    return [...filtered, {
                        id: Date.now().toString(),
                        type: 'ai',
                        content: data.response,
                        timestamp: new Date()
                    }];
                });
            } else {
                throw new Error('API call failed');
            }
        } catch (error) {
            console.error('Chat error:', error);

            // Remove typing indicator and show error
            setMessages(prev => {
                const filtered = prev.filter(msg => !msg.isTyping);
                return [...filtered, {
                    id: Date.now().toString(),
                    type: 'ai',
                    content: 'Xin lỗi, tôi đang gặp một chút trục trặc. Vui lòng thử lại sau. 🤖',
                    timestamp: new Date()
                }];
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleQuickPrompt = (prompt: string) => {
        setInputMessage(prompt);
        inputRef.current?.focus();
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        // Implement voice recording logic here
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Head>
                <title>AI Chat - Smart Cooking AI</title>
                <meta name="description" content="Trò chuyện với AI về nấu ăn, tạo công thức và nhận tư vấn món ăn" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Header />

                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Chat Header */}
                    <div className="bg-white rounded-t-2xl shadow-lg border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                    <Bot className="h-6 w-6 text-white" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Smart Cooking AI</h1>
                                <p className="text-sm text-gray-500">Trợ lý nấu ăn thông minh • Đang hoạt động</p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="bg-white shadow-lg max-h-96 overflow-y-auto">
                        <div className="px-6 py-4 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex items-start space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                        {/* Avatar */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user'
                                                ? 'bg-blue-500'
                                                : 'bg-gradient-to-r from-orange-500 to-red-500'
                                            }`}>
                                            {message.type === 'user' ? (
                                                <User className="h-4 w-4 text-white" />
                                            ) : (
                                                <Bot className="h-4 w-4 text-white" />
                                            )}
                                        </div>

                                        {/* Message Bubble */}
                                        <div className={`rounded-2xl px-4 py-3 ${message.type === 'user'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-900'
                                            }`}>
                                            {message.isTyping ? (
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                                    <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                                                        }`}>
                                                        {formatTime(message.timestamp)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Quick Prompts */}
                    <div className="bg-white border-t border-gray-200 px-6 py-4">
                        <p className="text-sm text-gray-600 mb-3">Gợi ý câu hỏi:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {quickPrompts.map((prompt, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickPrompt(prompt.prompt)}
                                    className="flex items-center space-x-2 p-3 text-left text-sm border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                                >
                                    <span className="text-orange-500">{prompt.icon}</span>
                                    <span className="text-gray-700">{prompt.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="bg-white rounded-b-2xl shadow-lg border-t border-gray-200 px-6 py-4">
                        <div className="flex items-center space-x-3">
                            {/* Voice Recording Button */}
                            <button
                                onClick={toggleRecording}
                                className={`p-3 rounded-full transition-colors ${isRecording
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                            </button>

                            {/* Image Upload Button */}
                            <button
                                title="Tải ảnh lên"
                                className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                                <ImageIcon className="h-5 w-5" />
                            </button>

                            {/* Message Input */}
                            <div className="flex-1 relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Hỏi tôi về món ăn, công thức nấu ăn..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Send Button */}
                            <button
                                title="Gửi tin nhắn"
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim() || isLoading}
                                className="p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const session = await getSession(context);

    // Optional: Require authentication for AI chat
    // if (!session) {
    //   return {
    //     redirect: {
    //       destination: '/auth/signin',
    //       permanent: false,
    //     },
    //   };
    // }

    return {
        props: {
            session,
        },
    };
};

// Pages - AI Chat Page
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
    VolumeX
} from 'lucide-react';

interface Message {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    isTyping?: boolean;
    recipeData?: {
        title: string;
        ingredients: string[];
        instructions: string[];
        cookTime: number;
        difficulty: string;
    };
}

const AIChatPage: NextPage = () => {
    const { t } = useTranslation('common');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Welcome message
    useEffect(() => {
        const welcomeMessage: Message = {
            id: '1',
            type: 'ai',
            content: t('ai_chat:welcome_message'),
            timestamp: new Date()
        };
        setMessages([welcomeMessage]);
    }, [t]);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Quick suggestions
    const quickSuggestions = [
        t('ai_chat:suggestion_1'),
        t('ai_chat:suggestion_2'),
        t('ai_chat:suggestion_3'),
        t('ai_chat:suggestion_4')
    ];

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

        // Simulate typing indicator
        const typingMessage: Message = {
            id: 'typing',
            type: 'ai',
            content: '',
            timestamp: new Date(),
            isTyping: true
        };
        setMessages(prev => [...prev, typingMessage]);

        try {
            // Call AI service
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: inputMessage,
                    language: 'vi'
                })
            });

            const data = await response.json();

            // Remove typing indicator
            setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

            // Add AI response
            const aiMessage: Message = {
                id: Date.now().toString(),
                type: 'ai',
                content: data.response || t('ai_chat:error_message'),
                timestamp: new Date(),
                recipeData: data.recipeData
            };

            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error('AI Chat error:', error);
            setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

            const errorMessage: Message = {
                id: Date.now().toString(),
                type: 'ai',
                content: t('ai_chat:error_message'),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
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

    const startVoiceRecognition = () => {
        setIsListening(true);
        // Voice recognition logic would go here
        setTimeout(() => {
            setIsListening(false);
            setInputMessage(t('ai_chat:voice_example'));
        }, 3000);
    };

    const speakMessage = (text: string) => {
        if ('speechSynthesis' in window) {
            setIsSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'vi-VN';
            utterance.onend = () => setIsSpeaking(false);
            speechSynthesis.speak(utterance);
        }
    };

    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputMessage(suggestion);
        inputRef.current?.focus();
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                {/* Header */}
                <section className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">
                                        {t('ai_chat:title')}
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        {t('ai_chat:subtitle')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                    {t('common:online')}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Chat Container */}
                <div className="container mx-auto px-4 py-6 max-w-4xl">
                    <div className="flex flex-col h-[calc(100vh-200px)]">
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2">
                            <AnimatePresence>
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                                            {/* Avatar */}
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${message.type === 'user'
                                                ? 'bg-blue-500 ml-3'
                                                : 'bg-gradient-to-r from-purple-500 to-pink-500 mr-3'
                                                }`}>
                                                {message.type === 'user' ? (
                                                    <User className="w-5 h-5 text-white" />
                                                ) : (
                                                    <Bot className="w-5 h-5 text-white" />
                                                )}
                                            </div>

                                            {/* Message Content */}
                                            <div className={`rounded-2xl px-4 py-3 max-w-full ${message.type === 'user'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white shadow-sm border border-gray-200'
                                                }`}>
                                                {message.isTyping ? (
                                                    <div className="flex items-center space-x-1">
                                                        <div className="flex space-x-1">
                                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                        </div>
                                                        <span className="text-sm text-gray-500 ml-2">
                                                            {t('ai_chat:typing')}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                            {message.content}
                                                        </p>

                                                        {/* Recipe Card */}
                                                        {message.recipeData && (
                                                            <Card className="mt-3">
                                                                <CardContent className="p-4">
                                                                    <div className="flex items-center mb-2">
                                                                        <ChefHat className="w-4 h-4 text-orange-500 mr-2" />
                                                                        <h4 className="font-semibold text-gray-900">
                                                                            {message.recipeData.title}
                                                                        </h4>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                                                                        <div className="flex items-center">
                                                                            <Clock className="w-3 h-3 mr-1" />
                                                                            {message.recipeData.cookTime} phút
                                                                        </div>
                                                                        <div className="flex items-center">
                                                                            <Sparkles className="w-3 h-3 mr-1" />
                                                                            {message.recipeData.difficulty}
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <div>
                                                                            <h5 className="text-xs font-medium text-gray-700 mb-1">
                                                                                {t('recipe:ingredients')}:
                                                                            </h5>
                                                                            <p className="text-xs text-gray-600">
                                                                                {message.recipeData.ingredients.join(', ')}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <Button
                                                                        size="sm"
                                                                        className="mt-3 w-full"
                                                                        variant="outline"
                                                                    >
                                                                        <BookOpen className="w-3 h-3 mr-1" />
                                                                        {t('recipe:view_full_recipe')}
                                                                    </Button>
                                                                </CardContent>
                                                            </Card>
                                                        )}

                                                        {/* Message Actions */}
                                                        {message.type === 'ai' && !message.isTyping && (
                                                            <div className="flex items-center justify-end mt-2 space-x-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => speakMessage(message.content)}
                                                                    disabled={isSpeaking}
                                                                    className="text-xs p-1 h-6"
                                                                >
                                                                    {isSpeaking ? (
                                                                        <VolumeX className="w-3 h-3" />
                                                                    ) : (
                                                                        <Volume2 className="w-3 h-3" />
                                                                    )}
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="text-xs p-1 h-6"
                                                                >
                                                                    <Heart className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                                {/* Timestamp */}
                                                <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                                                    }`}>
                                                    {message.timestamp.toLocaleTimeString('vi-VN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Suggestions */}
                        {messages.length === 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4"
                            >
                                <p className="text-sm text-gray-600 mb-3 text-center">
                                    {t('ai_chat:quick_suggestions')}
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {quickSuggestions.map((suggestion, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="text-xs"
                                        >
                                            {suggestion}
                                        </Button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Input Area */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                            <div className="flex items-end space-x-3">
                                {/* Voice Input Button */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={startVoiceRecognition}
                                    disabled={isListening || isLoading}
                                    className={`flex-shrink-0 ${isListening ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
                                >
                                    {isListening ? (
                                        <MicOff className="w-4 h-4" />
                                    ) : (
                                        <Mic className="w-4 h-4" />
                                    )}
                                </Button>

                                {/* Text Input */}
                                <div className="flex-1">
                                    <Input
                                        ref={inputRef}
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder={t('ai_chat:input_placeholder')}
                                        disabled={isLoading}
                                        className="border-0 shadow-none focus:ring-0 resize-none"
                                        style={{ minHeight: '40px' }}
                                    />
                                </div>

                                {/* Send Button */}
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!inputMessage.trim() || isLoading}
                                    className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                    {isLoading ? (
                                        <LoadingSpinner className="w-4 h-4" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>

                            {/* Status Text */}
                            {(isListening || isLoading) && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-xs text-gray-500 mt-2 text-center"
                                >
                                    {isListening && t('ai_chat:listening')}
                                    {isLoading && t('ai_chat:thinking')}
                                </motion.p>
                            )}
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
            ...(await serverSideTranslations(locale ?? 'vi', ['common', 'ai_chat', 'recipe'])),
        },
    };
};

export default AIChatPage;

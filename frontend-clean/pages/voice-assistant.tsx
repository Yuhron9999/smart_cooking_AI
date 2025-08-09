import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { EnhancedLayout } from '../src/components';
import { aiAPI } from '../lib/api';
import {
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    Square,
    Settings,
    Brain,
    ChefHat,
    Timer,
    User,
    Sparkles,
    Headphones,
    Radio,
    Loader2
} from 'lucide-react';

// Add SpeechRecognition type for TypeScript
type SpeechRecognition = InstanceType<typeof window.webkitSpeechRecognition>;

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

interface VoiceCommand {
    id: string;
    command: string;
    response: string;
    timestamp: Date;
    processingTime?: number;
}

export default function VoiceAssistantPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [voiceState, setVoiceState] = useState<VoiceState>('idle');
    const [currentCommand, setCurrentCommand] = useState('');
    const [currentResponse, setCurrentResponse] = useState('');
    const [commandHistory, setCommandHistory] = useState<VoiceCommand[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [volume, setVolume] = useState(0.8);
    const [speechRate, setSpeechRate] = useState(0.9);
    const [language, setLanguage] = useState('vi-VN');

    const quickCommands = [
        'Tạo công thức phở bò',
        'Món ăn từ tôm và rau cải',
        'Cách làm bánh mì',
        'Món chay cho bữa tối',
        'Thời gian nấu cơm',
        'Nguyên liệu làm bánh flan'
    ];

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth');
        }
    }, [status, router]);

    useEffect(() => {
        // Initialize speech recognition
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            const speechRecognition = new (window as any).webkitSpeechRecognition();
            speechRecognition.continuous = false;
            speechRecognition.interimResults = true;
            speechRecognition.lang = language;

            speechRecognition.onstart = () => {
                setVoiceState('listening');
                setIsListening(true);
            };

            speechRecognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setCurrentCommand(transcript);

                if (event.results[0].isFinal) {
                    handleVoiceCommand(transcript);
                }
            };

            speechRecognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setVoiceState('error');
                setIsListening(false);
            };

            speechRecognition.onend = () => {
                setIsListening(false);
                if (voiceState === 'listening') {
                    setVoiceState('idle');
                }
            };

            setRecognition(speechRecognition);
        }

        // Initialize speech synthesis
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setSynthesis(window.speechSynthesis);

            const loadVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                setVoices(availableVoices);

                // Find Vietnamese voice
                const vietnameseVoice = availableVoices.find(voice =>
                    voice.lang.includes('vi') || voice.name.includes('Vietnamese')
                );

                if (vietnameseVoice) {
                    setSelectedVoice(vietnameseVoice);
                } else {
                    setSelectedVoice(availableVoices[0]);
                }
            };

            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, [language, voiceState]);

    const startListening = () => {
        if (recognition && !isListening) {
            setCurrentCommand('');
            setCurrentResponse('');
            recognition.start();
        }
    };

    const stopListening = () => {
        if (recognition && isListening) {
            recognition.stop();
            setIsListening(false);
            setVoiceState('idle');
        }
    };

    const handleVoiceCommand = async (command: string) => {
        const startTime = Date.now();
        setVoiceState('processing');

        try {
            // Thêm system prompt để AI hiểu context tốt hơn
            const systemPrompt = `Bạn là trợ lý nấu ăn thông minh của Smart Cooking AI. 
            Hãy trả lời ngắn gọn (1-2 câu), thân thiện và hữu ích về nấu ăn.
            Tập trung vào: công thức, nguyên liệu, kỹ thuật nấu ăn, dinh dưỡng.
            Trả lời bằng tiếng Việt.`;

            const enhancedMessage = `${systemPrompt}\n\nCâu hỏi: ${command}`;

            const response = await aiAPI.chatWithAI(enhancedMessage, {
                userId: session?.user?.id,
                isVoiceCommand: true,
                language: language,
                maxTokens: 150, // Giới hạn độ dài trả lời
                context: 'voice_cooking_assistant'
            });

            const processingTime = Date.now() - startTime;
            const responseText = response.message || 'Xin lỗi, tôi không hiểu yêu cầu của bạn.';

            setCurrentResponse(responseText);

            // Add to history
            const newCommand: VoiceCommand = {
                id: Date.now().toString(),
                command,
                response: responseText,
                timestamp: new Date(),
                processingTime
            };

            setCommandHistory(prev => [newCommand, ...prev.slice(0, 9)]); // Keep last 10 commands

            // Speak the response
            await speakText(responseText);

        } catch (error) {
            console.error('Voice command error:', error);
            const errorMessage = 'Xin lỗi, tôi đang gặp vấn đề kỹ thuật.';
            setCurrentResponse(errorMessage);
            await speakText(errorMessage);
            setVoiceState('error');
        }
    };

    const speakText = async (text: string) => {
        return new Promise<void>((resolve) => {
            if (synthesis && selectedVoice) {
                // Cancel any ongoing speech
                synthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.voice = selectedVoice;
                utterance.volume = volume;
                utterance.rate = speechRate;
                utterance.lang = language;

                utterance.onstart = () => {
                    setVoiceState('speaking');
                    setIsSpeaking(true);
                };

                utterance.onend = () => {
                    setVoiceState('idle');
                    setIsSpeaking(false);
                    resolve();
                };

                utterance.onerror = (event) => {
                    console.error('Speech synthesis error:', event);
                    setVoiceState('idle');
                    setIsSpeaking(false);
                    resolve();
                };

                synthesis.speak(utterance);
            } else {
                resolve();
            }
        });
    };

    const stopSpeaking = () => {
        if (synthesis) {
            synthesis.cancel();
            setIsSpeaking(false);
            setVoiceState('idle');
        }
    };

    const handleQuickCommand = async (command: string) => {
        setCurrentCommand(command);
        await handleVoiceCommand(command);
    };

    const getStateIcon = () => {
        switch (voiceState) {
            case 'listening':
                return <Mic className="w-8 h-8 text-red-500 animate-pulse" />;
            case 'processing':
                return <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />;
            case 'speaking':
                return <Volume2 className="w-8 h-8 text-green-500 animate-bounce" />;
            case 'error':
                return <MicOff className="w-8 h-8 text-red-500" />;
            default:
                return <Mic className="w-8 h-8 text-gray-400" />;
        }
    };

    const getStateText = () => {
        switch (voiceState) {
            case 'listening':
                return 'Đang nghe...';
            case 'processing':
                return 'Đang xử lý...';
            case 'speaking':
                return 'Đang trả lời...';
            case 'error':
                return 'Có lỗi xảy ra';
            default:
                return 'Nhấn để bắt đầu';
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-600">Đang khởi động Voice Assistant...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <EnhancedLayout
            title="Voice Assistant - Smart Cooking AI"
            description="Trợ lý giọng nội thông minh cho nấu ăn"
            pageIcon={Headphones}
            pageTitle="Voice Assistant"
            pageSubtitle="Sử dụng giọng nói để tìm kiếm công thức và hỏi đáp về nấu ăn"
            navbarTheme="glass"
            showBackButton={true}
            backButtonHref="/dashboard"
            actions={
                <button className="bg-orange-500 text-white rounded-lg px-4 py-2 flex items-center hover:bg-orange-600 transition-colors">
                    <Settings className="w-4 h-4 mr-2" />
                    Cài đặt
                </button>
            }
            className="bg-gradient-to-br from-purple-50 to-blue-50"
        >
            <div className="container-modern py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Voice Interface */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                            {/* Voice State Indicator */}
                            <div className="mb-8">
                                <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 ${voiceState === 'listening' ? 'bg-red-100 animate-pulse' :
                                    voiceState === 'processing' ? 'bg-blue-100' :
                                        voiceState === 'speaking' ? 'bg-green-100' :
                                            voiceState === 'error' ? 'bg-red-100' :
                                                'bg-gray-100'
                                    }`}>
                                    {getStateIcon()}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {getStateText()}
                                </h2>
                                <p className="text-gray-600">
                                    {voiceState === 'idle' && 'Nhấn micro để bắt đầu trò chuyện'}
                                    {voiceState === 'listening' && 'Tôi đang lắng nghe bạn...'}
                                    {voiceState === 'processing' && 'Đang suy nghĩ về câu trả lời...'}
                                    {voiceState === 'speaking' && 'Tôi đang trả lời bạn...'}
                                    {voiceState === 'error' && 'Vui lòng thử lại'}
                                </p>
                            </div>

                            {/* Current Command/Response */}
                            {currentCommand && (
                                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h3 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
                                        <User className="w-4 h-4 mr-2" />
                                        Bạn đã nói:
                                    </h3>
                                    <p className="text-blue-800">{currentCommand}</p>
                                </div>
                            )}

                            {currentResponse && (
                                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                    <h3 className="text-sm font-medium text-green-900 mb-2 flex items-center">
                                        <Brain className="w-4 h-4 mr-2" />
                                        AI trả lời:
                                    </h3>
                                    <p className="text-green-800">{currentResponse}</p>
                                </div>
                            )}

                            {/* Voice Controls */}
                            <div className="flex justify-center space-x-4">
                                {!isListening ? (
                                    <button
                                        onClick={startListening}
                                        disabled={voiceState === 'processing' || voiceState === 'speaking'}
                                        className="btn-primary btn-lg px-8 py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
                                    >
                                        <Mic className="w-6 h-6 mr-3" />
                                        Bắt đầu nói
                                    </button>
                                ) : (
                                    <button
                                        onClick={stopListening}
                                        className="btn-danger btn-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all"
                                    >
                                        <Square className="w-6 h-6 mr-3" />
                                        Dừng nghe
                                    </button>
                                )}

                                {isSpeaking && (
                                    <button
                                        onClick={stopSpeaking}
                                        className="btn-secondary btn-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all"
                                    >
                                        <VolumeX className="w-6 h-6 mr-3" />
                                        Dừng nói
                                    </button>
                                )}
                            </div>

                            {/* Quick Commands */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">Lệnh nhanh</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {quickCommands.map((command, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleQuickCommand(command)}
                                            disabled={voiceState !== 'idle'}
                                            className="p-3 text-sm bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed group"
                                        >
                                            <div className="flex items-start space-x-2">
                                                <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 group-hover:scale-110 transition-transform" />
                                                <span className="text-purple-700">{command}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Voice Settings */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Settings className="w-5 h-5 mr-2" />
                                Cài đặt giọng nói
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-2">
                                        Ngôn ngữ
                                    </label>
                                    <select
                                        id="language-select"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="vi-VN">🇻🇳 Tiếng Việt</option>
                                        <option value="en-US">🇺🇸 English</option>
                                        <option value="ja-JP">🇯🇵 日本語</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Âm lượng: {Math.round(volume * 100)}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={volume}
                                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                                        className="w-full"
                                        title="Điều chỉnh âm lượng"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tốc độ nói: {Math.round(speechRate * 100)}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="2"
                                        step="0.1"
                                        value={speechRate}
                                        onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                                        className="w-full"
                                        title="Điều chỉnh tốc độ nói"
                                        placeholder="Tốc độ nói"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Recent Commands */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Timer className="w-5 h-5 mr-2" />
                                Lịch sử gần đây
                            </h3>

                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {commandHistory.length === 0 ? (
                                    <p className="text-gray-500 text-sm">Chưa có lệnh nào</p>
                                ) : (
                                    commandHistory.map((cmd) => (
                                        <div key={cmd.id} className="p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm text-gray-600 mb-1">
                                                <strong>Lệnh:</strong> {cmd.command}
                                            </div>
                                            <div className="text-sm text-gray-800 mb-2">
                                                <strong>Phản hồi:</strong> {cmd.response.substring(0, 100)}
                                                {cmd.response.length > 100 && '...'}
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>{cmd.timestamp.toLocaleTimeString('vi-VN')}</span>
                                                {cmd.processingTime && (
                                                    <span>{cmd.processingTime}ms</span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl shadow-lg p-6 border border-orange-200">
                            <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                                <ChefHat className="w-5 h-5 mr-2" />
                                Mẹo sử dụng
                            </h3>

                            <ul className="space-y-2 text-sm text-orange-800">
                                <li className="flex items-start space-x-2">
                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Nói rõ ràng và không quá nhanh</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Sử dụng từ khóa như &quot;tạo công thức&quot;, &quot;nấu món&quot;</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Đề cập nguyên liệu cụ thể để có kết quả tốt hơn</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Hỏi về thời gian nấu, nhiệt độ, kỹ thuật</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </EnhancedLayout>
    );
}

import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Header from '@/components/layout/Header';
import {
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    Play,
    Pause,
    RotateCcw,
    Settings,
    Languages,
    Headphones
} from 'lucide-react';

interface VoiceSession {
    id: string;
    transcript: string;
    response: string;
    timestamp: Date;
    duration: number;
}

export default function VoiceAssistantPage() {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentTranscript, setCurrentTranscript] = useState('');
    const [voiceSessions, setVoiceSessions] = useState<VoiceSession[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState('vi-VN');
    const [voiceVolume, setVoiceVolume] = useState(0.8);
    const [speechRate, setSpeechRate] = useState(1.0);

    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<any>(null);

    const languages = [
        { code: 'vi-VN', name: 'Tiếng Việt', flag: '🇻🇳' },
        { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
        { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
        { code: 'ko-KR', name: '한국어', flag: '🇰🇷' }
    ];

    const quickCommands = [
        {
            title: 'Tạo công thức từ nguyên liệu',
            command: 'Tôi có thịt bò, cà chua, hành tây. Làm món gì được?',
            example: 'Nói: "Tôi có thịt bò, cà chua, hành tây. Làm món gì được?"'
        },
        {
            title: 'Hướng dẫn nấu món cụ thể',
            command: 'Hướng dẫn tôi nấu phở bò',
            example: 'Nói: "Hướng dẫn tôi nấu phở bò"'
        },
        {
            title: 'Kiểm tra dinh dưỡng',
            command: 'Phân tích dinh dưỡng của món gà nướng',
            example: 'Nói: "Phân tích dinh dưỡng của món gà nướng"'
        },
        {
            title: 'Thay thế nguyên liệu',
            command: 'Thay thế đường bằng gì trong công thức bánh?',
            example: 'Nói: "Thay thế đường bằng gì trong công thức bánh?"'
        }
    ];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Initialize Speech Recognition
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = selectedLanguage;

                recognitionRef.current.onresult = (event: any) => {
                    let transcript = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        transcript += event.results[i][0].transcript;
                    }
                    setCurrentTranscript(transcript);
                };

                recognitionRef.current.onend = () => {
                    if (isListening) {
                        processVoiceCommand();
                    }
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);
                    setIsProcessing(false);
                };
            }

            // Initialize Speech Synthesis
            synthRef.current = window.speechSynthesis;
        }
    }, [selectedLanguage, isListening]);

    const startListening = () => {
        if (recognitionRef.current) {
            setIsListening(true);
            setCurrentTranscript('');
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            setIsListening(false);
            recognitionRef.current.stop();
        }
    };

    const processVoiceCommand = async () => {
        if (!currentTranscript.trim()) return;

        setIsProcessing(true);
        setIsListening(false);

        try {
            const response = await fetch('/api/ai/voice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transcript: currentTranscript,
                    language: selectedLanguage,
                    action: 'process_voice_command'
                }),
            });

            if (response.ok) {
                const data = await response.json();

                const session: VoiceSession = {
                    id: Date.now().toString(),
                    transcript: currentTranscript,
                    response: data.response,
                    timestamp: new Date(),
                    duration: data.duration || 0
                };

                setVoiceSessions(prev => [session, ...prev]);

                // Speak the response
                speakText(data.response);
            } else {
                throw new Error('Voice processing failed');
            }
        } catch (error) {
            console.error('Voice processing error:', error);
            const errorMessage = 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.';

            const errorSession: VoiceSession = {
                id: Date.now().toString(),
                transcript: currentTranscript,
                response: errorMessage,
                timestamp: new Date(),
                duration: 0
            };

            setVoiceSessions(prev => [errorSession, ...prev]);
            speakText(errorMessage);
        } finally {
            setIsProcessing(false);
            setCurrentTranscript('');
        }
    };

    const speakText = (text: string) => {
        if (synthRef.current) {
            // Cancel any ongoing speech
            synthRef.current.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = selectedLanguage;
            utterance.volume = voiceVolume;
            utterance.rate = speechRate;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            synthRef.current.speak(utterance);
        }
    };

    const stopSpeaking = () => {
        if (synthRef.current) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    };

    const executeQuickCommand = (command: string) => {
        setCurrentTranscript(command);
        setTimeout(() => {
            processVoiceCommand();
        }, 500);
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
                <title>Voice Assistant - Smart Cooking AI</title>
                <meta name="description" content="Trợ lý giọng nói thông minh cho nấu ăn - Smart Cooking AI" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Header />

                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Voice Control Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${isListening
                                    ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse scale-110'
                                    : isProcessing
                                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 animate-spin'
                                        : isSpeaking
                                            ? 'bg-gradient-to-r from-green-500 to-blue-500 animate-bounce'
                                            : 'bg-gradient-to-r from-orange-500 to-red-500'
                                }`}>
                                {isListening ? (
                                    <Mic className="h-16 w-16 text-white" />
                                ) : isProcessing ? (
                                    <RotateCcw className="h-16 w-16 text-white" />
                                ) : isSpeaking ? (
                                    <Volume2 className="h-16 w-16 text-white" />
                                ) : (
                                    <Headphones className="h-16 w-16 text-white" />
                                )}
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Voice Assistant 🎤
                        </h1>

                        <div className="text-lg text-gray-600 mb-4">
                            {isListening && (
                                <p className="text-red-500 animate-pulse">🔴 Đang nghe...</p>
                            )}
                            {isProcessing && (
                                <p className="text-yellow-500">⚡ Đang xử lý...</p>
                            )}
                            {isSpeaking && (
                                <p className="text-green-500">🔊 Đang phát âm...</p>
                            )}
                            {!isListening && !isProcessing && !isSpeaking && (
                                <p>Nhấn và giữ để nói với AI</p>
                            )}
                        </div>

                        {currentTranscript && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <p className="text-blue-800 font-medium">"{currentTranscript}"</p>
                            </div>
                        )}
                    </div>

                    {/* Voice Controls */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                            {/* Main Control Buttons */}
                            <div className="flex items-center space-x-4">
                                <button
                                    onMouseDown={startListening}
                                    onMouseUp={stopListening}
                                    onTouchStart={startListening}
                                    onTouchEnd={stopListening}
                                    title={isListening ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
                                    className={`p-4 rounded-full transition-all duration-300 ${isListening
                                            ? 'bg-red-500 text-white scale-110'
                                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                                        }`}
                                    disabled={isProcessing}
                                >
                                    {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                                </button>

                                {isSpeaking ? (
                                    <button
                                        onClick={stopSpeaking}
                                        title="Dừng phát âm"
                                        className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
                                    >
                                        <VolumeX className="h-6 w-6" />
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        title="Không có âm thanh đang phát"
                                        className="p-4 rounded-full bg-gray-300 text-gray-500 cursor-not-allowed"
                                    >
                                        <Volume2 className="h-6 w-6" />
                                    </button>
                                )}
                            </div>

                            {/* Language Selector */}
                            <div className="flex items-center space-x-4">
                                <Languages className="h-5 w-5 text-gray-500" />
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    title="Chọn ngôn ngữ"
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                >
                                    {languages.map(lang => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.flag} {lang.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Volume Controls */}
                            <div className="flex items-center space-x-4">
                                <Volume2 className="h-5 w-5 text-gray-500" />
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={voiceVolume}
                                    onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                                    title="Điều chỉnh âm lượng"
                                    className="w-20"
                                />
                                <span className="text-sm text-gray-500 w-8">{Math.round(voiceVolume * 100)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Commands */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Lệnh nhanh</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {quickCommands.map((cmd, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50 transition-colors cursor-pointer"
                                    onClick={() => executeQuickCommand(cmd.command)}
                                >
                                    <h3 className="font-semibold text-gray-900 mb-2">{cmd.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{cmd.example}</p>
                                    <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                                        Thực hiện →
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Voice Sessions History */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Lịch sử trò chuyện</h2>

                        {voiceSessions.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Headphones className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>Chưa có cuộc trò chuyện nào</p>
                                <p className="text-sm">Bắt đầu nói để tạo cuộc trò chuyện đầu tiên</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {voiceSessions.map((session) => (
                                    <div key={session.id} className="border-l-4 border-orange-500 pl-4 py-2">
                                        <div className="flex items-start justify-between mb-2">
                                            <p className="text-sm text-gray-500">{formatTime(session.timestamp)}</p>
                                            <button
                                                onClick={() => speakText(session.response)}
                                                className="text-orange-600 hover:text-orange-700 p-1"
                                                title="Phát lại"
                                            >
                                                <Play className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="mb-3">
                                            <p className="text-sm font-medium text-gray-700 mb-1">Bạn nói:</p>
                                            <p className="text-gray-900 bg-blue-50 rounded-lg p-3">"{session.transcript}"</p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-1">AI trả lời:</p>
                                            <p className="text-gray-900 bg-orange-50 rounded-lg p-3">{session.response}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const session = await getSession(context);

    return {
        props: {
            session,
        },
    };
};

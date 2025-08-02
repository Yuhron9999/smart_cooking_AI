// Pages - Voice Assistant Page
import React, { useState, useEffect, useRef } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Mic, MicOff, Volume2, VolumeX, Play, Pause, RotateCcw, Settings } from 'lucide-react';
import Header from '@/components/layout/Header';

interface VoiceCommand {
    id: string;
    text: string;
    timestamp: Date;
    response: string;
    isPlaying?: boolean;
}

const VoiceAssistantPage: NextPage = () => {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isEnabled, setIsEnabled] = useState(true);
    const [currentText, setCurrentText] = useState('');
    const [commands, setCommands] = useState<VoiceCommand[]>([]);
    const [language, setLanguage] = useState('vi-VN');
    const [voiceSpeed, setVoiceSpeed] = useState(1);
    const [showSettings, setShowSettings] = useState(false);

    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<any>(null);

    useEffect(() => {
        // Check if browser supports speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();

            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = language;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setCurrentText(transcript);

                if (event.results[0].isFinal) {
                    handleVoiceCommand(transcript);
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        // Initialize speech synthesis
        if ('speechSynthesis' in window) {
            synthRef.current = window.speechSynthesis;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (synthRef.current) {
                synthRef.current.cancel();
            }
        };
    }, [language]);

    const handleVoiceCommand = async (text: string) => {
        const response = generateResponse(text);

        const command: VoiceCommand = {
            id: Date.now().toString(),
            text,
            timestamp: new Date(),
            response
        };

        setCommands(prev => [command, ...prev]);

        // Speak the response
        if (isEnabled && synthRef.current) {
            speakText(response);
        }
    };

    const generateResponse = (command: string): string => {
        const lowerCommand = command.toLowerCase();

        if (lowerCommand.includes('công thức') || lowerCommand.includes('nấu')) {
            return 'Tôi có thể giúp bạn tạo công thức nấu ăn. Bạn có thể nói "tạo công thức với gà và rau củ" hoặc "hướng dẫn nấu phở bò".';
        }

        if (lowerCommand.includes('nguyên liệu')) {
            return 'Hãy cho tôi biết những nguyên liệu bạn có, tôi sẽ gợi ý món ăn phù hợp. Ví dụ: "Tôi có thịt heo, khoai tây và cà rót".';
        }

        if (lowerCommand.includes('dinh dưỡng') || lowerCommand.includes('calo')) {
            return 'Tôi có thể phân tích dinh dưỡng cho món ăn. Hãy nói tên món ăn và khẩu phần, ví dụ: "Phân tích dinh dưỡng một bát phở bò".';
        }

        if (lowerCommand.includes('kỹ thuật') || lowerCommand.includes('hướng dẫn')) {
            return 'Tôi có thể hướng dẫn các kỹ thuật nấu ăn. Bạn muốn học kỹ thuật nào? Ví dụ: "Hướng dẫn cách xào rau" hoặc "Kỹ thuật nướng thịt".';
        }

        if (lowerCommand.includes('chào') || lowerCommand.includes('xin chào')) {
            return 'Xin chào! Tôi là trợ lý giọng nói Smart Cooking. Tôi có thể giúp bạn về nấu ăn, công thức và kỹ thuật nấu ăn. Bạn cần hỗ trợ gì?';
        }

        return `Tôi đã nghe: "${command}". Tôi có thể giúp bạn tạo công thức, hướng dẫn nấu ăn, phân tích dinh dưỡng hoặc tư vấn kỹ thuật nấu ăn. Bạn muốn tôi giúp gì?`;
    };

    const speakText = (text: string) => {
        if (!synthRef.current) return;

        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = voiceSpeed;
        utterance.pitch = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        synthRef.current.speak(utterance);
    };

    const startListening = () => {
        if (!recognitionRef.current || isListening) return;

        setCurrentText('');
        setIsListening(true);
        recognitionRef.current.start();
    };

    const stopListening = () => {
        if (!recognitionRef.current || !isListening) return;

        recognitionRef.current.stop();
        setIsListening(false);
    };

    const stopSpeaking = () => {
        if (synthRef.current) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    };

    const playResponse = (commandId: string, text: string) => {
        // Stop current speech
        if (synthRef.current) {
            synthRef.current.cancel();
        }

        // Update playing state
        setCommands(prev => prev.map(cmd => ({
            ...cmd,
            isPlaying: cmd.id === commandId
        })));

        speakText(text);

        // Reset playing state after speech
        setTimeout(() => {
            setCommands(prev => prev.map(cmd => ({
                ...cmd,
                isPlaying: false
            })));
        }, text.length * 50); // Rough estimate of speech duration
    };

    const clearHistory = () => {
        setCommands([]);
        setCurrentText('');
        if (synthRef.current) {
            synthRef.current.cancel();
        }
    };

    const quickCommands = [
        {
            text: "Tạo công thức với nguyên liệu có sẵn",
            command: "Tạo công thức với nguyên liệu tôi có"
        },
        {
            text: "Hướng dẫn kỹ thuật nấu ăn cơ bản",
            command: "Hướng dẫn kỹ thuật nấu ăn cơ bản"
        },
        {
            text: "Phân tích dinh dưỡng món ăn",
            command: "Phân tích dinh dưỡng món phở bò"
        },
        {
            text: "Gợi ý món ăn hôm nay",
            command: "Gợi ý món ăn cho bữa tối hôm nay"
        }
    ];

    return (
        <>
            <Head>
                <title>Trợ lý Giọng nói - Smart Cooking AI</title>
                <meta name="description" content="Trợ lý giọng nói thông minh cho nấu ăn - điều khiển bằng giọng nói" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Header />

                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                            <Mic className="h-8 w-8 mr-3 text-orange-500" />
                            Trợ lý Giọng nói
                        </h1>
                        <p className="text-gray-600">
                            Nói chuyện với AI về nấu ăn - Nhấn nút mic và bắt đầu nói
                        </p>
                    </div>

                    {/* Voice Controls */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                        <div className="text-center">
                            {/* Main Voice Button */}
                            <div className="mb-6">
                                <button
                                    onClick={isListening ? stopListening : startListening}
                                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isListening
                                            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                                            : 'bg-orange-500 hover:bg-orange-600'
                                        }`}
                                    disabled={!isEnabled}
                                    title={isListening ? 'Nhấn để dừng nghe' : 'Nhấn để bắt đầu nói'}
                                >
                                    {isListening ? (
                                        <MicOff className="h-10 w-10 text-white" />
                                    ) : (
                                        <Mic className="h-10 w-10 text-white" />
                                    )}
                                </button>
                            </div>

                            {/* Status Text */}
                            <div className="mb-6">
                                {isListening && (
                                    <div className="text-lg text-gray-700 mb-2">
                                        🎤 Đang nghe...
                                    </div>
                                )}
                                {isSpeaking && (
                                    <div className="text-lg text-blue-600 mb-2">
                                        🔊 Đang phát âm...
                                    </div>
                                )}
                                {currentText && (
                                    <div className="bg-gray-50 rounded-lg p-3 max-w-md mx-auto">
                                        <p className="text-gray-700 italic">&quot;{currentText}&quot;</p>
                                    </div>
                                )}
                                {!isListening && !isSpeaking && !currentText && (
                                    <p className="text-gray-500">
                                        Nhấn nút mic và nói câu lệnh của bạn
                                    </p>
                                )}
                            </div>

                            {/* Control Buttons */}
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => setIsEnabled(!isEnabled)}
                                    className={`p-3 rounded-lg transition-colors ${isEnabled
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                        }`}
                                    title={isEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
                                >
                                    {isEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                                </button>

                                {isSpeaking && (
                                    <button
                                        onClick={stopSpeaking}
                                        className="p-3 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                                        title="Dừng phát âm"
                                    >
                                        <Pause className="h-5 w-5" />
                                    </button>
                                )}

                                <button
                                    onClick={clearHistory}
                                    className="p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                    title="Xóa lịch sử"
                                >
                                    <RotateCcw className="h-5 w-5" />
                                </button>

                                <button
                                    onClick={() => setShowSettings(!showSettings)}
                                    className="p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                    title="Cài đặt"
                                >
                                    <Settings className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Settings Panel */}
                    {showSettings && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ngôn ngữ nhận dạng
                                    </label>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        aria-label="Chọn ngôn ngữ nhận dạng giọng nói"
                                    >
                                        <option value="vi-VN">Tiếng Việt</option>
                                        <option value="en-US">English</option>
                                        <option value="ja-JP">日本語</option>
                                        <option value="ko-KR">한국어</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tốc độ giọng nói: {voiceSpeed}x
                                    </label>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="2"
                                        step="0.1"
                                        value={voiceSpeed}
                                        onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                                        className="w-full"
                                        aria-label="Điều chỉnh tốc độ giọng nói"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Commands */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Câu lệnh nhanh</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {quickCommands.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleVoiceCommand(item.command)}
                                    className="text-left p-3 bg-gray-50 rounded-lg hover:bg-orange-50 hover:border-orange-200 border border-gray-200 transition-colors"
                                >
                                    <div className="font-medium text-gray-900">{item.text}</div>
                                    <div className="text-sm text-gray-500 mt-1">&quot;{item.command}&quot;</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Command History */}
                    {commands.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Lịch sử hội thoại</h3>
                                <span className="text-sm text-gray-500">{commands.length} lệnh</span>
                            </div>

                            <div className="space-y-4">
                                {commands.map((command) => (
                                    <div key={command.id} className="border-l-4 border-orange-200 pl-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 mb-1">
                                                    🎤 &quot;{command.text}&quot;
                                                </div>
                                                <div className="text-gray-700 bg-gray-50 rounded p-2">
                                                    🤖 {command.response}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 ml-4">
                                                <button
                                                    onClick={() => playResponse(command.id, command.response)}
                                                    className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                                                    title="Phát lại phản hồi"
                                                >
                                                    {command.isPlaying ? (
                                                        <Pause className="h-4 w-4" />
                                                    ) : (
                                                        <Play className="h-4 w-4" />
                                                    )}
                                                </button>
                                                <span className="text-xs text-gray-400">
                                                    {command.timestamp.toLocaleTimeString('vi-VN')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Browser Support Check */}
                    {'webkitSpeechRecognition' in window || 'SpeechRecognition' in window ? null : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                            <p className="text-yellow-800">
                                Trình duyệt của bạn chưa hỗ trợ nhận dạng giọng nói.
                                Vui lòng sử dụng Chrome, Edge hoặc Safari để có trải nghiệm tốt nhất.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default VoiceAssistantPage;

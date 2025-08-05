import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Bot,
  User,
  ChefHat,
  Sparkles,
  Settings,
  Languages,
  Zap,
  Headphones,
  MessageCircle,
  Command
} from 'lucide-react';

interface VoiceCommand {
  id: string;
  text: string;
  response: string;
  timestamp: Date;
  duration?: number;
}

interface VoiceSettings {
  language: 'vi' | 'en';
  voiceSpeed: number;
  voicePitch: number;
  autoSpeak: boolean;
  wakeWord: boolean;
}

export default function VoiceAssistantPage() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [voiceHistory, setVoiceHistory] = useState<VoiceCommand[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [settings, setSettings] = useState<VoiceSettings>({
    language: 'vi',
    voiceSpeed: 1.0,
    voicePitch: 1.0,
    autoSpeak: true,
    wakeWord: false
  });
  const [showSettings, setShowSettings] = useState(false);

  const recordingTimer = useRef<NodeJS.Timeout>();
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  const recognition = useRef<any>(null);

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== 'undefined') {
      speechSynthesis.current = window.speechSynthesis;
    }

    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = settings.language === 'vi' ? 'vi-VN' : 'en-US';

      recognition.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentText(transcript);
      };

      recognition.current.onend = () => {
        if (isListening) {
          processVoiceCommand(currentText);
        }
      };
    }

    return () => {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    };
  }, [settings.language, isListening, currentText]);

  const generateCommandId = () => Math.random().toString(36).substr(2, 9);

  const startListening = () => {
    if (!recognition.current) {
      alert('Trình duyệt không hỗ trợ nhận dạng giọng nói');
      return;
    }

    setIsListening(true);
    setIsRecording(true);
    setCurrentText('');
    setRecordingDuration(0);

    recognition.current.start();

    // Start recording timer
    recordingTimer.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
  };

  const stopListening = () => {
    setIsListening(false);
    setIsRecording(false);

    if (recognition.current) {
      recognition.current.stop();
    }

    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
    }
  };

  const processVoiceCommand = async (command: string) => {
    if (!command.trim()) return;

    const commandObj: VoiceCommand = {
      id: generateCommandId(),
      text: command,
      response: '',
      timestamp: new Date(),
      duration: recordingDuration
    };

    // Generate AI response based on command
    let response = '';
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('công thức') || lowerCommand.includes('nấu')) {
      response = 'Tôi sẽ giúp bạn tìm công thức nấu ăn. Bạn muốn nấu món gì?';
    } else if (lowerCommand.includes('nguyên liệu')) {
      response = 'Hãy cho tôi biết bạn có những nguyên liệu gì, tôi sẽ gợi ý món ăn phù hợp.';
    } else if (lowerCommand.includes('calo') || lowerCommand.includes('dinh dưỡng')) {
      response = 'Tôi có thể phân tích dinh dưỡng cho bạn. Bạn muốn biết về món ăn nào?';
    } else if (lowerCommand.includes('giảm cân')) {
      response = 'Tôi sẽ gợi ý những món ăn ít calo và tốt cho việc giảm cân.';
    } else if (lowerCommand.includes('chào') || lowerCommand.includes('hello')) {
      response = 'Xin chào! Tôi là trợ lý nấu ăn thông minh. Tôi có thể giúp gì cho bạn?';
    } else {
      response = `Tôi hiểu bạn nói về "${command}". Bạn có thể hỏi tôi về công thức nấu ăn, nguyên liệu, hoặc dinh dưỡng.`;
    }

    commandObj.response = response;
    setVoiceHistory(prev => [commandObj, ...prev]);

    // Auto speak response if enabled
    if (settings.autoSpeak) {
      speakText(response);
    }

    setCurrentText('');
    setRecordingDuration(0);
  };

  const speakText = (text: string) => {
    if (!speechSynthesis.current) return;

    // Stop any current speech
    speechSynthesis.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = settings.language === 'vi' ? 'vi-VN' : 'en-US';
    utterance.rate = settings.voiceSpeed;
    utterance.pitch = settings.voicePitch;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel();
      setIsSpeaking(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const quickCommands = [
    'Tạo công thức từ tôm và rau',
    'Món ăn giảm cân',
    'Cách nấu phở bò',
    'Phân tích dinh dưỡng cơm tấm',
    'Món chay cho gia đình'
  ];

  return (
    <div className="page-container min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Head>
        <title>Voice Assistant - Smart Cooking AI</title>
        <meta name="description" content="Trợ lý giọng nói thông minh cho nấu ăn" />
      </Head>

      {/* Header */}
      <nav className="navbar bg-white/80 backdrop-blur-sm border-b">
        <div className="container-modern">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-purple-500 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Về trang chủ</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Headphones className="w-6 h-6 text-purple-500" />
                <span className="text-xl font-bold gradient-text">Voice Assistant</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="btn-outline"
              >
                <Settings className="w-4 h-4 mr-2" />
                Cài đặt
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-4">
        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-lg shadow-lg border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Cài đặt Voice Assistant
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Language Setting */}
              <div>
                <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-2">
                  <Languages className="w-4 h-4 inline mr-1" />
                  Ngôn ngữ
                </label>
                <select
                  id="language-select"
                  value={settings.language}
                  onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value as 'vi' | 'en' }))}
                  className="input-field"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Voice Speed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tốc độ giọng nói: {settings.voiceSpeed}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.voiceSpeed}
                  onChange={(e) => setSettings(prev => ({ ...prev, voiceSpeed: parseFloat(e.target.value) }))}
                  className="w-full"
                  title="Điều chỉnh tốc độ giọng nói"
                  placeholder="Điều chỉnh tốc độ giọng nói"
                />
              </div>

              {/* Voice Pitch */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Độ cao giọng nói: {settings.voicePitch}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.voicePitch}
                  onChange={(e) => setSettings(prev => ({ ...prev, voicePitch: parseFloat(e.target.value) }))}
                  className="w-full"
                  title="Điều chỉnh độ cao giọng nói"
                  placeholder="Điều chỉnh độ cao giọng nói"
                />
              </div>

              {/* Auto Speak */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.autoSpeak}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoSpeak: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Tự động đọc phản hồi</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Main Voice Interface */}
        <div className="bg-white rounded-2xl shadow-xl border overflow-hidden mb-6">
          {/* Voice Visualizer */}
          <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 p-8 text-white text-center">
            <div className="relative">
              {/* Central Microphone */}
              <div className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${isListening
                  ? 'bg-white/20 animate-pulse shadow-lg'
                  : 'bg-white/10 hover:bg-white/20'
                }`}>
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isListening
                      ? 'bg-red-500 hover:bg-red-600 shadow-lg'
                      : 'bg-white/20 hover:bg-white/30'
                    }`}
                >
                  {isListening ? (
                    <MicOff className="w-8 h-8" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </button>
              </div>

              {/* Audio Waves Animation */}
              {isListening && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-white/50 animate-bounce rounded-full"
                        style={{
                          height: '20px',
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: '0.6s'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-2">
              <h2 className="text-2xl font-bold">
                {isListening ? '🎤 Đang nghe...' : '🎙️ Nhấn để nói'}
              </h2>

              {isRecording && (
                <p className="text-lg">
                  ⏱️ {formatDuration(recordingDuration)}
                </p>
              )}

              {currentText && (
                <div className="bg-white/10 rounded-lg p-3 mt-4">
                  <p className="text-lg">{currentText}</p>
                </div>
              )}

              {isSpeaking && (
                <div className="flex items-center justify-center space-x-2 mt-4">
                  <Volume2 className="w-5 h-5 animate-pulse" />
                  <span>Đang phát...</span>
                  <button
                    onClick={stopSpeaking}
                    className="btn-glass px-3 py-1 text-sm"
                  >
                    Dừng
                  </button>
                </div>
              )}
            </div>

            <p className="text-white/80 mt-4">
              Hãy nói về món ăn, công thức, hoặc dinh dưỡng
            </p>
          </div>

          {/* Quick Commands */}
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              Lệnh nhanh
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickCommands.map((command, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentText(command);
                    processVoiceCommand(command);
                  }}
                  className="text-left p-3 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <Command className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">{command}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Voice History */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Lịch sử tương tác ({voiceHistory.length})
            </h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {voiceHistory.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bot className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Chưa có lịch sử tương tác</p>
                <p className="text-sm">Hãy thử nói một câu lệnh</p>
              </div>
            ) : (
              <div className="divide-y">
                {voiceHistory.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="space-y-3">
                      {/* User Command */}
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-orange-100 rounded-lg p-3">
                            <p className="text-gray-800">{item.text}</p>
                          </div>
                          <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                            <span>{item.timestamp.toLocaleTimeString()}</span>
                            {item.duration && <span>• {formatDuration(item.duration)}</span>}
                          </div>
                        </div>
                      </div>

                      {/* AI Response */}
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <p className="text-gray-800 whitespace-pre-wrap">{item.response}</p>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <button
                              onClick={() => speakText(item.response)}
                              className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
                            >
                              <Volume2 className="w-3 h-3 mr-1" />
                              Phát lại
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


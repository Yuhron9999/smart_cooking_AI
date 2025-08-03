import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Header from '@/components/layout/Header_fixed';
import {
    Camera,
    Upload,
    Image as ImageIcon,
    Zap,
    Sparkles,
    CheckCircle,
    X,
    Eye,
    RefreshCw
} from 'lucide-react';

interface RecognitionResult {
    id: string;
    foodName: string;
    confidence: number;
    category: string;
    description: string;
    nutrition: {
        calories: number;
        protein: string;
        carbs: string;
        fat: string;
        fiber: string;
    };
    ingredients: string[];
    healthScore: number;
    suggestions: string[];
    timestamp: Date;
    imageUrl: string;
}

export default function FoodRecognitionPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [recognitionResults, setRecognitionResults] = useState<RecognitionResult[]>([]);
    const [currentResult, setCurrentResult] = useState<RecognitionResult | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [isCameraActive, setIsCameraActive] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const handleImageUpload = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                setSelectedImage(imageUrl);
                analyzeImage(imageUrl, file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleImageUpload(files[0]);
        }
    };

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            setIsCameraActive(true);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraActive(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0);

            const imageUrl = canvas.toDataURL('image/jpeg');
            setSelectedImage(imageUrl);
            stopCamera();

            // Convert to blob for analysis
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
                    analyzeImage(imageUrl, file);
                }
            }, 'image/jpeg');
        }
    };

    const analyzeImage = async (imageUrl: string, file: File) => {
        setIsAnalyzing(true);
        setCurrentResult(null);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/ai/food-recognition', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();

                const result: RecognitionResult = {
                    id: Date.now().toString(),
                    foodName: data.foodName || 'Món ăn không xác định',
                    confidence: data.confidence || 0.85,
                    category: data.category || 'Khác',
                    description: data.description || 'Không có mô tả',
                    nutrition: data.nutrition || {
                        calories: 0,
                        protein: '0g',
                        carbs: '0g',
                        fat: '0g',
                        fiber: '0g'
                    },
                    ingredients: data.ingredients || [],
                    healthScore: data.healthScore || 7.5,
                    suggestions: data.suggestions || [],
                    timestamp: new Date(),
                    imageUrl: imageUrl
                };

                setCurrentResult(result);
                setRecognitionResults(prev => [result, ...prev]);
            } else {
                throw new Error('Food recognition failed');
            }
        } catch (error) {
            console.error('Recognition error:', error);

            // Mock result for demo
            const mockResult: RecognitionResult = {
                id: Date.now().toString(),
                foodName: 'Phở Bò',
                confidence: 0.92,
                category: 'Món Việt',
                description: 'Món phở truyền thống với nước dùng trong vắt và thịt bò tươi ngon.',
                nutrition: {
                    calories: 450,
                    protein: '25g',
                    carbs: '45g',
                    fat: '15g',
                    fiber: '3g'
                },
                ingredients: ['Bánh phở', 'Thịt bò', 'Hành lá', 'Ngò gai', 'Nước dùng'],
                healthScore: 8.5,
                suggestions: [
                    'Thêm rau sống để tăng vitamin',
                    'Kiểm soát lượng muối trong nước dùng',
                    'Kết hợp với trà xanh để hỗ trợ tiêu hóa'
                ],
                timestamp: new Date(),
                imageUrl: imageUrl
            };

            setCurrentResult(mockResult);
            setRecognitionResults(prev => [mockResult, ...prev]);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getHealthScoreColor = (score: number) => {
        if (score >= 8) return 'text-green-600 bg-green-100';
        if (score >= 6) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.8) return 'text-green-600';
        if (confidence >= 0.6) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <>
            <Head>
                <title>Food Recognition - Smart Cooking AI</title>
                <meta name="description" content="Nhận dạng món ăn thông minh với AI - Smart Cooking AI" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Header />

                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                                <Camera className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Food Recognition 📸
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Nhận dạng món ăn và phân tích dinh dưỡng thông minh với AI
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Upload Section */}
                        <div className="space-y-6">
                            {/* Image Upload Area */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Tải ảnh món ăn</h2>

                                <div
                                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragOver
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    {selectedImage ? (
                                        <div className="space-y-4">
                                            <Image
                                                src={selectedImage}
                                                alt="Selected food"
                                                width={400}
                                                height={300}
                                                className="max-w-full max-h-64 mx-auto rounded-lg shadow-md object-contain"
                                            />
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => setSelectedImage(null)}
                                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                                                >
                                                    <X className="h-4 w-4" />
                                                    <span>Xóa ảnh</span>
                                                </button>
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                                                >
                                                    <RefreshCw className="h-4 w-4" />
                                                    <span>Chọn ảnh khác</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto" />
                                            <div>
                                                <p className="text-lg font-medium text-gray-900 mb-2">
                                                    Kéo thả ảnh vào đây hoặc click để chọn
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Hỗ trợ JPG, PNG (tối đa 10MB)
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 mx-auto"
                                            >
                                                <Upload className="h-5 w-5" />
                                                <span>Chọn ảnh</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    title="Chọn ảnh món ăn"
                                    placeholder="Chọn ảnh món ăn"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleImageUpload(file);
                                    }}
                                    className="hidden"
                                />
                            </div>

                            {/* Camera Section */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Chụp ảnh trực tiếp</h2>

                                {!isCameraActive ? (
                                    <div className="text-center">
                                        <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-4">Sử dụng camera để chụp ảnh món ăn</p>
                                        <button
                                            onClick={startCamera}
                                            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex items-center space-x-2 mx-auto"
                                        >
                                            <Camera className="h-5 w-5" />
                                            <span>Bật camera</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            className="w-full rounded-lg"
                                        />
                                        <div className="flex justify-center space-x-4">
                                            <button
                                                onClick={capturePhoto}
                                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                                            >
                                                <Camera className="h-4 w-4" />
                                                <span>Chụp ảnh</span>
                                            </button>
                                            <button
                                                onClick={stopCamera}
                                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                                            >
                                                <X className="h-4 w-4" />
                                                <span>Tắt camera</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <canvas ref={canvasRef} className="hidden" />
                            </div>
                        </div>

                        {/* Results Section */}
                        <div className="space-y-6">
                            {/* Analysis Status */}
                            {isAnalyzing && (
                                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                                    <div className="animate-spin mx-auto mb-4">
                                        <Zap className="h-12 w-12 text-blue-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Đang phân tích hình ảnh...
                                    </h3>
                                    <p className="text-gray-600">AI đang nhận dạng món ăn và phân tích dinh dưỡng</p>
                                    <div className="mt-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full animate-pulse w-3/5"></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Current Result */}
                            {currentResult && !isAnalyzing && (
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-gray-900">Kết quả nhận dạng</h3>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <span className={`text-sm font-medium ${getConfidenceColor(currentResult.confidence)}`}>
                                                {Math.round(currentResult.confidence * 100)}% độ tin cậy
                                            </span>
                                        </div>
                                    </div>

                                    {/* Food Info */}
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-2xl font-bold text-gray-900 mb-2">
                                                {currentResult.foodName}
                                            </h4>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    {currentResult.category}
                                                </span>
                                                <span className={`px-2 py-1 rounded ${getHealthScoreColor(currentResult.healthScore)}`}>
                                                    ⭐ {currentResult.healthScore}/10 điểm sức khỏe
                                                </span>
                                            </div>
                                            <p className="text-gray-700">{currentResult.description}</p>
                                        </div>

                                        {/* Nutrition Info */}
                                        <div>
                                            <h5 className="font-semibold text-gray-900 mb-3">Thông tin dinh dưỡng</h5>
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                <div className="text-center p-3 bg-orange-50 rounded-lg">
                                                    <div className="text-xl font-bold text-orange-600">{currentResult.nutrition.calories}</div>
                                                    <div className="text-xs text-gray-600">calories</div>
                                                </div>
                                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                    <div className="text-xl font-bold text-blue-600">{currentResult.nutrition.protein}</div>
                                                    <div className="text-xs text-gray-600">protein</div>
                                                </div>
                                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                                    <div className="text-xl font-bold text-green-600">{currentResult.nutrition.carbs}</div>
                                                    <div className="text-xs text-gray-600">carbs</div>
                                                </div>
                                                <div className="text-center p-3 bg-purple-50 rounded-lg">
                                                    <div className="text-xl font-bold text-purple-600">{currentResult.nutrition.fat}</div>
                                                    <div className="text-xs text-gray-600">fat</div>
                                                </div>
                                                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                                    <div className="text-xl font-bold text-yellow-600">{currentResult.nutrition.fiber}</div>
                                                    <div className="text-xs text-gray-600">fiber</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ingredients */}
                                        {currentResult.ingredients.length > 0 && (
                                            <div>
                                                <h5 className="font-semibold text-gray-900 mb-3">Nguyên liệu chính</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {currentResult.ingredients.map((ingredient, index) => (
                                                        <span
                                                            key={index}
                                                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                                        >
                                                            {ingredient}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Health Suggestions */}
                                        {currentResult.suggestions.length > 0 && (
                                            <div>
                                                <h5 className="font-semibold text-gray-900 mb-3">Gợi ý sức khỏe</h5>
                                                <ul className="space-y-2">
                                                    {currentResult.suggestions.map((suggestion, index) => (
                                                        <li key={index} className="flex items-start space-x-2">
                                                            <Sparkles className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                                            <span className="text-sm text-gray-700">{suggestion}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Previous Results */}
                            {recognitionResults.length > 1 && (
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Lịch sử nhận dạng</h3>
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {recognitionResults.slice(1).map((result) => (
                                            <div
                                                key={result.id}
                                                className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                                onClick={() => setCurrentResult(result)}
                                            >
                                                <Image
                                                    src={result.imageUrl}
                                                    alt={result.foodName}
                                                    width={64}
                                                    height={64}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">{result.foodName}</h4>
                                                    <p className="text-sm text-gray-600">{result.category}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {result.timestamp.toLocaleTimeString('vi-VN')}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                                                        {Math.round(result.confidence * 100)}%
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {result.nutrition.calories} cal
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Results */}
                            {!isAnalyzing && recognitionResults.length === 0 && (
                                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                                    <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Chưa có kết quả nhận dạng
                                    </h3>
                                    <p className="text-gray-600">
                                        Tải lên hoặc chụp ảnh món ăn để bắt đầu phân tích
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const session = await getSession(context);

    return {
        props: {
            session,
        },
    };
};

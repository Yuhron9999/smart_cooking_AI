import React, { useState, useRef } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Header from '@/components/layout/Header';
import {
    Camera,
    Upload,
    X,
    Zap,
    Eye,
    Clock,
    Star,
    ChefHat,
    Utensils,
    Info
} from 'lucide-react';

interface RecognitionResult {
    id: string;
    dishName: string;
    confidence: number;
    description: string;
    ingredients: string[];
    recipe?: {
        title: string;
        cookingTime: string;
        difficulty: string;
        steps: string[];
    };
    nutrition?: {
        calories: number;
        protein: string;
        carbs: string;
        fat: string;
    };
    timestamp: Date;
}

export default function FoodRecognitionPage() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [recognitionResults, setRecognitionResults] = useState<RecognitionResult[]>([]);
    const [currentResult, setCurrentResult] = useState<RecognitionResult | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
                setCurrentResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
                setCurrentResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
            }
        } catch (error) {
            console.error('Camera access error:', error);
            alert('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
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
            if (ctx) {
                ctx.drawImage(video, 0, 0);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
                        setSelectedImage(file);
                        setImagePreview(canvas.toDataURL());
                        stopCamera();
                    }
                }, 'image/jpeg', 0.9);
            }
        }
    };

    const analyzeImage = async () => {
        if (!selectedImage) return;

        setIsAnalyzing(true);
        setCurrentResult(null);

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const response = await fetch('/api/ai/food-recognition', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();

                const result: RecognitionResult = {
                    id: Date.now().toString(),
                    dishName: data.dish_name || 'Không xác định',
                    confidence: data.confidence || 0,
                    description: data.description || 'Không có mô tả',
                    ingredients: data.ingredients || [],
                    recipe: data.recipe,
                    nutrition: data.nutrition,
                    timestamp: new Date()
                };

                setCurrentResult(result);
                setRecognitionResults(prev => [result, ...prev]);
            } else {
                throw new Error('Recognition failed');
            }
        } catch (error) {
            console.error('Food recognition error:', error);

            // Mock result for demo
            const mockResult: RecognitionResult = {
                id: Date.now().toString(),
                dishName: 'Phở Bò',
                confidence: 85.6,
                description: 'Món phở bò truyền thống Việt Nam với nước dùng trong, thịt bò tái và các loại rau thơm.',
                ingredients: ['Bánh phở', 'Thịt bò', 'Hành lá', 'Ngò gai', 'Giá đỗ', 'Nước dùng xương'],
                recipe: {
                    title: 'Cách nấu Phở Bò',
                    cookingTime: '3 giờ',
                    difficulty: 'Trung bình',
                    steps: [
                        'Ninh xương bò với gia vị trong 2-3 giờ',
                        'Chuẩn bị bánh phở, thái thịt bò mỏng',
                        'Trần bánh phở, cho vào t그릇',
                        'Đổ nước dùng nóng, thêm thịt bò và rau thơm'
                    ]
                },
                nutrition: {
                    calories: 350,
                    protein: '25g',
                    carbs: '45g',
                    fat: '8g'
                },
                timestamp: new Date()
            };

            setCurrentResult(mockResult);
            setRecognitionResults(prev => [mockResult, ...prev]);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setCurrentResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <Head>
                <title>Food Recognition - Smart Cooking AI</title>
                <meta name="description" content="Nhận dạng món ăn thông qua hình ảnh với AI - Smart Cooking AI" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Header />

                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                                <Eye className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Food Recognition 📸
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Chụp ảnh hoặc tải lên hình ảnh món ăn để AI nhận dạng và cung cấp thông tin chi tiết
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Image Upload & Camera */}
                        <div className="space-y-6">
                            {/* Image Upload Area */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Tải ảnh lên</h2>

                                {!imagePreview ? (
                                    <div
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition-colors cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-lg font-medium text-gray-700 mb-2">
                                            Kéo thả ảnh vào đây hoặc click để chọn
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Hỗ trợ JPG, PNG, WebP (tối đa 10MB)
                                        </p>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-64 object-cover rounded-xl"
                                        />
                                        <button
                                            onClick={clearImage}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            title="Xóa ảnh"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    title="Chọn ảnh món ăn để nhận dạng"
                                    placeholder="Chọn ảnh món ăn"
                                />

                                {imagePreview && (
                                    <button
                                        onClick={analyzeImage}
                                        disabled={isAnalyzing}
                                        className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Zap className="h-5 w-5 animate-spin" />
                                                <span>Đang phân tích...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="h-5 w-5" />
                                                <span>Nhận dạng món ăn</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Camera Section */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Chụp ảnh trực tiếp</h2>

                                {!isCameraActive ? (
                                    <div className="text-center">
                                        <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <button
                                            onClick={startCamera}
                                            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center space-x-2 mx-auto"
                                        >
                                            <Camera className="h-5 w-5" />
                                            <span>Mở camera</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                className="w-full h-64 object-cover rounded-xl bg-black"
                                            />
                                        </div>

                                        <div className="flex justify-center space-x-4">
                                            <button
                                                onClick={capturePhoto}
                                                className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center space-x-2"
                                            >
                                                <Camera className="h-4 w-4" />
                                                <span>Chụp ảnh</span>
                                            </button>

                                            <button
                                                onClick={stopCamera}
                                                className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
                                            >
                                                <X className="h-4 w-4" />
                                                <span>Đóng camera</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <canvas ref={canvasRef} className="hidden" />
                            </div>
                        </div>

                        {/* Right Column - Results */}
                        <div className="space-y-6">
                            {/* Current Result */}
                            {currentResult && (
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-gray-900">Kết quả nhận dạng</h2>
                                        <div className="flex items-center space-x-2 text-green-600">
                                            <Zap className="h-4 w-4" />
                                            <span className="text-sm font-medium">{currentResult.confidence.toFixed(1)}%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Dish Name */}
                                        <div>
                                            <h3 className="text-2xl font-bold text-orange-600 mb-2">{currentResult.dishName}</h3>
                                            <p className="text-gray-600">{currentResult.description}</p>
                                        </div>

                                        {/* Ingredients */}
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                                <Utensils className="h-4 w-4 mr-2" />
                                                Nguyên liệu chính
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {currentResult.ingredients.map((ingredient, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                                                    >
                                                        {ingredient}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Nutrition */}
                                        {currentResult.nutrition && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                                    <Info className="h-4 w-4 mr-2" />
                                                    Dinh dưỡng (1 phần)
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <p className="font-medium">Calo</p>
                                                        <p className="text-orange-600 font-bold">{currentResult.nutrition.calories}</p>
                                                    </div>
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <p className="font-medium">Protein</p>
                                                        <p className="text-blue-600 font-bold">{currentResult.nutrition.protein}</p>
                                                    </div>
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <p className="font-medium">Carbs</p>
                                                        <p className="text-green-600 font-bold">{currentResult.nutrition.carbs}</p>
                                                    </div>
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <p className="font-medium">Fat</p>
                                                        <p className="text-yellow-600 font-bold">{currentResult.nutrition.fat}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Recipe */}
                                        {currentResult.recipe && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                                    <ChefHat className="h-4 w-4 mr-2" />
                                                    Công thức nấu
                                                </h4>

                                                <div className="bg-orange-50 p-4 rounded-lg">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h5 className="font-medium text-gray-900">{currentResult.recipe.title}</h5>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                            <span className="flex items-center">
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                {currentResult.recipe.cookingTime}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <Star className="h-3 w-3 mr-1" />
                                                                {currentResult.recipe.difficulty}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <ol className="space-y-2 text-sm">
                                                        {currentResult.recipe.steps.map((step, index) => (
                                                            <li key={index} className="flex">
                                                                <span className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                                                                    {index + 1}
                                                                </span>
                                                                <span>{step}</span>
                                                            </li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* History */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Lịch sử nhận dạng</h2>

                                {recognitionResults.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                        <p>Chưa có kết quả nhận dạng</p>
                                        <p className="text-sm">Tải ảnh lên để bắt đầu nhận dạng món ăn</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {recognitionResults.slice(0, 5).map((result) => (
                                            <div
                                                key={result.id}
                                                className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors cursor-pointer"
                                                onClick={() => setCurrentResult(result)}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-medium text-gray-900">{result.dishName}</h4>
                                                    <span className="text-xs text-gray-500">
                                                        {result.timestamp.toLocaleTimeString('vi-VN')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm text-gray-600 truncate">{result.description}</p>
                                                    <span className="text-xs text-green-600 font-medium">
                                                        {result.confidence.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
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

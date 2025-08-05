import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
    ArrowLeft,
    Camera,
    Upload,
    Eye,
    Sparkles,
    Brain,
    ChefHat,
    Timer,
    Users,
    Star,
    Utensils,
    Settings,
    ImageIcon,
    Zap,
    Trash2,
    RefreshCw,
    Download,
    Share2,
    Copy,
    Heart,
    Loader2,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { aiAPI } from '../lib/api';

interface AnalysisResult {
    id: string;
    image: string;
    dishName: string;
    confidence: number;
    ingredients: string[];
    description: string;
    recipe?: any;
    nutritionInfo?: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    culturalInfo?: string;
    timestamp: Date;
    processingTime?: number;
}

export default function ImageRecognitionPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
    const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const sampleImages = [
        { name: 'Phở bò', url: '/images/samples/pho-bo.jpg' },
        { name: 'Bánh mì', url: '/images/samples/banh-mi.jpg' },
        { name: 'Bún bò Huế', url: '/images/samples/bun-bo-hue.jpg' },
        { name: 'Bánh xèo', url: '/images/samples/banh-xeo.jpg' }
    ];

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth');
        }
    }, [status, router]);

    useEffect(() => {
        // Load previous analysis from localStorage
        const savedHistory = localStorage.getItem('image-analysis-history');
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory);
                setAnalysisHistory(parsed.map((item: any) => ({
                    ...item,
                    timestamp: new Date(item.timestamp)
                })));
            } catch (error) {
                console.error('Error loading analysis history:', error);
            }
        }
    }, []);

    const handleImageUpload = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageUpload(files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraActive(true);
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
            setCameraActive(false);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            if (context) {
                context.drawImage(video, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
                        handleImageUpload(file);
                        stopCamera();
                    }
                });
            }
        }
    };

    const analyzeImage = async () => {
        if (!selectedImage) return;

        const startTime = Date.now();
        setIsAnalyzing(true);
        setCurrentAnalysis(null);

        try {
            const response = await aiAPI.analyzeImage(selectedImage);
            const processingTime = Date.now() - startTime;

            const result: AnalysisResult = {
                id: Date.now().toString(),
                image: imagePreview,
                dishName: response.dishName || 'Món ăn không xác định',
                confidence: response.confidence || 0,
                ingredients: response.ingredients || [],
                description: response.description || 'Không có mô tả',
                recipe: response.recipe,
                nutritionInfo: response.nutritionInfo,
                culturalInfo: response.culturalInfo,
                timestamp: new Date(),
                processingTime
            };

            setCurrentAnalysis(result);

            // Add to history
            const newHistory = [result, ...analysisHistory.slice(0, 19)]; // Keep last 20 analyses
            setAnalysisHistory(newHistory);

            // Save to localStorage
            localStorage.setItem('image-analysis-history', JSON.stringify(newHistory));

        } catch (error) {
            console.error('Image analysis error:', error);
            alert('Có lỗi xảy ra khi phân tích hình ảnh. Vui lòng thử lại.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        setImagePreview('');
        setCurrentAnalysis(null);
    };

    const shareResult = async (result: AnalysisResult) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Nhận dạng món: ${result.dishName}`,
                    text: `Tôi vừa phân tích món ${result.dishName} với Smart Cooking AI!`,
                    url: window.location.href
                });
            } catch (error) {
                console.error('Share error:', error);
            }
        } else {
            // Fallback: copy to clipboard
            const text = `Món: ${result.dishName}\nNguyên liệu: ${result.ingredients.join(', ')}\nMô tả: ${result.description}`;
            navigator.clipboard.writeText(text);
            alert('Đã sao chép thông tin vào clipboard!');
        }
    };

    const downloadResult = (result: AnalysisResult) => {
        const data = {
            dishName: result.dishName,
            confidence: result.confidence,
            ingredients: result.ingredients,
            description: result.description,
            nutritionInfo: result.nutritionInfo,
            culturalInfo: result.culturalInfo,
            timestamp: result.timestamp,
            processingTime: result.processingTime
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analysis-${result.dishName}-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-600">Đang khởi động Image Recognition...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="page-container min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            <Head>
                <title>Nhận dạng hình ảnh - Smart Cooking AI</title>
                <meta name="description" content="Nhận dạng món ăn thông minh bằng AI" />
            </Head>

            {/* Header */}
            <nav className="navbar bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
                <div className="container-modern">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                                <span>Dashboard</span>
                            </Link>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                                    <Eye className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <span className="text-lg font-bold gradient-text">Image Recognition</span>
                                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                                        <Zap className="w-3 h-3 text-green-500" />
                                        <span>AI Vision</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button className="btn-outline btn-sm">
                                <Settings className="w-4 h-4 mr-2" />
                                Cài đặt
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container-modern py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Analysis Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Upload Area */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <ImageIcon className="w-5 h-5 mr-2" />
                                Tải lên hình ảnh món ăn
                            </h2>

                            {!imagePreview ? (
                                <div className="space-y-4">
                                    {/* Drag & Drop Area */}
                                    <div
                                        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${dragActive
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                                            }`}
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                    >
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Upload className="w-8 h-8 text-green-500" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            Kéo thả hình ảnh vào đây
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Hoặc nhấn để chọn file từ máy tính
                                        </p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            aria-label="Upload food image"
                                            title="Upload food image"
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="btn-primary px-6 py-3 rounded-xl"
                                        >
                                            <Upload className="w-5 h-5 mr-2" />
                                            Chọn hình ảnh
                                        </button>
                                        <p className="text-xs text-gray-500 mt-4">
                                            Hỗ trợ JPG, PNG, WebP. Tối đa 10MB.
                                        </p>
                                    </div>

                                    {/* Camera Option */}
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                        <span className="text-gray-500 text-sm">HOẶC</span>
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                    </div>

                                    <button
                                        onClick={startCamera}
                                        className="w-full btn-outline py-3 rounded-xl"
                                    >
                                        <Camera className="w-5 h-5 mr-2" />
                                        Chụp ảnh từ camera
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Image Preview */}
                                    <div className="relative">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            width={600}
                                            height={400}
                                            className="w-full h-64 object-cover rounded-xl border"
                                        />
                                        <button
                                            onClick={clearImage}
                                            className="absolute top-2 right-2 btn-danger btn-sm rounded-full p-2"
                                            aria-label="Xóa hình ảnh"
                                            title="Xóa hình ảnh"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Analysis Button */}
                                    <button
                                        onClick={analyzeImage}
                                        disabled={isAnalyzing}
                                        className="w-full btn-primary py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Đang phân tích...
                                            </>
                                        ) : (
                                            <>
                                                <Brain className="w-5 h-5 mr-2" />
                                                Phân tích hình ảnh
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Camera View */}
                            {cameraActive && (
                                <div className="mt-6 space-y-4">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full h-64 object-cover rounded-xl bg-black"
                                    />
                                    <div className="flex justify-center space-x-4">
                                        <button onClick={capturePhoto} className="btn-primary px-6 py-3 rounded-xl">
                                            <Camera className="w-5 h-5 mr-2" />
                                            Chụp ảnh
                                        </button>
                                        <button onClick={stopCamera} className="btn-secondary px-6 py-3 rounded-xl">
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            )}

                            <canvas ref={canvasRef} className="hidden" />
                        </div>

                        {/* Analysis Results */}
                        {currentAnalysis && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                        <Sparkles className="w-5 h-5 mr-2 text-green-500" />
                                        Kết quả phân tích
                                    </h2>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => shareResult(currentAnalysis)}
                                            className="btn-outline btn-sm"
                                        >
                                            <Share2 className="w-4 h-4 mr-1" />
                                            Chia sẻ
                                        </button>
                                        <button
                                            onClick={() => downloadResult(currentAnalysis)}
                                            className="btn-outline btn-sm"
                                        >
                                            <Download className="w-4 h-4 mr-1" />
                                            Tải xuống
                                        </button>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Basic Info */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                                            <div>
                                                <h3 className="text-lg font-semibold text-green-900">
                                                    {currentAnalysis.dishName}
                                                </h3>
                                                <p className="text-green-700 text-sm">
                                                    Độ tin cậy: {Math.round(currentAnalysis.confidence * 100)}%
                                                </p>
                                            </div>
                                            <div className="text-2xl">🍽️</div>
                                        </div>

                                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                                                <Utensils className="w-4 h-4 mr-2" />
                                                Nguyên liệu chính
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {currentAnalysis.ingredients.map((ingredient, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                                    >
                                                        {ingredient}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {currentAnalysis.nutritionInfo && (
                                            <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                                                <h4 className="font-semibold text-orange-900 mb-3 flex items-center">
                                                    <Star className="w-4 h-4 mr-2" />
                                                    Thông tin dinh dưỡng
                                                </h4>
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-orange-700">Calories:</span>
                                                        <span className="font-medium text-orange-900">
                                                            {currentAnalysis.nutritionInfo.calories} kcal
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-orange-700">Protein:</span>
                                                        <span className="font-medium text-orange-900">
                                                            {currentAnalysis.nutritionInfo.protein}g
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-orange-700">Carbs:</span>
                                                        <span className="font-medium text-orange-900">
                                                            {currentAnalysis.nutritionInfo.carbs}g
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-orange-700">Fat:</span>
                                                        <span className="font-medium text-orange-900">
                                                            {currentAnalysis.nutritionInfo.fat}g
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description & Cultural Info */}
                                    <div className="space-y-4">
                                        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                                            <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                                                <Brain className="w-4 h-4 mr-2" />
                                                Mô tả món ăn
                                            </h4>
                                            <p className="text-purple-800 text-sm leading-relaxed">
                                                {currentAnalysis.description}
                                            </p>
                                        </div>

                                        {currentAnalysis.culturalInfo && (
                                            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                                <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
                                                    <Star className="w-4 h-4 mr-2" />
                                                    Thông tin văn hóa
                                                </h4>
                                                <p className="text-yellow-800 text-sm leading-relaxed">
                                                    {currentAnalysis.culturalInfo}
                                                </p>
                                            </div>
                                        )}

                                        {currentAnalysis.recipe && (
                                            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                                <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                                                    <ChefHat className="w-4 h-4 mr-2" />
                                                    Công thức gợi ý
                                                </h4>
                                                <div className="grid grid-cols-3 gap-2 text-xs text-green-700 mb-3">
                                                    <div className="flex items-center">
                                                        <Timer className="w-3 h-3 mr-1" />
                                                        {currentAnalysis.recipe.cookingTime}p
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Users className="w-3 h-3 mr-1" />
                                                        {currentAnalysis.recipe.servings}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Star className="w-3 h-3 mr-1" />
                                                        {currentAnalysis.recipe.difficulty}
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/recipes/${currentAnalysis.recipe.id}`}
                                                    className="btn-primary btn-sm inline-flex items-center"
                                                >
                                                    <Utensils className="w-3 h-3 mr-1" />
                                                    Xem công thức đầy đủ
                                                </Link>
                                            </div>
                                        )}

                                        {/* Processing Info */}
                                        <div className="text-xs text-gray-500 flex items-center justify-between">
                                            <span>
                                                Phân tích lúc: {currentAnalysis.timestamp.toLocaleString('vi-VN')}
                                            </span>
                                            {currentAnalysis.processingTime && (
                                                <span>
                                                    Thời gian xử lý: {currentAnalysis.processingTime}ms
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Sample Images */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <ImageIcon className="w-5 h-5 mr-2" />
                                Ảnh mẫu
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {sampleImages.map((sample, index) => (
                                    <button
                                        key={index}
                                        className="relative group rounded-lg overflow-hidden border border-gray-200 hover:border-green-300 transition-all"
                                        onClick={() => {
                                            // Load sample image
                                            fetch(sample.url)
                                                .then(res => res.blob())
                                                .then(blob => {
                                                    const file = new File([blob], `${sample.name}.jpg`, { type: 'image/jpeg' });
                                                    handleImageUpload(file);
                                                });
                                        }}
                                    >
                                        <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                            <span className="text-xs text-gray-500">{sample.name}</span>
                                        </div>
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                            <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recent Analysis */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Timer className="w-5 h-5 mr-2" />
                                Phân tích gần đây
                            </h3>

                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {analysisHistory.length === 0 ? (
                                    <p className="text-gray-500 text-sm">Chưa có phân tích nào</p>
                                ) : (
                                    analysisHistory.slice(0, 10).map((analysis) => (
                                        <div
                                            key={analysis.id}
                                            className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => setCurrentAnalysis(analysis)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                    <Image
                                                        src={analysis.image}
                                                        alt={analysis.dishName}
                                                        width={48}
                                                        height={48}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm text-gray-900 truncate">
                                                        {analysis.dishName}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {Math.round(analysis.confidence * 100)}% tin cậy
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {analysis.timestamp.toLocaleDateString('vi-VN')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-6 border border-green-200">
                            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                                <ChefHat className="w-5 h-5 mr-2" />
                                Mẹo chụp ảnh tốt
                            </h3>

                            <ul className="space-y-2 text-sm text-green-800">
                                <li className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Chụp ảnh rõ nét, đủ ánh sáng</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Món ăn chiếm phần lớn khung hình</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Tránh chụp từ góc độ quá nghiêng</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Nền đơn giản, không quá nhiều chi tiết</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

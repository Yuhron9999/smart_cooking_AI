import { useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';

interface FoodImage {
    url: string;
    title: string;
    snippet: string;
    thumbnail?: string;
    width?: number;
    height?: number;
}

interface SearchResponse {
    success: boolean;
    data?: {
        images: FoodImage[];
        query: string;
        total_results: number;
    };
    message?: string;
}

export default function TestGoogleImages() {
    const [query, setQuery] = useState('pho bo');
    const [images, setImages] = useState<FoodImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [totalResults, setTotalResults] = useState(0);

    const searchImages = async () => {
        setLoading(true);
        setError('');
        setImages([]);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_AI_SERVICE_URL}/api/ai/search-food-images`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    dish_name: query,
                    max_results: 6,
                    language: 'vi'
                })
            });

            const data: SearchResponse = await response.json();

            if (data.success && data.data) {
                setImages(data.data.images || []);
                setTotalResults(data.data.total_results || 0);
            } else {
                setError(data.message || 'Tìm kiếm thất bại');
            }
        } catch (err) {
            console.error('Search error:', err);
            setError(err instanceof Error ? err.message : 'Lỗi kết nối mạng');
        } finally {
            setLoading(false);
        }
    };

    const testQueries = [
        'pho bo', 'banh mi', 'bun cha', 'com tam', 'banh xeo',
        'spring rolls', 'vietnamese coffee', 'banh cuon'
    ];

    return (
        <>
            <Head>
                <title>🔍 Test Google Images API - Smart Cooking AI</title>
                <meta name="description" content="Test Google Custom Search API integration" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">
                            🔍 Test Google Images API
                        </h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Testing Smart Cooking AI integration với Google Custom Search API
                        </p>

                        {/* API Status */}
                        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            API Key: AIzaSyClNKx2vTBYv6DXrCLV2lasmMqF3HRCM94 (Active)
                        </div>
                    </div>

                    {/* Search Interface */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Nhập tên món ăn (VD: phở bò, bánh mì...)"
                                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                                onKeyPress={(e) => e.key === 'Enter' && searchImages()}
                            />
                            <button
                                onClick={searchImages}
                                disabled={loading || !query.trim()}
                                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg transition-all duration-200"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Đang tìm...
                                    </div>
                                ) : (
                                    '🔍 Tìm hình ảnh'
                                )}
                            </button>
                        </div>

                        {/* Quick Search Buttons */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="text-sm text-gray-600 mr-2">Quick search:</span>
                            {testQueries.map((testQuery) => (
                                <button
                                    key={testQuery}
                                    onClick={() => {
                                        setQuery(testQuery);
                                        setTimeout(() => searchImages(), 100);
                                    }}
                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                                >
                                    {testQuery}
                                </button>
                            ))}
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">
                                <div className="flex items-center">
                                    <span className="text-xl mr-2">❌</span>
                                    <div>
                                        <strong>Lỗi:</strong> {error}
                                        <div className="text-sm mt-1 text-red-600">
                                            Kiểm tra: AI service (port 8001), API key, network connection
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {totalResults > 0 && (
                            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg mb-4">
                                <div className="flex items-center">
                                    <span className="text-xl mr-2">✅</span>
                                    <div>
                                        <strong>Thành công!</strong> Tìm thấy {totalResults} hình ảnh cho &quot;{query}&quot;
                                        <div className="text-sm mt-1 text-green-600">
                                            Google Custom Search API đang hoạt động tốt
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Results Grid */}
                    {images.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                🎯 Kết quả tìm kiếm: {images.length} hình ảnh
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {images.map((img, index) => (
                                    <div key={index} className="border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <div className="relative h-48 bg-gray-100">
                                            <Image
                                                src={img.url}
                                                alt={img.title || `Food image ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/placeholder-food.jpg';
                                                }}
                                            />
                                            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm">
                                                {img.title || 'Hình ảnh món ăn'}
                                            </h3>
                                            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                                                {img.snippet || 'Không có mô tả'}
                                            </p>
                                            {img.width && img.height && (
                                                <div className="mt-2 text-xs text-gray-500">
                                                    📐 {img.width} × {img.height}px
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* API Info */}
                    <div className="mt-8 bg-blue-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-blue-800 mb-3">
                            📊 API Configuration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <strong className="text-blue-700">AI Service URL:</strong>
                                <div className="text-blue-600">{process.env.NEXT_PUBLIC_AI_SERVICE_URL}</div>
                            </div>
                            <div>
                                <strong className="text-blue-700">Google CSE ID:</strong>
                                <div className="text-blue-600 font-mono">e100a35e687874093</div>
                            </div>
                            <div>
                                <strong className="text-blue-700">API Endpoint:</strong>
                                <div className="text-blue-600">/api/ai/search-food-images</div>
                            </div>
                            <div>
                                <strong className="text-blue-700">Free Quota:</strong>
                                <div className="text-blue-600">100 requests/day</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

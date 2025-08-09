import React from 'react';
import Link from 'next/link';
import { Home, ChefHat, ArrowLeft } from 'lucide-react';

const Custom404: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                {/* Logo & Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="bg-white p-6 rounded-full shadow-lg border">
                        <ChefHat className="w-16 h-16 text-green-600" />
                    </div>
                </div>

                {/* 404 Title */}
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>

                {/* Main Message */}
                <h2 className="text-3xl font-semibold text-gray-700 mb-6">
                    Không tìm thấy trang
                </h2>

                {/* Description */}
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Có vẻ như bạn đã lạc đường trong bếp của chúng tôi!
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/"
                        className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Về trang chủ
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Quay lại
                    </button>
                </div>

                {/* Helpful Links */}
                <div className="mt-12">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Có thể bạn đang tìm kiếm:
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/recipes"
                            className="text-green-600 hover:text-green-700 underline"
                        >
                            Công thức nấu ăn
                        </Link>
                        <Link
                            href="/ai-chat"
                            className="text-green-600 hover:text-green-700 underline"
                        >
                            Chat với AI
                        </Link>
                        <Link
                            href="/voice-assistant"
                            className="text-green-600 hover:text-green-700 underline"
                        >
                            Trợ lý giọng nói
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-green-600 hover:text-green-700 underline"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>

                {/* Fun Cooking Tip */}
                <div className="mt-12 p-6 bg-white/70 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-2">💡 Mẹo nấu ăn:</h4>
                    <p className="text-gray-600 text-sm">
                        Trong khi bạn tìm đường về, hãy nhớ rằng muối một chút vào đầu quá trình nấu
                        sẽ giúp rút nước từ thực phẩm tốt hơn là thêm muối cuối cùng!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Custom404;

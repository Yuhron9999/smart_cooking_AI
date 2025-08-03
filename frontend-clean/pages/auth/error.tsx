import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
    AlertCircle,
    RefreshCw,
    Home,
    ArrowLeft,
    Shield,
    Mail,
    Key,
    Globe
} from 'lucide-react';

export default function AuthErrorPage() {
    const router = useRouter();
    const { error } = router.query;

    const getErrorInfo = (errorType: string | string[] | undefined) => {
        switch (errorType) {
            case 'Configuration':
                return {
                    title: 'Lỗi cấu hình OAuth2',
                    description: 'Có vấn đề với cấu hình Google OAuth2. Vui lòng kiểm tra lại thiết lập.',
                    icon: <Shield className="h-10 w-10 text-red-600" />,
                    suggestions: [
                        'Kiểm tra GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET',
                        'Xác nhận callback URL trong Google Cloud Console',
                        'Đảm bảo OAuth2 được kích hoạt'
                    ]
                };
            case 'AccessDenied':
                return {
                    title: 'Truy cập bị từ chối',
                    description: 'Bạn đã từ chối cấp quyền hoặc hủy quá trình đăng nhập.',
                    icon: <Key className="h-10 w-10 text-orange-600" />,
                    suggestions: [
                        'Thử đăng nhập lại và cấp quyền cần thiết',
                        'Kiểm tra tài khoản Google của bạn',
                        'Đảm bảo email được cho phép truy cập'
                    ]
                };
            case 'Verification':
                return {
                    title: 'Lỗi xác thực',
                    description: 'Không thể xác thực thông tin đăng nhập của bạn.',
                    icon: <Mail className="h-10 w-10 text-purple-600" />,
                    suggestions: [
                        'Kiểm tra kết nối internet',
                        'Thử đăng nhập lại sau vài phút',
                        'Liên hệ hỗ trợ nếu vẫn gặp lỗi'
                    ]
                };
            case 'Default':
            default:
                return {
                    title: 'Lỗi đăng nhập',
                    description: 'Đã xảy ra lỗi không xác định trong quá trình đăng nhập.',
                    icon: <AlertCircle className="h-10 w-10 text-red-600" />,
                    suggestions: [
                        'Thử làm mới trang và đăng nhập lại',
                        'Xóa cache và cookies của trình duyệt',
                        'Kiểm tra kết nối internet'
                    ]
                };
        }
    };

    const errorInfo = getErrorInfo(error);

    const handleRetrySignIn = () => {
        router.push('/auth/signin');
    };

    const handleGoHome = () => {
        router.push('/');
    };

    const handleGoBack = () => {
        router.back();
    };

    const handleClearCache = () => {
        // Clear localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // Reload page
        window.location.reload();
    };

    return (
        <>
            <Head>
                <title>Lỗi đăng nhập - Smart Cooking AI</title>
                <meta name="description" content="Đã xảy ra lỗi trong quá trình đăng nhập vào Smart Cooking AI" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        {/* Error Icon & Title */}
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                {errorInfo.icon}
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                {errorInfo.title}
                            </h1>

                            <p className="text-gray-600 mb-6">
                                {errorInfo.description}
                            </p>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                                    <p className="text-sm text-red-800">
                                        <strong>Mã lỗi:</strong> {error}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Suggestions */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Gợi ý khắc phục:
                            </h3>
                            <ul className="space-y-2">
                                {errorInfo.suggestions.map((suggestion, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-sm text-gray-700">{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleRetrySignIn}
                                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2"
                            >
                                <RefreshCw className="h-5 w-5" />
                                <span>Thử đăng nhập lại</span>
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleGoBack}
                                    className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span>Quay lại</span>
                                </button>

                                <button
                                    onClick={handleGoHome}
                                    className="bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <Home className="h-4 w-4" />
                                    <span>Trang chủ</span>
                                </button>
                            </div>

                            <button
                                onClick={handleClearCache}
                                className="w-full bg-yellow-100 text-yellow-800 py-2 px-4 rounded-lg hover:bg-yellow-200 transition-colors flex items-center justify-center space-x-2 text-sm"
                            >
                                <Globe className="h-4 w-4" />
                                <span>Xóa cache và thử lại</span>
                            </button>
                        </div>

                        {/* Help Section */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">
                                    Vẫn gặp vấn đề?
                                </p>
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-500">
                                        • Kiểm tra kết nối internet
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        • Thử trình duyệt khác hoặc chế độ ẩn danh
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        • Tắt tiện ích chặn quảng cáo
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

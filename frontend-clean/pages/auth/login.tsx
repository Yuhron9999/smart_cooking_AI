import React, { useState, useEffect } from 'react';
import { signIn, getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ChefHat, Mail, Sparkles, Users, BookOpen, Star } from 'lucide-react';
import Head from 'next/head';

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (session) {
            router.push('/dashboard');
        }
    }, [session, router]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            const result = await signIn('google', {
                callbackUrl: '/dashboard',
                redirect: false
            });

            if (result?.error) {
                console.error('Đăng nhập thất bại:', result.error);
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const benefits = [
        {
            icon: <Sparkles className="h-6 w-6" />,
            title: "AI Recipe Generation",
            description: "Tạo công thức từ nguyên liệu có sẵn"
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Community",
            description: "Kết nối với cộng đồng đầu bếp"
        },
        {
            icon: <BookOpen className="h-6 w-6" />,
            title: "Learning Path",
            description: "Lộ trình học nấu ăn cá nhân hóa"
        }
    ];

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Đăng nhập - Smart Cooking AI</title>
                <meta name="description" content="Đăng nhập vào Smart Cooking AI - Hệ thống nấu ăn thông minh với AI" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className="absolute w-96 h-96 bg-gradient-to-r from-orange-200/30 to-blue-200/30 rounded-full blur-3xl"
                        style={{
                            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
                            transition: 'transform 0.1s ease-out'
                        }}
                    />
                    <div
                        className="absolute right-0 top-1/2 w-80 h-80 bg-gradient-to-l from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"
                        style={{
                            transform: `translate(-${mousePosition.x * 0.01}px, -${mousePosition.y * 0.01}px)`,
                            transition: 'transform 0.1s ease-out'
                        }}
                    />
                </div>

                {/* Left Side - Login Form */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-md w-full space-y-8">
                        {/* Logo & Header */}
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-2xl shadow-lg">
                                    <ChefHat className="h-12 w-12 text-white" />
                                </div>
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-2">
                                Chào mừng trở lại!
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Đăng nhập vào Smart Cooking AI
                            </p>
                        </div>

                        {/* Login Card */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
                            <div className="space-y-6">
                                {/* Google Sign In Button */}
                                <button
                                    onClick={handleGoogleSignIn}
                                    disabled={isLoading}
                                    className="group relative w-full flex justify-center py-4 px-6 border border-gray-300 rounded-xl text-gray-700 font-semibold bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="absolute left-6 inset-y-0 flex items-center">
                                        <svg className="h-6 w-6" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                    </span>
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500 mr-2"></div>
                                            Đang đăng nhập...
                                        </div>
                                    ) : (
                                        'Đăng nhập với Google'
                                    )}
                                </button>

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">hoặc</span>
                                    </div>
                                </div>

                                {/* Email Input (for future implementation) */}
                                <div className="opacity-50 pointer-events-none">
                                    <label htmlFor="email" className="sr-only">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            className="appearance-none rounded-xl relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                            placeholder="Email address (Sắp ra mắt)"
                                            disabled
                                        />
                                    </div>
                                </div>

                                {/* Terms */}
                                <p className="text-center text-sm text-gray-600">
                                    Bằng cách đăng nhập, bạn đồng ý với{' '}
                                    <a href="/terms" className="font-medium text-orange-600 hover:text-orange-500">
                                        Điều khoản dịch vụ
                                    </a>{' '}
                                    và{' '}
                                    <a href="/privacy" className="font-medium text-orange-600 hover:text-orange-500">
                                        Chính sách bảo mật
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Back to Home */}
                        <div className="text-center">
                            <button
                                onClick={() => router.push('/')}
                                className="text-orange-600 hover:text-orange-500 font-medium text-sm"
                            >
                                ← Về trang chủ
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side - Benefits */}
                <div className="hidden lg:flex flex-1 items-center justify-center p-8 relative z-10">
                    <div className="max-w-md">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                🌟 Smart Cooking AI
                            </h3>
                            <p className="text-xl text-gray-600">
                                Hệ thống nấu ăn thông minh với AI
                            </p>
                        </div>

                        <div className="space-y-6">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white">
                                            {benefit.icon}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                            {benefit.title}
                                        </h4>
                                        <p className="text-gray-600">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="text-center bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                                <div className="text-2xl font-bold text-orange-600 mb-1">10K+</div>
                                <div className="text-sm text-gray-600">Công thức</div>
                            </div>
                            <div className="text-center bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                                <div className="text-2xl font-bold text-blue-600 mb-1">50K+</div>
                                <div className="text-sm text-gray-600">Người dùng</div>
                            </div>
                            <div className="text-center bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                                <div className="flex items-center justify-center mb-1">
                                    <span className="text-2xl font-bold text-yellow-600">4.9</span>
                                    <Star className="h-5 w-5 text-yellow-400 ml-1" />
                                </div>
                                <div className="text-sm text-gray-600">Đánh giá</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

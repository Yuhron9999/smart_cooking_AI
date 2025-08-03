import React, { useState, useEffect } from 'react';
import { signIn, getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import {
    ChefHat,
    Mail,
    Sparkles,
    Users,
    BookOpen,
    Star,
    Mic,
    Camera,
    ArrowRight,
    Shield,
    Globe
} from 'lucide-react';

export default function SignInPage() {
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

    const features = [
        {
            icon: <Sparkles className="h-8 w-8 text-yellow-500" />,
            title: "AI Recipe Generation",
            description: "Tạo công thức từ nguyên liệu có sẵn với sức mạnh AI",
            color: "from-yellow-400 to-orange-500"
        },
        {
            icon: <Mic className="h-8 w-8 text-blue-500" />,
            title: "Voice Assistant",
            description: "Trợ lý giọng nói thông minh hỗ trợ nấu ăn",
            color: "from-blue-400 to-purple-500"
        },
        {
            icon: <Camera className="h-8 w-8 text-green-500" />,
            title: "Food Recognition",
            description: "Nhận dạng món ăn và phân tích dinh dưỡng",
            color: "from-green-400 to-teal-500"
        },
        {
            icon: <BookOpen className="h-8 w-8 text-purple-500" />,
            title: "Learning Paths",
            description: "Lộ trình học nấu ăn từ cơ bản đến nâng cao",
            color: "from-purple-400 to-pink-500"
        }
    ];

    const stats = [
        { label: "Công thức AI", value: "10,000+", icon: <ChefHat className="h-5 w-5" /> },
        { label: "Người dùng", value: "50,000+", icon: <Users className="h-5 w-5" /> },
        { label: "Đánh giá", value: "4.9/5", icon: <Star className="h-5 w-5" /> },
        { label: "Ngôn ngữ", value: "5+", icon: <Globe className="h-5 w-5" /> }
    ];

    return (
        <>
            <Head>
                <title>Đăng nhập - Smart Cooking AI</title>
                <meta name="description" content="Đăng nhập vào Smart Cooking AI - Hệ thống nấu ăn thông minh" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className="absolute w-96 h-96 bg-gradient-to-r from-orange-300 to-red-300 rounded-full opacity-20 blur-3xl"
                        style={{
                            transform: `translate(${mousePosition.x / 10}px, ${mousePosition.y / 10}px)`,
                        }}
                    />
                    <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-10 blur-2xl animate-pulse" />
                    <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-pink-300 to-red-300 rounded-full opacity-15 blur-3xl animate-bounce" />
                </div>

                <div className="relative z-10 flex min-h-screen">
                    {/* Left Side - Branding & Features */}
                    <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12">
                        <div className="max-w-lg">
                            {/* Logo & Brand */}
                            <div className="flex items-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mr-4">
                                    <ChefHat className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Smart Cooking AI</h1>
                                    <p className="text-gray-600">Nấu ăn thông minh với AI</p>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-6 mb-8">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color}`}>
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                                            <p className="text-sm text-gray-600">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center p-3 bg-white/40 backdrop-blur-sm rounded-lg">
                                        <div className="flex items-center justify-center mb-1 text-orange-600">
                                            {stat.icon}
                                        </div>
                                        <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                                        <div className="text-xs text-gray-600">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
                        <div className="mx-auto w-full max-w-md">
                            {/* Mobile Logo */}
                            <div className="lg:hidden text-center mb-8">
                                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <ChefHat className="h-10 w-10 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Smart Cooking AI</h1>
                                <p className="text-gray-600">Nấu ăn thông minh với AI</p>
                            </div>

                            {/* Login Card */}
                            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                        Chào mừng trở lại! 👋
                                    </h2>
                                    <p className="text-gray-600">
                                        Đăng nhập để khám phá thế giới nấu ăn thông minh
                                    </p>
                                </div>

                                {/* Google Sign In Button */}
                                <button
                                    onClick={handleGoogleSignIn}
                                    disabled={isLoading || status === 'loading'}
                                    className="w-full flex items-center justify-center px-6 py-4 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                                                <path
                                                    fill="#4285F4"
                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                />
                                                <path
                                                    fill="#34A853"
                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                />
                                                <path
                                                    fill="#FBBC05"
                                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                />
                                                <path
                                                    fill="#EA4335"
                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                />
                                            </svg>
                                            <span className="text-gray-700 font-medium group-hover:text-gray-900">
                                                Đăng nhập với Google
                                            </span>
                                            <ArrowRight className="w-5 h-5 ml-2 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                                        </>
                                    )}
                                </button>

                                {/* Alternative Login Methods */}
                                <div className="mt-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-300" />
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-gray-500">Hoặc</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-3">
                                        <button
                                            disabled
                                            className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl text-gray-400 cursor-not-allowed bg-gray-50"
                                        >
                                            <Mail className="w-5 h-5 mr-2" />
                                            Đăng nhập với Email (Sắp có)
                                        </button>

                                        <div className="text-center">
                                            <button
                                                disabled
                                                className="text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-not-allowed"
                                            >
                                                Chưa có tài khoản? <span className="font-medium">Đăng ký (Sắp có)</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Note */}
                                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-start space-x-2">
                                        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div className="text-sm text-blue-800">
                                            <p className="font-medium mb-1">Bảo mật tuyệt đối</p>
                                            <p>Chúng tôi không lưu trữ mật khẩu và sử dụng OAuth2 để bảo vệ thông tin của bạn.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="text-center mt-8 text-sm text-gray-500">
                                <p>
                                    Bằng việc đăng nhập, bạn đồng ý với{' '}
                                    <button className="text-orange-600 hover:text-orange-500 font-medium">
                                        Điều khoản sử dụng
                                    </button>{' '}
                                    và{' '}
                                    <button className="text-orange-600 hover:text-orange-500 font-medium">
                                        Chính sách bảo mật
                                    </button>{' '}
                                    của chúng tôi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session) {
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};

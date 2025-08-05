import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
    ArrowLeft,
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    Chrome,
    CheckCircle,
    AlertCircle,
    Sparkles,
    ChefHat,
    Brain,
    Mic,
    Shield,
    Users,
    Star,
    Globe,
    Phone,
    Calendar,
    MapPin,
    Building,
    Briefcase,
    Loader2
} from 'lucide-react';

export default function AuthPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    // Redirect if already authenticated
    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard');
        }
    }, [status, router]);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const result = await signIn('google', {
                callbackUrl: '/dashboard',
                redirect: false
            });

            if (result?.error) {
                console.error('Login error:', result.error);
                setIsLoading(false);
            } else if (result?.url) {
                router.push(result.url);
            }
        } catch (error) {
            console.error('Google login error:', error);
            setIsLoading(false);
        }
    };

    const features = [
        {
            icon: Brain,
            title: 'AI Thông minh',
            description: 'Tạo công thức từ nguyên liệu có sẵn',
            color: 'text-blue-600'
        },
        {
            icon: Mic,
            title: 'Trợ lý Giọng nói',
            description: 'Điều khiển bằng giọng nói tiếng Việt',
            color: 'text-green-600'
        },
        {
            icon: ChefHat,
            title: 'Công thức Đa dạng',
            description: '50K+ công thức từ khắp thế giới',
            color: 'text-orange-600'
        },
        {
            icon: Users,
            title: 'Cộng đồng',
            description: 'Chia sẻ và học hỏi từ cộng đồng',
            color: 'text-purple-600'
        }
    ];

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container min-h-screen bg-gray-50">
            <Head>
                <title>Đăng nhập - Smart Cooking AI</title>
                <meta name="description" content="Đăng nhập vào Smart Cooking AI để khám phá thế giới nấu ăn thông minh" />
            </Head>

            {/* Header */}
            <nav className="navbar bg-white border-b shadow-sm">
                <div className="container-modern">
                    <div className="flex items-center justify-between py-4">
                        <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                            <span>Về trang chủ</span>
                        </Link>

                        <div className="flex items-center space-x-2">
                            <ChefHat className="w-6 h-6 text-orange-500" />
                            <span className="text-xl font-bold gradient-text">Smart Cooking AI</span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="min-h-screen flex">
                {/* Left Side - Features */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 p-8 items-center justify-center relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
                        <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-pulse delay-1000"></div>
                        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full animate-pulse delay-2000"></div>
                        <div className="absolute bottom-40 right-10 w-12 h-12 bg-white rounded-full animate-pulse delay-500"></div>
                    </div>

                    <div className="max-w-lg text-white relative z-10">
                        <div className="mb-8 animate-fade-in">
                            <h1 className="text-4xl font-bold mb-4">
                                Chào mừng đến với <br />
                                <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                                    Smart Cooking AI
                                </span>
                            </h1>
                            <p className="text-xl opacity-90">
                                Khám phá thế giới nấu ăn thông minh với trợ lý AI cá nhân của bạn
                            </p>
                        </div>

                        <div className="space-y-6 mb-12">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-4 animate-slide-in-left"
                                    style={{ animationDelay: `${index * 0.2}s` }}
                                >
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{feature.title}</h3>
                                        <p className="opacity-80 text-sm">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-6 text-center">
                            {[
                                { number: '100K+', label: 'Người dùng' },
                                { number: '50K+', label: 'Công thức' },
                                { number: '4.8★', label: 'Đánh giá' }
                            ].map((stat, index) => (
                                <div key={index} className="animate-bounce-in" style={{ animationDelay: `${index * 0.3}s` }}>
                                    <div className="text-3xl font-bold mb-1">{stat.number}</div>
                                    <div className="text-sm opacity-80">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side - Auth Forms */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <div className="max-w-md w-full animate-fade-in-up">
                        {/* Main Auth Card */}
                        <div className="card bg-white shadow-xl border-0">
                            <div className="p-8">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <ChefHat className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
                                    <p className="text-gray-600">Bắt đầu hành trình nấu ăn thông minh</p>
                                </div>

                                {/* Google Login Button */}
                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={isLoading}
                                    className="w-full bg-white border-2 border-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 flex items-center justify-center space-x-3 group hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                                            <span>Đang đăng nhập...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Chrome className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                                            <span>Tiếp tục với Google</span>
                                        </>
                                    )}
                                </button>

                                <div className="mt-8 text-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-4 bg-white text-gray-500">Bảo mật & Riêng tư</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Features */}
                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                        <div className="text-xs text-gray-600">Bảo mật SSL</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <Lock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                        <div className="text-xs text-gray-600">OAuth2</div>
                                    </div>
                                </div>

                                <div className="mt-6 text-center text-sm text-gray-500">
                                    Bằng cách đăng nhập, bạn đồng ý với{' '}
                                    <Link href="/terms" className="text-orange-600 hover:text-orange-700 font-medium">
                                        Điều khoản sử dụng
                                    </Link>{' '}
                                    và{' '}
                                    <Link href="/privacy" className="text-orange-600 hover:text-orange-700 font-medium">
                                        Chính sách bảo mật
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Benefits Section */}
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            {[
                                { icon: Brain, text: 'AI Recipe Generation', color: 'text-blue-500' },
                                { icon: Mic, text: 'Voice Assistant', color: 'text-green-500' },
                                { icon: Globe, text: 'Multi-language', color: 'text-purple-500' },
                                { icon: Star, text: 'Premium Features', color: 'text-yellow-500' }
                            ].map((benefit, index) => (
                                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                                    <benefit.icon className={`w-6 h-6 mx-auto mb-2 ${benefit.color}`} />
                                    <div className="text-xs text-gray-600">{benefit.text}</div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="text-center mt-8 text-sm text-gray-500">
                            <p>© 2024 Smart Cooking AI. All rights reserved.</p>
                            <div className="flex items-center justify-center space-x-4 mt-2">
                                <Link href="/terms" className="hover:text-orange-600 transition-colors">Điều khoản</Link>
                                <span>•</span>
                                <Link href="/privacy" className="hover:text-orange-600 transition-colors">Bảo mật</Link>
                                <span>•</span>
                                <Link href="/help" className="hover:text-orange-600 transition-colors">Trợ giúp</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

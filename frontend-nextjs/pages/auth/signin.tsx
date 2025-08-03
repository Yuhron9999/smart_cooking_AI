import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession, signIn, getProviders } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { ChefHat, Mail, Lock, Eye, EyeOff, Sparkles, Users, BookOpen, Star } from 'lucide-react';

interface SignInPageProps {
    providers: any;
    error?: string;
}

export default function SignIn({ providers, error }: SignInPageProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            const result = await signIn('google', {
                callbackUrl: router.query.callbackUrl as string || '/dashboard',
                redirect: false
            });

            if (result?.ok) {
                router.push('/dashboard');
            } else {
                console.error('Sign in failed:', result?.error);
            }
        } catch (error) {
            console.error('Sign in error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = [
        { number: "10K+", label: "Công thức", icon: <ChefHat className="h-5 w-5" /> },
        { number: "50K+", label: "Người dùng", icon: <Users className="h-5 w-5" /> },
        { number: "4.9", label: "Đánh giá", icon: <Star className="h-5 w-5" /> },
        { number: "1000+", label: "Bài học", icon: <BookOpen className="h-5 w-5" /> }
    ];

    return (
        <>
            <Head>
                <title>Đăng nhập - Smart Cooking AI</title>
                <meta name="description" content="Đăng nhập vào Smart Cooking AI để trải nghiệm nấu ăn thông minh với AI" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex">
                {/* Left Side - Branding & Features */}
                <div className="hidden lg:flex flex-1 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-purple-600"></div>
                    <div className="absolute inset-0 bg-black/20"></div>

                    {/* Animated Background Elements */}
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute bottom-32 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-2xl animate-pulse delay-500"></div>

                    <div className="relative z-10 flex flex-col justify-center p-12 text-white">
                        {/* Logo */}
                        <div className="flex items-center space-x-3 mb-8">
                            <ChefHat className="h-12 w-12" />
                            <div>
                                <h1 className="text-3xl font-bold">Smart Cooking AI</h1>
                                <p className="text-orange-200">Nấu ăn thông minh với AI</p>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-6 mb-12">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">AI Recipe Generation</h3>
                                    <p className="text-orange-200">Tạo công thức từ nguyên liệu có sẵn</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Lộ trình học cá nhân</h3>
                                    <p className="text-orange-200">Học nấu ăn từ cơ bản đến nâng cao</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Cộng đồng đầu bếp</h3>
                                    <p className="text-orange-200">Chia sẻ và học hỏi từ cộng đồng</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="flex justify-center mb-2 text-orange-200">
                                        {stat.icon}
                                    </div>
                                    <div className="text-2xl font-bold">{stat.number}</div>
                                    <div className="text-orange-200 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side - Sign In Form */}
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="flex justify-center items-center space-x-2 mb-4">
                                <ChefHat className="h-10 w-10 text-orange-500" />
                                <span className="text-2xl font-bold text-gray-900">Smart Cooking AI</span>
                            </div>
                            <p className="text-gray-600">Nấu ăn thông minh với AI</p>
                        </div>

                        {/* Sign In Form */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng trở lại</h2>
                                <p className="text-gray-600">Đăng nhập để tiếp tục hành trình nấu ăn</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">
                                        {error === 'OAuthSignin' && 'Lỗi đăng nhập với Google. Vui lòng thử lại.'}
                                        {error === 'OAuthCallback' && 'Lỗi xác thực. Vui lòng thử lại.'}
                                        {error === 'OAuthCreateAccount' && 'Không thể tạo tài khoản. Vui lòng thử lại.'}
                                        {error === 'EmailCreateAccount' && 'Không thể tạo tài khoản với email này.'}
                                        {error === 'Callback' && 'Lỗi xác thực. Vui lòng thử lại.'}
                                        {error === 'Default' && 'Đã xảy ra lỗi. Vui lòng thử lại.'}
                                    </p>
                                </div>
                            )}

                            {/* Google Sign In Button */}
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:shadow-lg transition-all duration-300 mb-6 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span className="font-semibold text-gray-700 group-hover:text-gray-900">
                                    {isLoading ? 'Đang đăng nhập...' : 'Tiếp tục với Google'}
                                </span>
                            </button>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">hoặc</span>
                                </div>
                            </div>

                            {/* Email/Password Form */}
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mật khẩu
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff /> : <Eye />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                                        <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                                    </label>
                                    <Link href="/auth/forgot-password" className="text-sm text-orange-600 hover:text-orange-700">
                                        Quên mật khẩu?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    Đăng nhập
                                </button>
                            </form>

                            {/* Sign Up Link */}
                            <div className="text-center mt-6 pt-6 border-t border-gray-200">
                                <p className="text-gray-600">
                                    Chưa có tài khoản?{' '}
                                    <Link href="/auth/register" className="text-orange-600 hover:text-orange-700 font-semibold">
                                        Đăng ký ngay
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="text-center mt-6">
                            <p className="text-xs text-gray-500">
                                Bằng việc đăng nhập, bạn đồng ý với{' '}
                                <Link href="/terms" className="text-orange-600 hover:underline">
                                    Điều khoản sử dụng
                                </Link>{' '}
                                và{' '}
                                <Link href="/privacy" className="text-orange-600 hover:underline">
                                    Chính sách bảo mật
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    // Redirect nếu đã đăng nhập
    if (session) {
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            },
        };
    }

    const providers = await getProviders();
    const error = context.query.error as string;

    return {
        props: {
            providers: providers ?? {},
            error: error ?? null,
        },
    };
};

// Professional Sign-in Page with OAuth2
import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { signIn, getProviders } from 'next-auth/react';
import type { Provider } from 'next-auth/providers';
import { authOptions } from '../api/auth/[...nextauth]';
import { motion } from 'framer-motion';
import {
    ChefHat,
    ArrowRight,
    Shield,
    Sparkles,
    Users,
    Clock,
    Award
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SignInProps {
    providers: Record<string, Provider>;
    callbackUrl?: string;
}

const SignIn: React.FC<SignInProps> = ({ providers, callbackUrl }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async (providerId: string) => {
        setIsLoading(true);
        try {
            await signIn(providerId, {
                callbackUrl: callbackUrl || '/'
            });
        } catch (error) {
            console.error('Sign in error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        {
            icon: Sparkles,
            title: 'AI Tạo Công Thức',
            description: 'Tạo ra công thức nấu ăn độc đáo từ nguyên liệu có sẵn'
        },
        {
            icon: Users,
            title: 'Cộng Đồng Chef',
            description: 'Kết nối với cộng đồng đầu bếp và người yêu nấu ăn'
        },
        {
            icon: Clock,
            title: 'Tiết Kiệm Thời Gian',
            description: 'Lên kế hoạch bữa ăn và mua sắm thông minh'
        },
        {
            icon: Award,
            title: 'Học Từ Chuyên Gia',
            description: 'Khóa học từ các đầu bếp chuyên nghiệp'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
            <div className="flex min-h-screen">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-orange-500 to-pink-600 p-12 text-white overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
                        <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full"></div>
                        <div className="absolute bottom-20 left-20 w-12 h-12 bg-white rounded-full"></div>
                        <div className="absolute bottom-32 right-10 w-24 h-24 bg-white rounded-full"></div>
                    </div>

                    <div className="relative z-10 flex flex-col justify-center max-w-lg">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                    <ChefHat className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold">Smart Cooking AI</h1>
                                    <p className="text-orange-100">Your AI Chef Assistant</p>
                                </div>
                            </div>

                            <h2 className="text-4xl font-bold mb-6 leading-tight">
                                Nấu Ăn Thông Minh<br />
                                Với Sức Mạnh AI
                            </h2>

                            <p className="text-xl text-orange-100 mb-12 leading-relaxed">
                                Khám phá hàng ngàn công thức độc đáo, học nấu ăn từ chuyên gia,
                                và tạo ra những món ăn tuyệt vời với sự hỗ trợ của AI.
                            </p>

                            <div className="space-y-6">
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={feature.title}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className="flex items-start space-x-4"
                                    >
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                                            <feature.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                                            <p className="text-orange-100">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side - Sign In Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full max-w-md"
                    >
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center justify-center mb-8">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <ChefHat className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                                        Smart Cooking AI
                                    </h1>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Chào Mừng Trở Lại
                            </h2>
                            <p className="text-gray-600">
                                Đăng nhập để tiếp tục hành trình nấu ăn thông minh
                            </p>
                        </div>

                        {/* Sign In Options */}
                        <div className="space-y-4">
                            {providers && Object.values(providers).map((provider: Provider) => (
                                <motion.div
                                    key={provider.name}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        onClick={() => handleSignIn(provider.id || 'google')}
                                        disabled={isLoading}
                                        variant="outline"
                                        size="lg"
                                        className="w-full h-12 border-2 hover:border-orange-300 hover:bg-orange-50 relative group"
                                    >
                                        <div className="flex items-center justify-center space-x-3">
                                            {provider.id === 'google' && (
                                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                </svg>
                                            )}
                                            <span className="font-medium">
                                                {isLoading ? 'Đang đăng nhập...' : `Đăng nhập với ${provider.name}`}
                                            </span>
                                            {!isLoading && (
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            )}
                                        </div>
                                    </Button>
                                </motion.div>
                            ))}
                        </div>

                        {/* Security Notice */}
                        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-start space-x-3">
                                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium mb-1">Bảo Mật Tuyệt Đối</p>
                                    <p>
                                        Chúng tôi không lưu trữ mật khẩu của bạn. Đăng nhập an toàn
                                        thông qua OAuth2 với các nhà cung cấp uy tín.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Terms */}
                        <p className="mt-6 text-center text-sm text-gray-500">
                            Bằng cách đăng nhập, bạn đồng ý với{' '}
                            <a href="/terms" className="text-orange-600 hover:text-orange-700 font-medium">
                                Điều Khoản Dịch Vụ
                            </a>{' '}
                            và{' '}
                            <a href="/privacy" className="text-orange-600 hover:text-orange-700 font-medium">
                                Chính Sách Bảo Mật
                            </a>{' '}
                            của chúng tôi.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);

    // Redirect if already signed in
    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const providers = await getProviders();
    const callbackUrl = (context.query.callbackUrl as string) || '/';

    return {
        props: {
            providers: providers ?? {},
            callbackUrl,
        },
    };
};

export default SignIn;

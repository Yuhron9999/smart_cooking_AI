import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import {
    LogOut,
    CheckCircle,
    ArrowLeft,
    Home,
    User,
    Settings,
    Shield
} from 'lucide-react';

export default function SignOutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [hasSignedOut, setHasSignedOut] = useState(false);

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            await signOut({
                callbackUrl: '/',
                redirect: false
            });
            setHasSignedOut(true);

            // Redirect after a short delay
            setTimeout(() => {
                router.push('/');
            }, 2000);
        } catch (error) {
            console.error('Đăng xuất thất bại:', error);
            setIsSigningOut(false);
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    const handleGoHome = () => {
        router.push('/');
    };

    const handleGoToDashboard = () => {
        router.push('/dashboard');
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (hasSignedOut) {
        return (
            <>
                <Head>
                    <title>Đăng xuất thành công - Smart Cooking AI</title>
                    <meta name="description" content="Bạn đã đăng xuất thành công khỏi Smart Cooking AI" />
                </Head>

                <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
                    <div className="max-w-md w-full mx-4">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                Đăng xuất thành công!
                            </h1>

                            <p className="text-gray-600 mb-6">
                                Cảm ơn bạn đã sử dụng Smart Cooking AI. Hẹn gặp lại!
                            </p>

                            <div className="text-sm text-gray-500 mb-4">
                                Đang chuyển hướng về trang chủ...
                            </div>

                            <button
                                onClick={handleGoHome}
                                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2"
                            >
                                <Home className="h-5 w-5" />
                                <span>Về trang chủ ngay</span>
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!session) {
        return (
            <>
                <Head>
                    <title>Chưa đăng nhập - Smart Cooking AI</title>
                    <meta name="description" content="Bạn chưa đăng nhập vào Smart Cooking AI" />
                </Head>

                <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center">
                    <div className="max-w-md w-full mx-4">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <User className="h-10 w-10 text-gray-600" />
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                Bạn chưa đăng nhập
                            </h1>

                            <p className="text-gray-600 mb-6">
                                Vui lòng đăng nhập để sử dụng các tính năng của Smart Cooking AI
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push('/auth/signin')}
                                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Đăng nhập ngay</span>
                                </button>

                                <button
                                    onClick={handleGoHome}
                                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <Home className="h-5 w-5" />
                                    <span>Về trang chủ</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Đăng xuất - Smart Cooking AI</title>
                <meta name="description" content="Đăng xuất khỏi Smart Cooking AI" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        {/* User Info */}
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                {session.user?.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt={session.user.name || 'User'}
                                        width={80}
                                        height={80}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="h-10 w-10 text-white" />
                                )}
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Xin chào, {session.user?.name || 'Người dùng'}!
                            </h1>

                            <p className="text-gray-600 mb-2">
                                {session.user?.email}
                            </p>

                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                <Shield className="h-4 w-4 mr-1" />
                                Đã đăng nhập với Google
                            </div>
                        </div>

                        {/* Sign Out Confirmation */}
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                    Bạn có chắc muốn đăng xuất?
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    Bạn sẽ cần đăng nhập lại để sử dụng các tính năng cá nhân hóa
                                </p>
                            </div>

                            <button
                                onClick={handleSignOut}
                                disabled={isSigningOut}
                                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSigningOut ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Đang đăng xuất...</span>
                                    </>
                                ) : (
                                    <>
                                        <LogOut className="h-5 w-5" />
                                        <span>Đăng xuất</span>
                                    </>
                                )}
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
                                    onClick={handleGoToDashboard}
                                    className="bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <Settings className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

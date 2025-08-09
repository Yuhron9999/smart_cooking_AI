// Professional Google OAuth2 Button với Business Logic & Beautiful UI/UX
import React, { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { LogIn, LogOut, User, ChevronDown, Settings, Shield } from 'lucide-react';
import AuthErrorBoundary from './AuthErrorBoundary';

const GoogleOAuthButton: React.FC = () => {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleSignIn = async () => {
        try {
            setIsLoading(true);
            await signIn('google', {
                callbackUrl: '/',
                redirect: true
            });
        } catch (error) {
            console.error('🚫 Sign in error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            setIsLoading(true);
            await signOut({
                callbackUrl: '/',
                redirect: true
            });
        } catch (error) {
            console.error('🚫 Sign out error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Loading State
    if (status === 'loading' || isLoading) {
        return (
            <button
                disabled
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-500 font-medium rounded-lg cursor-not-allowed"
            >
                <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-emerald-500 rounded-full" />
                <span>Đang tải...</span>
            </button>
        );
    }

    // Authenticated State
    if (status === 'authenticated' && session?.user) {
        return (
            <AuthErrorBoundary>
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                        <div className="flex items-center space-x-2">
                            {session.user.image ? (
                                <img
                                    src={session.user.image}
                                    alt="Profile"
                                    className="w-6 h-6 rounded-full border-2 border-white"
                                />
                            ) : (
                                <User size={18} />
                            )}
                            <span className="hidden sm:block">
                                {session.user.name?.split(' ')[0] || 'User'}
                            </span>
                        </div>
                        <ChevronDown size={16} className={`transform transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                            {/* User Info */}
                            <div className="px-4 py-3 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                    {session.user.image && (
                                        <img
                                            src={session.user.image}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full"
                                        />
                                    )}
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {session.user.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {session.user.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-1">
                                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    <User size={16} className="mr-3" />
                                    Hồ sơ cá nhân
                                </button>
                                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Settings size={16} className="mr-3" />
                                    Cài đặt
                                </button>
                                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Shield size={16} className="mr-3" />
                                    Bảo mật
                                </button>
                            </div>

                            {/* Logout */}
                            <div className="border-t border-gray-100 pt-1">
                                <button
                                    onClick={handleSignOut}
                                    disabled={isLoading}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} className="mr-3" />
                                    {isLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Overlay để đóng dropdown */}
                    {showDropdown && (
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowDropdown(false)}
                        />
                    )}
                </div>
            </AuthErrorBoundary>
        );
    }

    // Unauthenticated State
    return (
        <AuthErrorBoundary>
            <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-white text-emerald-600 border-2 border-emerald-500 font-semibold rounded-lg hover:bg-emerald-50 hover:border-emerald-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <LogIn size={18} />
                <span>
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </span>
            </button>
        </AuthErrorBoundary>
    );
};

export default GoogleOAuthButton;

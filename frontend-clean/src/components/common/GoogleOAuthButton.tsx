import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { User, LogIn, LogOut, Loader2 } from 'lucide-react';

interface GoogleOAuthButtonProps {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
    onSuccess?: () => void;
    className?: string;
}

const GoogleOAuthButton: React.FC<GoogleOAuthButtonProps> = ({
    variant = 'primary',
    size = 'md',
    showText = true,
    onSuccess,
    className = ''
}) => {
    const { data: session, status } = useSession();

    // Loading state
    if (status === 'loading') {
        return (
            <button
                disabled
                className={`btn-${variant} inline-flex items-center space-x-2 ${getSizeClass(size)} ${className}`}
            >
                <Loader2 className="h-4 w-4 animate-spin" />
                {showText && <span>Đang tải...</span>}
            </button>
        );
    }

    // Authenticated state
    if (session?.user) {
        return (
            <div className="flex items-center space-x-3">
                {/* User Avatar & Info */}
                <div className="flex items-center space-x-2">
                    {session.user.image ? (
                        <img
                            src={session.user.image}
                            alt={session.user.name || 'User'}
                            className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                        </div>
                    )}
                    {showText && (
                        <span className="text-sm font-medium text-gray-700">
                            Xin chào, {session.user.name?.split(' ')[0] || 'Bạn'}!
                        </span>
                    )}
                </div>

                {/* Logout Button */}
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className={`btn-outline inline-flex items-center space-x-2 ${getSizeClass(size)} ${className}`}
                    title="Đăng xuất"
                >
                    <LogOut className="h-4 w-4" />
                    {showText && <span>Đăng xuất</span>}
                </button>
            </div>
        );
    }

    // Unauthenticated state - Show login button
    return (
        <button
            onClick={() => signIn('google', {
                callbackUrl: '/dashboard',
                redirect: true
            })}
            className={`btn-${variant} inline-flex items-center space-x-2 transition-all duration-300 hover:scale-105 active:scale-95 ${getSizeClass(size)} ${className}`}
            aria-label="Đăng nhập bằng Google"
        >
            {/* Google Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
            </svg>

            {showText && <span>Đăng nhập với Google</span>}
        </button>
    );
};

// Helper function for size classes
function getSizeClass(size: 'sm' | 'md' | 'lg'): string {
    switch (size) {
        case 'sm':
            return 'px-3 py-1.5 text-sm';
        case 'md':
            return 'px-4 py-2 text-base';
        case 'lg':
            return 'px-6 py-3 text-lg';
        default:
            return 'px-4 py-2 text-base';
    }
}

export default GoogleOAuthButton;

import React from 'react';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { User, ChefHat } from 'lucide-react';

interface AuthWrapperProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children, requireAuth = false }) => {
    const { data: session, status } = useSession();
    const isLoading = status === 'loading';

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (requireAuth && !session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-2xl text-center">
                    <ChefHat className="w-16 h-16 mx-auto text-orange-500 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Đăng nhập để tiếp tục
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Vui lòng đăng nhập để trải nghiệm tất cả tính năng
                    </p>
                    <button
                        onClick={() => signIn('google')}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                        <User className="w-5 h-5 mr-2" />
                        Đăng nhập với Google
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthWrapper;

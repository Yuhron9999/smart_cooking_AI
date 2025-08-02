import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChefHat, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const LoginPage: React.FC = () => {
    const router = useRouter();
    const { error } = router.query;

    const handleGoogleSignIn = () => {
        signIn('google', {
            callbackUrl: '/',
            redirect: true
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="relative">
                            <ChefHat className="h-12 w-12 text-orange-500" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
                        Smart Cooking AI
                    </h1>
                    <p className="text-gray-600">
                        Sign in to your account
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">
                            Authentication failed. Please try again.
                        </p>
                    </div>
                )}

                {/* Google Sign In */}
                <div className="space-y-4">
                    <Button
                        onClick={handleGoogleSignIn}
                        className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center py-3"
                    >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </Button>

                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Dont have an account? Sign in with Google to create one automatically.
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <Link
                        href="/"
                        className="flex items-center justify-center text-sm text-orange-600 hover:text-orange-700"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Home
                    </Link>
                </div>

                {/* Development Info */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">
                            🔧 Development Mode - OAuth Setup:
                        </h3>
                        <ul className="text-xs text-blue-700 space-y-1">
                            <li>• Configure Google OAuth in <code>.env.local</code></li>
                            <li>• Set redirect URI: <code>http://localhost:3000/api/auth/callback/google</code></li>
                            <li>• Enable Google+ API in Google Cloud Console</li>
                            <li>• Add test users in OAuth consent screen</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    // Redirect if already authenticated
    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: {
            ...(await serverSideTranslations(context.locale || 'en', ['common'])),
        },
    };
};

export default LoginPage;

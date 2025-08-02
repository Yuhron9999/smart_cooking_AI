import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import {
    AlertCircle,
    ArrowLeft,
    RefreshCw,
    ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AuthErrorPageProps {
    error?: string;
}

const AuthErrorPage: React.FC<AuthErrorPageProps> = ({ error }) => {
    const router = useRouter();

    const errorMessages: Record<string, { title: string; description: string; solution: string }> = {
        'OAuthAccountNotLinked': {
            title: 'Account Already Exists',
            description: 'An account with this email already exists with a different provider.',
            solution: 'Try signing in with the original provider you used.'
        },
        'OAuthCallback': {
            title: 'OAuth Configuration Error',
            description: 'There was an error with the OAuth provider configuration.',
            solution: 'Please check if Google OAuth is properly configured.'
        },
        'Configuration': {
            title: 'Authentication Configuration Error',
            description: 'The authentication system is not properly configured.',
            solution: 'Contact the administrator to fix the configuration.'
        },
        'AccessDenied': {
            title: 'Access Denied',
            description: 'You denied access to the application.',
            solution: 'Grant permission to continue with authentication.'
        },
        'Verification': {
            title: 'Email Verification Required',
            description: 'Please verify your email address.',
            solution: 'Check your email and click the verification link.'
        },
        'Default': {
            title: 'Authentication Error',
            description: 'An unexpected error occurred during authentication.',
            solution: 'Please try again or contact support if the problem persists.'
        }
    };

    const currentError = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

    const handleRetry = () => {
        router.push('/auth/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                {/* Error Icon */}
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>

                {/* Error Details */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        {currentError.title}
                    </h1>
                    <p className="text-gray-600 mb-4">
                        {currentError.description}
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800">
                            <strong>Solution:</strong> {currentError.solution}
                        </p>
                    </div>
                </div>

                {/* Error Code */}
                {error && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-6">
                        <p className="text-sm text-gray-600">
                            <strong>Error Code:</strong> <code className="bg-gray-200 px-2 py-1 rounded text-xs">{error}</code>
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Button
                        onClick={handleRetry}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => router.push('/')}
                        className="w-full flex items-center justify-center"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </div>

                {/* Help Links */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500 text-center mb-4">
                        Need help? Check our setup guide:
                    </p>
                    <div className="flex justify-center">
                        <Link
                            href="/docs/oauth-setup"
                            className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700"
                        >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            OAuth Setup Guide
                        </Link>
                    </div>
                </div>

                {/* Developer Info */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="text-sm font-medium text-yellow-800 mb-2">
                            🔧 Development Mode - Quick Fixes:
                        </h3>
                        <ul className="text-xs text-yellow-700 space-y-1">
                            <li>• Check <code>.env.local</code> for correct Google OAuth credentials</li>
                            <li>• Ensure <code>GOOGLE_CLIENT_ID</code> ends with <code>.apps.googleusercontent.com</code></li>
                            <li>• Verify redirect URIs in Google Cloud Console</li>
                            <li>• Make sure OAuth consent screen is configured</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { error } = context.query;

    return {
        props: {
            error: error as string || null,
            ...(await serverSideTranslations(context.locale || 'en', ['common'])),
        },
    };
};

export default AuthErrorPage;

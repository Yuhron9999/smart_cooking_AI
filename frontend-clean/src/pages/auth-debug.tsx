import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function AuthDebug() {
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Auth Debug - Smart Cooking AI</title>
            </Head>

            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
                            🔍 Authentication Debug Panel
                        </h1>

                        {/* Status Section */}
                        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">📊 Current Status</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-lg border">
                                    <div className="text-sm text-gray-600">Authentication Status</div>
                                    <div className={`text-lg font-semibold ${status === 'authenticated' ? 'text-green-600' :
                                            status === 'loading' ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                        {status}
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg border">
                                    <div className="text-sm text-gray-600">Session State</div>
                                    <div className={`text-lg font-semibold ${session ? 'text-green-600' : 'text-gray-400'
                                        }`}>
                                        {session ? 'Active' : 'None'}
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg border">
                                    <div className="text-sm text-gray-600">Component State</div>
                                    <div className="text-lg font-semibold text-green-600">
                                        {mounted ? 'Mounted' : 'Not Mounted'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Session Data */}
                        {session && (
                            <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
                                <h2 className="text-xl font-semibold mb-4 text-green-800">✅ Session Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <span className="font-medium text-green-700">User Name:</span>
                                        <span className="ml-2 text-green-600">{session.user?.name || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-green-700">Email:</span>
                                        <span className="ml-2 text-green-600">{session.user?.email || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-green-700">Avatar:</span>
                                        {session.user?.image ? (
                                            <img
                                                src={session.user.image}
                                                alt="User Avatar"
                                                className="ml-2 inline-block w-10 h-10 rounded-full"
                                            />
                                        ) : (
                                            <span className="ml-2 text-gray-400">No Image</span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="font-medium text-green-700 mb-2">Full Session Object:</h3>
                                    <pre className="bg-white p-4 rounded border text-sm overflow-x-auto text-gray-700">
                                        {JSON.stringify(session, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {/* No Session */}
                        {!session && status !== 'loading' && (
                            <div className="mb-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                                <h2 className="text-xl font-semibold mb-4 text-yellow-800">⚠️ No Active Session</h2>
                                <p className="text-yellow-700 mb-4">
                                    You are not currently authenticated. This could be due to:
                                </p>
                                <ul className="list-disc list-inside text-yellow-700 space-y-1">
                                    <li>Haven t signed in yet</li>
                                    <li>Session expired</li>
                                    <li>Authentication configuration issues</li>
                                    <li>Network connectivity problems</li>
                                </ul>
                            </div>
                        )}

                        {/* Loading State */}
                        {status === 'loading' && (
                            <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                                <h2 className="text-xl font-semibold mb-4 text-blue-800">🔄 Loading Authentication</h2>
                                <div className="flex items-center space-x-3">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                    <span className="text-blue-700">Checking authentication status...</span>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 justify-center">
                            {!session ? (
                                <>
                                    <button
                                        onClick={() => signIn('google')}
                                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        <span>Sign in with Google</span>
                                    </button>

                                    <button
                                        onClick={() => window.location.href = '/api/auth/signin'}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        NextAuth Sign In Page
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => signOut({ callbackUrl: '/auth-debug' })}
                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Sign Out
                                </button>
                            )}

                            <button
                                onClick={() => window.location.reload()}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Refresh Page
                            </button>
                        </div>

                        {/* Environment Info */}
                        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">🔧 Environment Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Current URL:</span>
                                    <div className="text-gray-600 break-all">{typeof window !== 'undefined' ? window.location.href : 'Server-side'}</div>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">User Agent:</span>
                                    <div className="text-gray-600 break-all">{typeof window !== 'undefined' ? navigator.userAgent : 'Server-side'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Helpful Links */}
                        <div className="mt-8 text-center">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">🔗 Helpful Links</h2>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <a
                                    href="/api/auth/providers"
                                    target="_blank"
                                    className="text-blue-600 hover:text-blue-800 underline"
                                >
                                    View Auth Providers
                                </a>
                                <a
                                    href="/api/auth/session"
                                    target="_blank"
                                    className="text-blue-600 hover:text-blue-800 underline"
                                >
                                    Raw Session Data
                                <Link
                                    href="/"
                                    className="text-blue-600 hover:text-blue-800 underline"
                                >
                                    Back to Home
                                </Link>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const DebugAuth: React.FC = () => {
    const { data: session, status } = useSession();

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">🔧 Auth Debug Page</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Environment Variables */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Environment Variables</h2>
                        <div className="space-y-2 text-sm">
                            <div>
                                <strong>NEXTAUTH_URL:</strong>
                                <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                                    {process.env.NEXTAUTH_URL || 'NOT SET'}
                                </code>
                            </div>
                            <div>
                                <strong>GOOGLE_CLIENT_ID:</strong>
                                <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                                    {process.env.GOOGLE_CLIENT_ID ?
                                        `${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...` :
                                        'NOT SET'
                                    }
                                </code>
                            </div>
                            <div>
                                <strong>GOOGLE_CLIENT_SECRET:</strong>
                                <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                                    {process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET'}
                                </code>
                            </div>
                            <div>
                                <strong>NEXTAUTH_SECRET:</strong>
                                <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                                    {process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET'}
                                </code>
                            </div>
                        </div>
                    </div>

                    {/* Session Info */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Session Status</h2>
                        <div className="space-y-2 text-sm">
                            <div>
                                <strong>Status:</strong>
                                <span className={`ml-2 px-2 py-1 rounded text-white ${status === 'authenticated' ? 'bg-green-500' :
                                        status === 'loading' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}>
                                    {status}
                                </span>
                            </div>
                            {session && (
                                <>
                                    <div>
                                        <strong>User:</strong>
                                        <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                                            {session.user?.name || 'No name'}
                                        </code>
                                    </div>
                                    <div>
                                        <strong>Email:</strong>
                                        <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                                            {session.user?.email || 'No email'}
                                        </code>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* URLs để test */}
                    <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
                        <h2 className="text-lg font-semibold mb-4">Test URLs</h2>
                        <div className="space-y-2">
                            <div>
                                <strong>NextAuth Callback URL:</strong>
                                <code className="ml-2 bg-blue-100 px-2 py-1 rounded text-blue-800">
                                    http://localhost:3000/api/auth/callback/google
                                </code>
                            </div>
                            <div>
                                <strong>Sign In URL:</strong>
                                <code className="ml-2 bg-green-100 px-2 py-1 rounded text-green-800">
                                    http://localhost:3000/api/auth/signin
                                </code>
                            </div>
                            <div>
                                <strong>Session URL:</strong>
                                <code className="ml-2 bg-purple-100 px-2 py-1 rounded text-purple-800">
                                    http://localhost:3000/api/auth/session
                                </code>
                            </div>
                        </div>
                    </div>

                    {/* Google Cloud Console Settings */}
                    <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg md:col-span-2">
                        <h2 className="text-lg font-semibold mb-4 text-yellow-800">
                            ⚠️ Google Cloud Console Required Settings
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <strong className="text-yellow-800">Authorized redirect URIs:</strong>
                                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                    <li><code>http://localhost:3000/api/auth/callback/google</code></li>
                                    <li><code>http://localhost:3001/api/auth/callback/google</code></li>
                                </ul>
                            </div>
                            <div>
                                <strong className="text-yellow-800">Authorized JavaScript origins:</strong>
                                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                    <li><code>http://localhost:3000</code></li>
                                    <li><code>http://localhost:3001</code></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Test Button */}
                <div className="mt-8 text-center">
                    <Link
                        href="/api/auth/signin"
                        className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        🔧 Test Google Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DebugAuth;

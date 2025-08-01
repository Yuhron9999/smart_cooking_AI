// Layout Components - Main Layout wrapper cho Smart Cooking AI
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { LoadingSpinner } from '../ui/Loading';

interface LayoutProps {
    children: React.ReactNode;
    session?: any;
    showSidebar?: boolean;
    showHeader?: boolean;
    showFooter?: boolean;
    className?: string;
    containerClassName?: string;
}

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

const Layout: React.FC<LayoutProps> = ({
    children,
    session,
    showSidebar = true,
    showHeader = true,
    showFooter = true,
    className,
    containerClassName
}) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Handle route change loading
    useEffect(() => {
        const handleRouteChangeStart = () => setIsLoading(true);
        const handleRouteChangeComplete = () => setIsLoading(false);
        const handleRouteChangeError = () => setIsLoading(false);

        router.events.on('routeChangeStart', handleRouteChangeStart);
        router.events.on('routeChangeComplete', handleRouteChangeComplete);
        router.events.on('routeChangeError', handleRouteChangeError);

        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart);
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
            router.events.off('routeChangeError', handleRouteChangeError);
        };
    }, [router]);

    // Check if current page should hide sidebar (like auth pages)
    const authPages = ['/auth/login', '/auth/register', '/auth/forgot-password'];
    const shouldHideSidebar = !showSidebar || authPages.includes(router.pathname);

    return (
        <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
                <div className={cn("min-h-screen bg-gray-50 flex flex-col", className)}>
                    {/* Loading Overlay */}
                    {isLoading && (
                        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
                            <LoadingSpinner
                                size="lg"
                                variant="primary"
                                text="Đang tải..."
                            />
                        </div>
                    )}

                    {/* Header */}
                    {showHeader && <Header />}

                    <div className="flex flex-1">
                        {/* Sidebar */}
                        {!shouldHideSidebar && (
                            <Sidebar
                                collapsed={sidebarCollapsed}
                                onCollapsedChange={setSidebarCollapsed}
                                className="hidden lg:flex"
                            />
                        )}

                        {/* Main Content */}
                        <main className={cn(
                            "flex-1 flex flex-col",
                            !shouldHideSidebar && "lg:ml-0", // Sidebar handles its own width
                            containerClassName
                        )}>
                            <div className="flex-1 overflow-auto">
                                {children}
                            </div>
                        </main>
                    </div>

                    {/* Footer */}
                    {showFooter && <Footer />}

                    {/* Toast Notifications */}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                                borderRadius: '10px',
                                padding: '16px',
                            },
                            success: {
                                duration: 3000,
                                iconTheme: {
                                    primary: '#10B981',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                duration: 5000,
                                iconTheme: {
                                    primary: '#EF4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                </div>
            </QueryClientProvider>
        </SessionProvider>
    );
};

// Auth Layout - Simplified layout for authentication pages
interface AuthLayoutProps {
    children: React.ReactNode;
    session?: any;
    title?: string;
    description?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    session,
    title,
    description
}) => {
    return (
        <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
                <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        {/* Logo */}
                        <div className="flex justify-center">
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM9 16V9h2v7H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                                        Smart Cooking AI
                                    </h1>
                                </div>
                            </div>
                        </div>

                        {title && (
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                {title}
                            </h2>
                        )}

                        {description && (
                            <p className="mt-2 text-center text-sm text-gray-600">
                                {description}
                            </p>
                        )}
                    </div>

                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
                            {children}
                        </div>
                    </div>

                    {/* Toast Notifications */}
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                                borderRadius: '10px',
                                padding: '16px',
                            },
                        }}
                    />
                </div>
            </QueryClientProvider>
        </SessionProvider>
    );
};

// Dashboard Layout - Special layout for dashboard pages
interface DashboardLayoutProps {
    children: React.ReactNode;
    session?: any;
    title?: string;
    breadcrumbs?: Array<{ name: string; href?: string }>;
    actions?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    session,
    title,
    breadcrumbs,
    actions
}) => {
    return (
        <Layout session={session} showSidebar={true}>
            <div className="p-6">
                {/* Page Header */}
                {(title || breadcrumbs || actions) && (
                    <div className="mb-8">
                        {/* Breadcrumbs */}
                        {breadcrumbs && breadcrumbs.length > 0 && (
                            <nav className="flex mb-4" aria-label="Breadcrumb">
                                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                    {breadcrumbs.map((item, index) => (
                                        <li key={index} className="inline-flex items-center">
                                            {index > 0 && (
                                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            {item.href ? (
                                                <a href={item.href} className="ml-1 text-sm font-medium text-gray-700 hover:text-gray-900 md:ml-2">
                                                    {item.name}
                                                </a>
                                            ) : (
                                                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                                                    {item.name}
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        )}

                        {/* Title and Actions */}
                        <div className="flex justify-between items-center">
                            {title && (
                                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                            )}
                            {actions && <div className="flex space-x-3">{actions}</div>}
                        </div>
                    </div>
                )}

                {/* Page Content */}
                {children}
            </div>
        </Layout>
    );
};

export default Layout;
export { AuthLayout, DashboardLayout };

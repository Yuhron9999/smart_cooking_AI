import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import MainNavbar from './MainNavbar';
import NotificationSystem from '../NotificationSystem';

interface EnhancedLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
    pageIcon?: LucideIcon;
    pageTitle: string;
    pageSubtitle?: string;
    navbarTheme?: 'default' | 'glass' | 'gradient' | 'dark';
    showBackButton?: boolean;
    backButtonHref?: string;
    actions?: React.ReactNode;
    className?: string;
    useBuiltInNavbar?: boolean; // Toggle between custom header and MainNavbar
}

const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({
    children,
    title,
    description,
    pageIcon: PageIcon,
    pageTitle,
    pageSubtitle,
    navbarTheme = 'default',
    showBackButton = false,
    backButtonHref = '/',
    actions,
    className = '',
    useBuiltInNavbar = false
}) => {
    const router = useRouter();

    const handleBackClick = () => {
        if (backButtonHref) {
            router.push(backButtonHref);
        } else {
            router.back();
        }
    };

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={`min-h-screen ${className}`}>
                {/* Conditional Navbar */}
                {useBuiltInNavbar ? (
                    <MainNavbar
                        pageIcon={PageIcon}
                        pageTitle={pageTitle}
                        pageSubtitle={pageSubtitle}
                        showBackButton={showBackButton}
                        backButtonHref={backButtonHref}
                        actions={actions}
                        theme={navbarTheme}
                    />
                ) : (
                    <header className={`
                        ${navbarTheme === 'glass'
                            ? 'bg-white/80 backdrop-blur-md border-b border-white/20'
                            : navbarTheme === 'gradient'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                : navbarTheme === 'dark'
                                    ? 'bg-gray-900 text-white border-b border-gray-700'
                                    : 'bg-white border-b border-gray-200'
                        }
                        sticky top-0 z-50
                    `}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between h-16">
                                {/* Left side - Back button + Title */}
                                <div className="flex items-center space-x-4">
                                    {showBackButton && (
                                        <button
                                            onClick={handleBackClick}
                                            title="Quay lại"
                                            className={`p-2 rounded-lg transition-colors ${navbarTheme === 'dark' || navbarTheme === 'gradient'
                                                    ? 'hover:bg-white/10'
                                                    : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            <ArrowLeft className={`w-5 h-5 ${navbarTheme === 'dark' || navbarTheme === 'gradient'
                                                    ? 'text-white'
                                                    : 'text-gray-600'
                                                }`} />
                                        </button>
                                    )}

                                    <div className="flex items-center space-x-3">
                                        {PageIcon && (
                                            <div className={`p-2 rounded-lg ${navbarTheme === 'gradient'
                                                    ? 'bg-white/20'
                                                    : navbarTheme === 'dark'
                                                        ? 'bg-gray-700'
                                                        : 'bg-blue-100'
                                                }`}>
                                                <PageIcon className={`w-6 h-6 ${navbarTheme === 'dark' || navbarTheme === 'gradient'
                                                        ? 'text-white'
                                                        : 'text-blue-600'
                                                    }`} />
                                            </div>
                                        )}
                                        <div>
                                            <h1 className={`text-lg font-semibold ${navbarTheme === 'dark' || navbarTheme === 'gradient'
                                                    ? 'text-white'
                                                    : 'text-gray-900'
                                                }`}>
                                                {pageTitle}
                                            </h1>
                                            {pageSubtitle && (
                                                <p className={`text-sm ${navbarTheme === 'dark' || navbarTheme === 'gradient'
                                                        ? 'text-gray-300'
                                                        : 'text-gray-500'
                                                    }`}>
                                                    {pageSubtitle}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right side - Actions */}
                                {actions && (
                                    <div className="flex items-center space-x-2">
                                        {actions}
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>
                )}

                {/* Main content */}
                <main className="flex-1">
                    {children}
                </main>

                {/* Notification System */}
                <NotificationSystem />
            </div>
        </>
    );
};

export default EnhancedLayout;

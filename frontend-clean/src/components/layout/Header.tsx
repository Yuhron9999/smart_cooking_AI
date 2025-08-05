// Professional Header Component with Authentication  
import React, { useState } from 'react';
import { signOut, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
    ChefHat,
    User,
    Settings,
    LogOut,
    Search,
    Menu,
    X,
    Sparkles,
    Mic,
    Globe,
    Heart,
    Home,
    Camera
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Dynamic import để tránh SSR issues  
const AuthWrapper = dynamic(() => import('@/components/auth/AuthWrapper'), {
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-200 rounded h-8 w-20"></div>
});

interface HeaderProps {
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const router = useRouter();

    // Fallback translations để tránh lỗi i18n context
    const fallbackTranslations = {
        'navigation.home': 'Trang Chủ',
        'navigation.recipes': 'Công Thức',
        'navigation.ai_chat': 'AI Chat',
        'navigation.profile': 'Hồ Sơ',
        'navigation.voice': 'Voice Chef',
        'recipe.search_placeholder': 'Tìm công thức...',
        'profile.title': 'Hồ Sơ',
        'profile.favorite_recipes': 'Yêu Thích',
        'profile.settings': 'Cài Đặt',
        'auth.logout': 'Đăng Xuất',
        'auth.login': 'Đăng Nhập',
        'auth.register': 'Đăng Ký'
    };

    const t = (key: string) => fallbackTranslations[key as keyof typeof fallbackTranslations] || key;

    const navigation = [
        { name: 'Trang chủ', href: '/dashboard', icon: Home },
        { name: 'Công thức', href: '/recipes', icon: ChefHat },
        { name: 'AI Assistant', href: '/ai-chat', icon: Sparkles },
        { name: 'Voice Chef', href: '/voice-assistant', icon: Mic },
        { name: 'Nhận dạng ảnh', href: '/image-recognition', icon: Camera },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className={cn("bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40", className)}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/dashboard" className="flex items-center space-x-2 group">
                            <div className="relative">
                                <ChefHat className="h-8 w-8 text-orange-500 group-hover:text-orange-600 transition-colors" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full animate-pulse"></div>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                                Smart Cooking AI
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = router.pathname === item.href;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        isActive
                                            ? "text-orange-600 bg-orange-50"
                                            : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Search Bar */}
                    <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
                        <form onSubmit={handleSearch} className="w-full">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={t('recipe.search_placeholder') || 'Search recipes...'}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                        </form>
                    </div>

                    {/* Right side buttons */}
                    <div className="flex items-center space-x-4">
                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                                title={t('header.language_switcher') || 'Switch language'}
                            >
                                <Globe className="h-5 w-5" />
                            </button>
                        </div>

                        {/* User Menu */}
                        <AuthWrapper>
                            {(session, isLoading) => {
                                if (isLoading) {
                                    return <div className="animate-pulse bg-gray-200 rounded h-8 w-20"></div>;
                                }

                                return session ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            {session.user?.image ? (
                                                <Image
                                                    src={session.user.image}
                                                    alt={session.user.name || ''}
                                                    width={32}
                                                    height={32}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                                                    <User className="h-4 w-4 text-white" />
                                                </div>
                                            )}
                                            <span className="hidden sm:block text-sm font-medium text-gray-700">
                                                {session.user?.name}
                                            </span>
                                        </button>

                                        {/* User Dropdown */}
                                        {isUserMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <User className="h-4 w-4 mr-2" />
                                                    {t('profile.title') || 'Profile'}
                                                </Link>
                                                <Link
                                                    href="/favorites"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <Heart className="h-4 w-4 mr-2" />
                                                    {t('profile.favorite_recipes') || 'Favorites'}
                                                </Link>
                                                <Link
                                                    href="/settings"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <Settings className="h-4 w-4 mr-2" />
                                                    {t('profile.settings') || 'Settings'}
                                                </Link>
                                                <hr className="my-1" />
                                                <button
                                                    onClick={() => signOut({ callbackUrl: '/' })}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                >
                                                    <LogOut className="h-4 w-4 mr-2" />
                                                    {t('auth.logout') || 'Logout'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => signIn('google')}
                                            className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                        >
                                            {t('auth.login') || 'Login'}
                                        </button>
                                        <button
                                            onClick={() => signIn('google')}
                                            className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-lg transition-colors font-medium"
                                        >
                                            {t('auth.register') || 'Register'}
                                        </button>
                                    </div>
                                );
                            }}
                        </AuthWrapper>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-4 py-4 space-y-4">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={t('recipe.search_placeholder') || 'Search recipes...'}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                        </form>

                        {/* Mobile Navigation Links */}
                        <nav className="space-y-2">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = router.pathname === item.href;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors",
                                            isActive
                                                ? "text-orange-600 bg-orange-50"
                                                : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                                        )}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
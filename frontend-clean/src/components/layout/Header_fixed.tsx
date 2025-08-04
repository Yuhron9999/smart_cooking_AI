// Professional Header Component with Authentication  
import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
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
    Book,
    MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface HeaderProps {
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const router = useRouter();
    const { data: session } = useSession();

    // Fallback translations để tránh lỗi i18n context
    const translations = {
        'navigation.home': 'Trang Chủ',
        'navigation.recipes': 'Công Thức',
        'navigation.ai_chat': 'Trợ Lý AI',
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

    const t = (key: string) => translations[key as keyof typeof translations] || key;

    const navigation = [
        { name: translations['navigation.home'], href: '/', icon: Home },
        { name: translations['navigation.recipes'], href: '/recipes', icon: Book },
        { name: translations['navigation.ai_chat'], href: '/ai-chat', icon: MessageCircle },
        { name: translations['navigation.voice'], href: '/voice-assistant', icon: Mic },
        { name: translations['navigation.profile'], href: '/profile', icon: User },
        { name: '🧪 AI Test', href: '/simple-ai-test', icon: ChefHat }
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleSignOut = async () => {
        await signOut({ redirect: true, callbackUrl: '/' });
    };

    return (
        <header className={cn("bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40", className)}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2 group">
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
                                    placeholder={t('recipe.search_placeholder')}
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
                            <Button variant="ghost" size="sm" className="text-gray-600">
                                <Globe className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* User Menu */}
                        {session ? (
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
                                        >
                                            <User className="h-4 w-4 mr-2" />
                                            {t('profile.title')}
                                        </Link>
                                        <Link
                                            href="/favorites"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <Heart className="h-4 w-4 mr-2" />
                                            {t('profile.favorite_recipes')}
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <Settings className="h-4 w-4 mr-2" />
                                            {t('profile.settings')}
                                        </Link>
                                        <hr className="my-1" />
                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            {t('auth.logout')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => router.push('/auth/signin')}
                                >
                                    {t('auth.login')}
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => router.push('/auth/signin')}
                                >
                                    {t('auth.register')}
                                </Button>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
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
                                    placeholder={t('recipe.search_placeholder')}
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

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ChefHat,
    Menu,
    X,
    Search,
    User,
    Bell,
    Settings,
    BookOpen,
    Sparkles,
    Mic,
    Heart
} from 'lucide-react';

interface NavigationProps {
    className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigation = [
        { name: 'Trang chủ', href: '/', icon: ChefHat },
        { name: 'Công thức', href: '/recipes', icon: BookOpen },
        { name: 'AI Assistant', href: '/ai', icon: Sparkles },
        { name: 'Voice Chef', href: '/voice', icon: Mic },
        { name: 'Yêu thích', href: '/favorites', icon: Heart },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
                : 'bg-transparent'
            } ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <ChefHat className="h-6 w-6 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                                <Sparkles className="h-2 w-2 text-white" />
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                                Smart Cooking
                            </h1>
                            <p className="text-xs text-gray-500 -mt-1">AI Powered</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="group relative px-4 py-2 rounded-lg text-gray-700 hover:text-orange-600 transition-colors duration-200"
                                >
                                    <div className="flex items-center space-x-2">
                                        <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Tìm công thức, nguyên liệu..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-3">
                        {/* Notifications */}
                        <button
                            className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                            title="Thông báo"
                            aria-label="Xem thông báo"
                        >
                            <Bell className="h-5 w-5" />
                            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                        </button>

                        {/* Settings */}
                        <button
                            className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                            title="Cài đặt"
                            aria-label="Mở cài đặt"
                        >
                            <Settings className="h-5 w-5" />
                        </button>

                        {/* User Profile */}
                        <div className="relative group">
                            <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200">
                                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-white" />
                                </div>
                                <span className="hidden lg:block font-medium">John Doe</span>
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="p-3 border-b border-gray-100">
                                    <p className="font-semibold text-gray-900">John Doe</p>
                                    <p className="text-sm text-gray-500">john@example.com</p>
                                </div>
                                <div className="p-2">
                                    <Link href="/profile" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                        Hồ sơ cá nhân
                                    </Link>
                                    <Link href="/settings" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                        Cài đặt
                                    </Link>
                                    <Link href="/help" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                        Trợ giúp
                                    </Link>
                                    <hr className="my-2" />
                                    <button className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden pb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
                    <div className="px-4 py-4 space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;

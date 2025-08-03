// Simplified Header Component - Testing Version
import React from 'react';
import Link from 'next/link';
import { ChefHat, Home, User, Sparkles, Mic, Heart } from 'lucide-react';

export default function Header() {
    return (
        <header className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <ChefHat className="h-8 w-8 text-orange-500" />
                        <span className="text-xl font-bold text-gray-900">Smart Cooking AI</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors">
                            <Home className="h-4 w-4" />
                            <span>Trang chủ</span>
                        </Link>
                        <Link href="/recipes" className="text-gray-700 hover:text-orange-500 transition-colors">
                            Công thức
                        </Link>
                        <Link href="/ai-chat" className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors">
                            <Sparkles className="h-4 w-4" />
                            <span>AI Chat</span>
                        </Link>
                        <Link href="/voice" className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors">
                            <Mic className="h-4 w-4" />
                            <span>Voice</span>
                        </Link>
                        <Link href="/favorites" className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors">
                            <Heart className="h-4 w-4" />
                            <span>Yêu thích</span>
                        </Link>
                        <Link href="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors">
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                    </nav>

                    {/* Auth placeholder */}
                    <div className="flex items-center space-x-4">
                        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                            Đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

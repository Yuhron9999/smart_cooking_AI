// Professional Header Component with Authentication
import React, { useState, Fragment } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import {
    ChefHat,
    User,
    Settings,
    LogOut,
    Bell,
    Search,
    Menu as MenuIcon,
    X,
    BookOpen,
    Sparkles,
    Mic
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const Header: React.FC = () => {
    const { data: session, status } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Trang Chủ', href: '/', icon: ChefHat },
        { name: 'Công Thức', href: '/recipes', icon: BookOpen },
        { name: 'Học Nấu Ăn', href: '/learn', icon: BookOpen },
        { name: 'Trợ Lý AI', href: '/ai-assistant', icon: Sparkles },
        { name: 'Voice Chef', href: '/voice', icon: Mic },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                                <ChefHat className="w-6 h-6 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                                    Smart Cooking AI
                                </h1>
                                <p className="text-xs text-gray-500 -mt-1">Your AI Chef Assistant</p>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 flex items-center space-x-2"
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Tìm công thức, nguyên liệu..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-sm"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    {/* Right Side - Auth & Profile */}
                    <div className="flex items-center space-x-4">
                        {status === "loading" ? (
                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                        ) : session ? (
                            <>
                                {/* Notifications */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                >
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                                </motion.button>

                                {/* Profile Dropdown */}
                                <Menu as="div" className="relative">
                                    <Menu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Image
                                            src={session.user?.image || '/default-avatar.svg'}
                                            alt={session.user?.name || ''}
                                            width={32}
                                            height={32}
                                            className="w-8 h-8 rounded-full border-2 border-orange-200"
                                        />
                                        <div className="hidden md:block text-left">
                                            <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                                                {session.user?.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Chef Level 5
                                            </p>
                                        </div>
                                    </Menu.Button>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="p-3 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                                            </div>

                                            <div className="py-1">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link
                                                            href="/profile"
                                                            className={`${active ? 'bg-orange-50 text-orange-600' : 'text-gray-700'} 
                                flex items-center px-4 py-2 text-sm transition-colors`}
                                                        >
                                                            <User className="w-4 h-4 mr-3" />
                                                            Hồ Sơ Cá Nhân
                                                        </Link>
                                                    )}
                                                </Menu.Item>

                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link
                                                            href="/settings"
                                                            className={`${active ? 'bg-orange-50 text-orange-600' : 'text-gray-700'} 
                                flex items-center px-4 py-2 text-sm transition-colors`}
                                                        >
                                                            <Settings className="w-4 h-4 mr-3" />
                                                            Cài Đặt
                                                        </Link>
                                                    )}
                                                </Menu.Item>

                                                <hr className="my-1 border-gray-100" />

                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={() => signOut()}
                                                            className={`${active ? 'bg-red-50 text-red-600' : 'text-gray-700'} 
                                flex items-center w-full px-4 py-2 text-sm transition-colors`}
                                                        >
                                                            <LogOut className="w-4 h-4 mr-3" />
                                                            Đăng Xuất
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => signIn('google')}
                                    className="hidden sm:flex"
                                >
                                    Đăng Nhập
                                </Button>
                                <Button
                                    variant="gradient"
                                    size="sm"
                                    onClick={() => signIn('google')}
                                >
                                    Bắt Đầu Miễn Phí
                                </Button>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <MenuIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <Transition
                show={mobileMenuOpen}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <div className="lg:hidden border-t border-gray-200 bg-white">
                    <div className="px-4 py-3 space-y-1">
                        {/* Mobile Search */}
                        <div className="mb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-sm"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        {/* Mobile Navigation Items */}
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center space-x-3 px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        ))}

                        {/* Mobile Auth */}
                        {!session && (
                            <div className="pt-4 border-t border-gray-200 space-y-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => signIn('google')}
                                    className="w-full justify-center"
                                >
                                    Đăng Nhập
                                </Button>
                                <Button
                                    variant="gradient"
                                    size="sm"
                                    onClick={() => signIn('google')}
                                    className="w-full justify-center"
                                >
                                    Bắt Đầu Miễn Phí
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Transition>
        </header>
    );
};

export default Header;

// Layout Components - Sidebar Navigation cho Smart Cooking AI
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';
import {
    ChefHat,
    Home,
    Search,
    Heart,
    BookOpen,
    Sparkles,
    Mic,
    User,
    Settings,
    ChevronLeft,
    ChevronRight,
    PlusCircle,
    TrendingUp,
    Clock,
    Star,
    Globe
} from 'lucide-react';

interface SidebarProps {
    className?: string;
    collapsed?: boolean;
    onCollapsedChange?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    className,
    collapsed = false,
    onCollapsedChange
}) => {
    const router = useRouter();
    const { t } = useTranslation('common');

    const mainNavigation = [
        {
            name: t('navigation.home'),
            href: '/',
            icon: Home,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 hover:bg-blue-100'
        },
        {
            name: t('navigation.recipes'),
            href: '/recipes',
            icon: ChefHat,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50 hover:bg-orange-100'
        },
        {
            name: t('navigation.ai_assistant'),
            href: '/ai',
            icon: Sparkles,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 hover:bg-purple-100'
        },
        {
            name: t('navigation.learning'),
            href: '/learning',
            icon: BookOpen,
            color: 'text-green-600',
            bgColor: 'bg-green-50 hover:bg-green-100'
        },
        {
            name: t('navigation.voice'),
            href: '/voice',
            icon: Mic,
            color: 'text-red-600',
            bgColor: 'bg-red-50 hover:bg-red-100'
        },
    ];

    const quickActions = [
        {
            name: 'Tìm kiếm',
            href: '/search',
            icon: Search,
            color: 'text-gray-600'
        },
        {
            name: 'Yêu thích',
            href: '/favorites',
            icon: Heart,
            color: 'text-pink-600'
        },
        {
            name: 'Tạo công thức',
            href: '/recipes/create',
            icon: PlusCircle,
            color: 'text-emerald-600'
        },
    ];

    const discoverSections = [
        {
            name: 'Xu hướng',
            href: '/trending',
            icon: TrendingUp,
            count: 24,
            color: 'text-yellow-600'
        },
        {
            name: 'Mới nhất',
            href: '/latest',
            icon: Clock,
            count: 156,
            color: 'text-indigo-600'
        },
        {
            name: 'Đánh giá cao',
            href: '/top-rated',
            icon: Star,
            count: 89,
            color: 'text-amber-600'
        },
    ];

    const regions = [
        { name: 'Miền Bắc', href: '/regions/north', flag: '🏔️' },
        { name: 'Miền Trung', href: '/regions/central', flag: '🏖️' },
        { name: 'Miền Nam', href: '/regions/south', flag: '🌴' },
        { name: 'Quốc tế', href: '/regions/international', flag: '🌍' },
    ];

    const toggleCollapsed = () => {
        onCollapsedChange?.(!collapsed);
    };

    return (
        <aside className={cn(
            "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
            collapsed ? "w-16" : "w-64",
            className
        )}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    {!collapsed && (
                        <div className="flex items-center space-x-2">
                            <ChefHat className="h-6 w-6 text-orange-500" />
                            <span className="font-semibold text-gray-900">Smart Cooking</span>
                        </div>
                    )}
                    <button
                        onClick={toggleCollapsed}
                        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        {collapsed ? (
                            <ChevronRight className="h-4 w-4 text-gray-600" />
                        ) : (
                            <ChevronLeft className="h-4 w-4 text-gray-600" />
                        )}
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
                {/* Main Navigation */}
                <nav className="px-2 space-y-1">
                    {mainNavigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = router.pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all",
                                    isActive
                                        ? `${item.color} ${item.bgColor}`
                                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                )}
                                title={collapsed ? item.name : undefined}
                            >
                                <Icon className={cn(
                                    "flex-shrink-0 h-5 w-5",
                                    collapsed ? "mx-auto" : "mr-3"
                                )} />
                                {!collapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Quick Actions */}
                {!collapsed && (
                    <div className="mt-8 px-4">
                        <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Thao tác nhanh
                        </h3>
                        <nav className="mt-2 space-y-1">
                            {quickActions.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="group flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                    >
                                        <Icon className={cn("mr-3 h-4 w-4", item.color)} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                )}

                {/* Discover Section */}
                {!collapsed && (
                    <div className="mt-8 px-4">
                        <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Khám phá
                        </h3>
                        <nav className="mt-2 space-y-1">
                            {discoverSections.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="group flex items-center justify-between px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center">
                                            <Icon className={cn("mr-3 h-4 w-4", item.color)} />
                                            <span>{item.name}</span>
                                        </div>
                                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                            {item.count}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                )}

                {/* Regional Cuisine */}
                {!collapsed && (
                    <div className="mt-8 px-4">
                        <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                            <Globe className="h-3 w-3 mr-1" />
                            Ẩm thực vùng miền
                        </h3>
                        <nav className="mt-2 space-y-1">
                            {regions.map((region) => (
                                <Link
                                    key={region.name}
                                    href={region.href}
                                    className="group flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                >
                                    <span className="mr-3 text-lg">{region.flag}</span>
                                    <span>{region.name}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-200 p-4">
                {!collapsed ? (
                    <div className="space-y-2">
                        <Link
                            href="/profile"
                            className="flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                            <User className="mr-3 h-4 w-4 text-gray-600" />
                            {t('profile.title')}
                        </Link>
                        <Link
                            href="/settings"
                            className="flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                            <Settings className="mr-3 h-4 w-4 text-gray-600" />
                            {t('navigation.settings')}
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Link
                            href="/profile"
                            className="flex justify-center p-2 text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors"
                            title={t('profile.title')}
                        >
                            <User className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/settings"
                            className="flex justify-center p-2 text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors"
                            title={t('navigation.settings')}
                        >
                            <Settings className="h-4 w-4" />
                        </Link>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;

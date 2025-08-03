import React, { useState, useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Header from '@/components/layout/Header_fixed';
import {
    ChefHat, Sparkles, Mic, Camera, BookOpen, Heart, User, Settings,
    Clock, Star, Users, ArrowRight, Plus
} from 'lucide-react';

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        }
    }, [status, router]);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Chào buổi sáng');
        } else if (hour < 18) {
            setGreeting('Chào buổi chiều');
        } else {
            setGreeting('Chào buổi tối');
        }
    }, []);

    const quickActions = [
        {
            title: 'Tạo công thức AI',
            description: 'Tạo công thức từ nguyên liệu',
            icon: <Sparkles className="h-6 w-6" />,
            color: 'from-blue-500 to-blue-600',
            href: '/ai/generate-recipe'
        },
        {
            title: 'Nhận dạng món ăn',
            description: 'Chụp ảnh để nhận dạng',
            icon: <Camera className="h-6 w-6" />,
            color: 'from-green-500 to-green-600',
            href: '/ai/image-recognition'
        },
        {
            title: 'Trợ lý giọng nói',
            description: 'Chat bằng giọng nói',
            icon: <Mic className="h-6 w-6" />,
            color: 'from-purple-500 to-purple-600',
            href: '/voice'
        },
        {
            title: 'Lộ trình học',
            description: 'Học nấu ăn từ cơ bản',
            icon: <BookOpen className="h-6 w-6" />,
            color: 'from-orange-500 to-orange-600',
            href: '/learning'
        }
    ];

    const recentRecipes = [
        { id: 1, name: 'Phở Hà Nội', time: '2 giờ trước', rating: 4.8 },
        { id: 2, name: 'Bánh xèo miền Tây', time: '1 ngày trước', rating: 4.9 },
        { id: 3, name: 'Bún bò Huế', time: '3 ngày trước', rating: 4.7 }
    ];

    const stats = [
        { label: 'Công thức đã tạo', value: '24', icon: <ChefHat className="h-5 w-5" /> },
        { label: 'Giờ học', value: '12h', icon: <Clock className="h-5 w-5" /> },
        { label: 'Điểm thành tích', value: '1,250', icon: <Star className="h-5 w-5" /> },
        { label: 'Cộng đồng', value: '45', icon: <Users className="h-5 w-5" /> }
    ];

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <>
            <Head>
                <title>Dashboard - Smart Cooking AI</title>
                <meta name="description" content="Dashboard Smart Cooking AI - Quản lý học tập và nấu ăn thông minh" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
                <Header />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {greeting}, {session.user?.name?.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Sẵn sàng khám phá thế giới nấu ăn thông minh hôm nay chưa?
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">
                                            {stat.label}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white">
                                        {stat.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Hành động nhanh</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => router.push(action.href)}
                                    className="group bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-left"
                                >
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                        {action.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {action.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        {action.description}
                                    </p>
                                    <div className="flex items-center text-orange-600 text-sm font-medium">
                                        <span>Bắt đầu</span>
                                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Recent Recipes */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">📝 Công thức gần đây</h2>
                                    <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                                        Xem tất cả
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {recentRecipes.map((recipe) => (
                                        <div
                                            key={recipe.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center">
                                                    <ChefHat className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{recipe.name}</h3>
                                                    <p className="text-sm text-gray-500">{recipe.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                <span className="text-sm font-medium text-gray-700">{recipe.rating}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-orange-300 hover:text-orange-600 transition-colors flex items-center justify-center space-x-2">
                                    <Plus className="h-5 w-5" />
                                    <span>Tạo công thức mới</span>
                                </button>
                            </div>
                        </div>

                        {/* Learning Progress */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">📚 Tiến độ học</h2>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">Nấu ăn cơ bản</span>
                                            <span className="text-sm text-gray-500">75%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full w-3/4"></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">Món Việt truyền thống</span>
                                            <span className="text-sm text-gray-500">45%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full w-2/5"></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">Kỹ thuật nâng cao</span>
                                            <span className="text-sm text-gray-500">20%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full w-1/5"></div>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors">
                                    Tiếp tục học
                                </button>
                            </div>

                            {/* Quick Links */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">🔗 Liên kết nhanh</h2>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => router.push('/profile')}
                                        className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <User className="h-5 w-5 text-gray-400" />
                                        <span className="text-gray-700">Hồ sơ cá nhân</span>
                                    </button>

                                    <button
                                        onClick={() => router.push('/favorites')}
                                        className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <Heart className="h-5 w-5 text-gray-400" />
                                        <span className="text-gray-700">Yêu thích</span>
                                    </button>

                                    <button
                                        onClick={() => router.push('/settings')}
                                        className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <Settings className="h-5 w-5 text-gray-400" />
                                        <span className="text-gray-700">Cài đặt</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: false,
            },
        };
    }

    return {
        props: {
            session,
        },
    };
};

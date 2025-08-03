import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import {
    ChefHat,
    Sparkles,
    Camera,
    Mic,
    BookOpen,
    Heart,
    TrendingUp,
    Clock,
    Star,
    Users,
    Award,
    Target,
    Play,
    ArrowRight,
    Settings,
    Bell,
    Search
} from 'lucide-react';

interface DashboardProps {
    user: any;
}

export default function Dashboard({ user }: DashboardProps) {
    const { data: session, status } = useSession();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Chào buổi sáng';
        if (hour < 18) return 'Chào buổi chiều';
        return 'Chào buổi tối';
    };

    const quickActions = [
        {
            title: 'Tạo công thức AI',
            description: 'Tạo món ăn từ nguyên liệu có sẵn',
            icon: <Sparkles className="h-6 w-6" />,
            color: 'from-blue-500 to-blue-600',
            href: '/ai/recipe-generator',
            badge: 'AI'
        },
        {
            title: 'Nhận dạng món ăn',
            description: 'Chụp ảnh để nhận dạng món ăn',
            icon: <Camera className="h-6 w-6" />,
            color: 'from-green-500 to-green-600',
            href: '/ai/food-recognition',
            badge: 'Camera'
        },
        {
            title: 'Trợ lý giọng nói',
            description: 'Nói chuyện với AI về nấu ăn',
            icon: <Mic className="h-6 w-6" />,
            color: 'from-purple-500 to-purple-600',
            href: '/voice-assistant',
            badge: 'Voice'
        },
        {
            title: 'Lộ trình học',
            description: 'Học nấu ăn từ cơ bản đến nâng cao',
            icon: <BookOpen className="h-6 w-6" />,
            color: 'from-orange-500 to-orange-600',
            href: '/learning-path',
            badge: 'Learning'
        }
    ];

    const recentActivities = [
        {
            type: 'recipe',
            title: 'Công thức Phở Bò đã được tạo',
            time: '2 giờ trước',
            icon: <ChefHat className="h-4 w-4" />,
            color: 'text-orange-500'
        },
        {
            type: 'ai_chat',
            title: 'Đã chat với AI về món Bún Chả',
            time: '5 giờ trước',
            icon: <Sparkles className="h-4 w-4" />,
            color: 'text-blue-500'
        },
        {
            type: 'voice',
            title: 'Sử dụng Voice Assistant',
            time: '1 ngày trước',
            icon: <Mic className="h-4 w-4" />,
            color: 'text-purple-500'
        },
        {
            type: 'learning',
            title: 'Hoàn thành bài học "Cắt rau cơ bản"',
            time: '2 ngày trước',
            icon: <Award className="h-4 w-4" />,
            color: 'text-green-500'
        }
    ];

    const stats = [
        {
            label: 'Công thức đã tạo',
            value: '12',
            icon: <ChefHat className="h-5 w-5" />,
            color: 'text-orange-500',
            change: '+3 tuần này'
        },
        {
            label: 'Bài học hoàn thành',
            value: '8',
            icon: <BookOpen className="h-5 w-5" />,
            color: 'text-blue-500',
            change: '+2 tuần này'
        },
        {
            label: 'Món yêu thích',
            value: '24',
            icon: <Heart className="h-5 w-5" />,
            color: 'text-red-500',
            change: '+5 tuần này'
        },
        {
            label: 'Điểm kinh nghiệm',
            value: '1,250',
            icon: <Star className="h-5 w-5" />,
            color: 'text-yellow-500',
            change: '+120 tuần này'
        }
    ];

    const suggestedRecipes = [
        {
            title: 'Bún Bò Huế',
            image: '/images/bun-bo-hue.jpg',
            difficulty: 'Trung bình',
            time: '45 phút',
            rating: 4.8,
            region: 'Miền Trung'
        },
        {
            title: 'Bánh Xèo Miền Tây',
            image: '/images/banh-xeo.jpg',
            difficulty: 'Dễ',
            time: '30 phút',
            rating: 4.9,
            region: 'Miền Nam'
        },
        {
            title: 'Chả Cá Lã Vọng',
            image: '/images/cha-ca.jpg',
            difficulty: 'Khó',
            time: '60 phút',
            rating: 4.7,
            region: 'Miền Bắc'
        }
    ];

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Dashboard - Smart Cooking AI</title>
                <meta name="description" content="Dashboard quản lý hoạt động nấu ăn với AI" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo */}
                            <Link href="/" className="flex items-center space-x-2">
                                <ChefHat className="h-8 w-8 text-orange-500" />
                                <span className="text-xl font-bold text-gray-900">Smart Cooking AI</span>
                            </Link>

                            {/* Search Bar */}
                            <div className="hidden md:flex flex-1 max-w-lg mx-8">
                                <div className="relative w-full">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm công thức, nguyên liệu..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>
                            </div>

                            {/* User Menu */}
                            <div className="flex items-center space-x-4">
                                <button
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                    title="Thông báo"
                                >
                                    <Bell className="h-5 w-5" />
                                </button>
                                <button
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                    title="Cài đặt"
                                >
                                    <Settings className="h-5 w-5" />
                                </button>
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={session?.user?.image || '/images/default-avatar.png'}
                                        alt="Avatar"
                                        className="h-8 w-8 rounded-full"
                                    />
                                    <div className="hidden md:block">
                                        <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                                        <p className="text-xs text-gray-500">Chef Level 2</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-lg hover:bg-gray-100"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {getGreeting()}, {session?.user?.name?.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-gray-600">
                            Sẵn sàng khám phá những món ăn mới hôm nay chưa?
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                                        {stat.icon}
                                    </div>
                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                        {stat.change}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hành động nhanh</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {quickActions.map((action, index) => (
                                <Link
                                    key={index}
                                    href={action.href}
                                    className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} text-white group-hover:scale-110 transition-transform`}>
                                            {action.icon}
                                        </div>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                            {action.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                                    <div className="flex items-center text-orange-600 text-sm font-medium">
                                        <span>Bắt đầu</span>
                                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Activities */}
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Hoạt động gần đây</h2>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {recentActivities.map((activity, index) => (
                                            <div key={index} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                                                    {activity.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 text-center">
                                        <Link href="/activities" className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                                            Xem tất cả hoạt động
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Suggested Recipes */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gợi ý món ăn</h2>
                            <div className="space-y-4">
                                {suggestedRecipes.map((recipe, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="aspect-w-16 aspect-h-9">
                                            <div className="w-full h-32 bg-gradient-to-r from-orange-200 to-red-200 flex items-center justify-center">
                                                <ChefHat className="h-8 w-8 text-orange-500" />
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                                <span className="flex items-center">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {recipe.time}
                                                </span>
                                                <span className="flex items-center">
                                                    <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                                    {recipe.rating}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                                                    {recipe.region}
                                                </span>
                                                <span className="text-xs text-gray-500">{recipe.difficulty}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
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
            user: session.user,
        },
    };
};

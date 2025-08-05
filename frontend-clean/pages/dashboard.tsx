import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import AuthWrapper from '.././src/components/auth/AuthWrapper';


import {
    ChefHat,
    Sparkles,
    Brain,
    Mic,
    Camera,
    BookOpen,
    TrendingUp,
    Clock,
    Heart,
    Star,
    Users,
    Award,
    Settings,
    Bell,
    Search,
    Plus,
    User,
    LogOut,
    Home,
    Utensils,
    Globe,
    MessageCircle,
    Activity,
    Timer,
    Flame
} from 'lucide-react';

interface DashboardStats {
    recipesCreated: number;
    recipesCooked: number;
    aiInteractions: number;
    favoriteRecipes: number;
    learningProgress: number;
    communityRank: string;
}

interface RecentActivity {
    id: string;
    type: 'recipe_created' | 'ai_chat' | 'recipe_cooked' | 'recipe_liked';
    title: string;
    description: string;
    timestamp: string;
    icon: any;
    color: string;
}


export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        recipesCreated: 15,
        recipesCooked: 42,
        aiInteractions: 128,
        favoriteRecipes: 23,
        learningProgress: 75,
        communityRank: 'Advanced Cook'
    });

    const [recentActivities] = useState<RecentActivity[]>([
        {
            id: '1',
            type: 'recipe_created',
            title: 'Tạo công thức mới',
            description: 'Phở Gà Hà Nội với AI Assistant',
            timestamp: '2 giờ trước',
            icon: ChefHat,
            color: 'text-orange-500'
        },
        {
            id: '2',
            type: 'ai_chat',
            title: 'Chat với AI',
            description: 'Hỏi về cách làm bánh mì',
            timestamp: '5 giờ trước',
            icon: Brain,
            color: 'text-blue-500'
        },
        {
            id: '3',
            type: 'recipe_cooked',
            title: 'Hoàn thành món ăn',
            description: 'Cơm tấm sườn nướng',
            timestamp: '1 ngày trước',
            icon: Utensils,
            color: 'text-green-500'
        },
        {
            id: '4',
            type: 'recipe_liked',
            title: 'Yêu thích công thức',
            description: 'Bún bò Huế cay nồng',
            timestamp: '2 ngày trước',
            icon: Heart,
            color: 'text-red-500'
        }
    ]);

    const quickActions = [
        {
            title: 'Tạo công thức với AI',
            description: 'Sử dụng AI để tạo công thức từ nguyên liệu',
            icon: Sparkles,
            color: 'bg-gradient-to-r from-purple-500 to-pink-500',
            href: '/ai-chat',
            badge: 'Phổ biến'
        },
        {
            title: 'Trợ lý giọng nói',
            description: 'Nấu ăn rảnh tay với voice assistant',
            icon: Mic,
            color: 'bg-gradient-to-r from-green-500 to-teal-500',
            href: '/voice-assistant',
            badge: 'Mới'
        },
        {
            title: 'Nhận dạng món ăn',
            description: 'Chụp ảnh để nhận dạng và tạo công thức',
            icon: Camera,
            color: 'bg-gradient-to-r from-blue-500 to-indigo-500',
            href: '/image-recognition',
            badge: null
        },
        {
            title: 'Khám phá công thức',
            description: 'Tìm kiếm trong kho tàng 50K+ công thức',
            icon: BookOpen,
            color: 'bg-gradient-to-r from-orange-500 to-yellow-500',
            href: '/recipes',
            badge: null
        }
    ];

    const learningPaths = [
        {
            title: 'Nấu ăn cơ bản',
            progress: 85,
            lessons: 12,
            completedLessons: 10,
            nextLesson: 'Cách làm nước dùng ngon',
            color: 'bg-green-500'
        },
        {
            title: 'Món Việt truyền thống',
            progress: 60,
            lessons: 15,
            completedLessons: 9,
            nextLesson: 'Bún bò Huế chuẩn vị',
            color: 'bg-blue-500'
        },
        {
            title: 'Nướng BBQ chuyên nghiệp',
            progress: 30,
            lessons: 8,
            completedLessons: 2,
            nextLesson: 'Marinading thịt bò',
            color: 'bg-red-500'
        }
    ];

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth');
        } else if (status === 'authenticated') {
            setIsLoading(false);
        }
    }, [status, router]);

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        // <AuthWrapper>
            <div className="page-container min-h-screen bg-gray-50">
                <Head>
                    <title>Dashboard - Smart Cooking AI</title>
                    <meta name="description" content="Dashboard của Smart Cooking AI - Quản lý công thức và học nấu ăn" />
                </Head>

                {/* Header */}
                <nav className="navbar bg-white border-b shadow-sm sticky top-0 z-50">
                    <div className="container-modern">
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center space-x-6">
                                <Link href="/dashboard" className="flex items-center space-x-2">
                                    <ChefHat className="w-8 h-8 text-orange-500" />
                                    <span className="text-xl font-bold gradient-text">Smart Cooking AI</span>
                                </Link>

                                {/* Navigation */}
                                <div className="hidden md:flex items-center space-x-1">
                                    <Link href="/dashboard" className="nav-link active">
                                        <Home className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </Link>
                                    <Link href="/recipes" className="nav-link">
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Công thức
                                    </Link>
                                    <Link href="/ai-chat" className="nav-link">
                                        <Brain className="w-4 h-4 mr-2" />
                                        AI Assistant
                                    </Link>
                                    <Link href="/voice-assistant" className="nav-link">
                                        <Mic className="w-4 h-4 mr-2" />
                                        Voice
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                {/* Search */}
                                <div className="hidden md:flex relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm công thức..."
                                        className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white w-64"
                                    />
                                </div>

                                {/* Notifications */}
                                <button
                                    className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors"
                                    title="Thông báo"
                                >
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                                </button>

                                {/* User Menu */}
                                <div className="relative group">
                                    <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        {/* Use Next.js Image component for optimized images */}
                                        {/* @ts-expect- error: Next.js Image import assumed available */}
                                        <Image
                                            src={session?.user?.image || '/default-avatar.png'}
                                            alt="Avatar"
                                            width={32}
                                            height={32}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span className="hidden md:block text-sm font-medium text-gray-700">
                                            {session?.user?.name ?? ''}
                                        </span>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <Link href="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                                            <User className="w-4 h-4 mr-3" />
                                            Hồ sơ
                                        </Link>
                                        <Link href="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                                            <Settings className="w-4 h-4 mr-3" />
                                            Cài đặt
                                        </Link>
                                        <hr className="my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="container-modern py-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Chào {session?.user?.name ? session.user.name.split(' ')[0] : ''}! 👋
                        </h1>
                        <p className="text-gray-600">
                            Sẵn sàng để khám phá những công thức mới hôm nay?
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                        <div className="stat-card">
                            <div className="flex items-center justify-between mb-2">
                                <ChefHat className="w-8 h-8 text-orange-500" />
                                <span className="text-2xl font-bold text-gray-900">{stats.recipesCreated}</span>
                            </div>
                            <p className="text-sm text-gray-600">Công thức tạo</p>
                        </div>

                        <div className="stat-card">
                            <div className="flex items-center justify-between mb-2">
                                <Utensils className="w-8 h-8 text-green-500" />
                                <span className="text-2xl font-bold text-gray-900">{stats.recipesCooked}</span>
                            </div>
                            <p className="text-sm text-gray-600">Món đã nấu</p>
                        </div>

                        <div className="stat-card">
                            <div className="flex items-center justify-between mb-2">
                                <Brain className="w-8 h-8 text-blue-500" />
                                <span className="text-2xl font-bold text-gray-900">{stats.aiInteractions}</span>
                            </div>
                            <p className="text-sm text-gray-600">Chat với AI</p>
                        </div>

                        <div className="stat-card">
                            <div className="flex items-center justify-between mb-2">
                                <Heart className="w-8 h-8 text-red-500" />
                                <span className="text-2xl font-bold text-gray-900">{stats.favoriteRecipes}</span>
                            </div>
                            <p className="text-sm text-gray-600">Yêu thích</p>
                        </div>

                        <div className="stat-card">
                            <div className="flex items-center justify-between mb-2">
                                <TrendingUp className="w-8 h-8 text-purple-500" />
                                <span className="text-2xl font-bold text-gray-900">{stats.learningProgress}%</span>
                            </div>
                            <p className="text-sm text-gray-600">Tiến độ học</p>
                        </div>

                        <div className="stat-card">
                            <div className="flex items-center justify-between mb-2">
                                <Award className="w-8 h-8 text-yellow-500" />
                                <span className="text-xs font-bold text-gray-900">{stats.communityRank}</span>
                            </div>
                            <p className="text-sm text-gray-600">Xếp hạng</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Quick Actions */}
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Hành động nhanh</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {quickActions.map((action, index) => (
                                        <Link key={index} href={action.href} className="group">
                                            <div className="action-card">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                                                        <action.icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    {action.badge && (
                                                        <span className="badge bg-orange-100 text-orange-600">{action.badge}</span>
                                                    )}
                                                </div>
                                                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                                                <p className="text-sm text-gray-600">{action.description}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>

                            {/* Learning Paths */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Lộ trình học tập</h2>
                                    <Link href="/learning" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                                        Xem tất cả →
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {learningPaths.map((path, index) => (
                                        <div key={index} className="card p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-semibold text-gray-900">{path.title}</h3>
                                                <span className="text-sm text-gray-500">
                                                    {path.completedLessons}/{path.lessons} bài
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                                <div
                                                    className={`h-2 rounded-full ${path.color} transition-all duration-500`}
                                                    style={{ width: `${path.progress}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-600">
                                                    Tiếp theo: {path.nextLesson}
                                                </p>
                                                <span className={`text-sm font-medium ${path.color.replace('bg-', 'text-')}`}>
                                                    {path.progress}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Recent Activities */}
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Hoạt động gần đây</h2>
                                <div className="space-y-3">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                                            <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                                                <activity.icon className={`w-4 h-4 ${activity.color}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {activity.title}
                                                </p>
                                                <p className="text-xs text-gray-600 truncate">
                                                    {activity.description}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {activity.timestamp}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/activity" className="block text-center text-orange-600 hover:text-orange-700 text-sm font-medium mt-4">
                                    Xem tất cả hoạt động →
                                </Link>
                            </section>

                            {/* Today's Recommendation */}
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Gợi ý hôm nay</h2>
                                <div className="card p-0 overflow-hidden">
                                    <div className="h-32 bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center">
                                        <ChefHat className="w-12 h-12 text-white" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2">Phở Gà Hà Nội</h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Món phở truyền thống với hương vị đậm đà, phù hợp với thời tiết hôm nay.
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                <div className="flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    90 phút
                                                </div>
                                                <div className="flex items-center">
                                                    <Star className="w-3 h-3 mr-1" />
                                                    4.8
                                                </div>
                                            </div>
                                            <Link href="/recipes/pho-ga" className="btn-primary btn-sm">
                                                Xem công thức
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            );
}

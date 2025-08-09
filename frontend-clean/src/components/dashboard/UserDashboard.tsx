// Real-time User Dashboard với Beautiful UI & Business Analytics
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
    TrendingUp,
    Users,
    ChefHat,
    Star,
    Clock,
    Activity,
    Brain,
    Mic,
    Camera,
    Heart,
    Trophy,
    Target,
    BarChart3,
    PieChart
} from 'lucide-react';
import styles from './UserDashboard.module.css';

// Progress Bar Component
const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
    const barRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (barRef.current) {
            barRef.current.style.width = `${progress}%`;
        }
    }, [progress]);
    
    return (
        <div className={styles.progressBarContainer}>
            <div
                ref={barRef}
                className={styles.progressBar}
            ></div>
        </div>
    );
};

interface UserStats {
    recipesGenerated: number;
    recipesCreated: number;
    favoriteRecipes: number;
    aiInteractions: number;
    voiceCommands: number;
    imageScans: number;
    totalCookingTime: number;
    skillLevel: string;
    learningProgress: number;
}

interface RecentActivity {
    id: string;
    type: 'recipe_generated' | 'recipe_created' | 'ai_chat' | 'voice_command' | 'image_scan';
    title: string;
    description: string;
    timestamp: Date;
    icon: React.ReactNode;
    color: string;
}

const UserDashboard: React.FC = () => {
    const { data: session } = useSession();
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState<'overview' | 'analytics' | 'activity'>('overview');

    // Real-time data fetching
    useEffect(() => {
        if (session?.user) {
            fetchUserData();

            // Setup WebSocket connection for real-time updates
            const ws = new WebSocket(`ws://localhost:8080/ws/user/${session.user.id}`);

            ws.onmessage = (event) => {
                const update = JSON.parse(event.data);
                handleRealTimeUpdate(update);
            };

            ws.onopen = () => {
                console.log('✅ Real-time connection established');
            };

            ws.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
            };

            return () => {
                ws.close();
            };
        }
    }, [session?.user]);

    const fetchUserData = async () => {
        try {
            setIsLoading(true);

            // Fetch user statistics
            const statsResponse = await fetch('/api/user/stats', {
                headers: { 'Authorization': `Bearer ${session?.accessToken}` }
            });
            const stats = await statsResponse.json();
            setUserStats(stats);

            // Fetch recent activity
            const activityResponse = await fetch('/api/user/activity?limit=10', {
                headers: { 'Authorization': `Bearer ${session?.accessToken}` }
            });
            const activity = await activityResponse.json();
            setRecentActivity(activity.map(formatActivity));

        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRealTimeUpdate = (update: any) => {
        switch (update.type) {
            case 'STATS_UPDATE':
                setUserStats(prev => ({ ...prev, ...update.stats }));
                break;
            case 'NEW_ACTIVITY':
                setRecentActivity(prev => [formatActivity(update.activity), ...prev.slice(0, 9)]);
                break;
            case 'RECIPE_CREATED':
                setUserStats(prev => prev ? { ...prev, recipesCreated: prev.recipesCreated + 1 } : null);
                break;
            case 'AI_INTERACTION':
                setUserStats(prev => prev ? { ...prev, aiInteractions: prev.aiInteractions + 1 } : null);
                break;
        }
    };

    const formatActivity = (activity: any): RecentActivity => {
        const iconMap = {
            'recipe_generated': <Brain className="w-4 h-4" />,
            'recipe_created': <ChefHat className="w-4 h-4" />,
            'ai_chat': <Brain className="w-4 h-4" />,
            'voice_command': <Mic className="w-4 h-4" />,
            'image_scan': <Camera className="w-4 h-4" />,
        };

        const colorMap = {
            'recipe_generated': 'bg-blue-500',
            'recipe_created': 'bg-green-500',
            'ai_chat': 'bg-purple-500',
            'voice_command': 'bg-orange-500',
            'image_scan': 'bg-pink-500',
        };

        return {
            ...activity,
            icon: iconMap[activity.type as keyof typeof iconMap] || <Activity className="w-4 h-4" />,
            color: colorMap[activity.type as keyof typeof colorMap] || 'bg-gray-500',
            timestamp: new Date(activity.timestamp),
        };
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
                            ))}
                        </div>
                        <div className="h-96 bg-gray-300 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Chào mừng trở lại, {session?.user?.name?.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Hôm nay bạn muốn nấu gì? Hãy khám phá những tính năng tuyệt vời của Smart Cooking AI
                        </p>
                    </div>

                    {/* User Avatar */}
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                            <p className="text-sm text-gray-500">{userStats?.skillLevel} Chef</p>
                        </div>
                        <img
                            src={session?.user?.image || '/default-avatar.png'}
                            alt="User Avatar"
                            className="w-12 h-12 rounded-full border-2 border-emerald-500"
                        />
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 mb-8">
                    {[
                        { id: 'overview', label: 'Tổng quan', icon: <BarChart3 className="w-4 h-4" /> },
                        { id: 'analytics', label: 'Phân tích', icon: <PieChart className="w-4 h-4" /> },
                        { id: 'activity', label: 'Hoạt động', icon: <Activity className="w-4 h-4" /> },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id as any)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${selectedTab === tab.id
                                    ? 'bg-emerald-500 text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Stats Cards */}
                {selectedTab === 'overview' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                title="Công thức đã tạo"
                                value={userStats?.recipesGenerated || 0}
                                icon={<Brain className="w-6 h-6 text-blue-500" />}
                                color="bg-blue-500"
                                trend="+12%"
                            />
                            <StatCard
                                title="Công thức yêu thích"
                                value={userStats?.favoriteRecipes || 0}
                                icon={<Heart className="w-6 h-6 text-red-500" />}
                                color="bg-red-500"
                                trend="+8%"
                            />
                            <StatCard
                                title="Tương tác AI"
                                value={userStats?.aiInteractions || 0}
                                icon={<Brain className="w-6 h-6 text-purple-500" />}
                                color="bg-purple-500"
                                trend="+25%"
                            />
                            <StatCard
                                title="Lệnh giọng nói"
                                value={userStats?.voiceCommands || 0}
                                icon={<Mic className="w-6 h-6 text-orange-500" />}
                                color="bg-orange-500"
                                trend="+15%"
                            />
                        </div>

                        {/* Learning Progress */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Tiến độ học tập</h3>
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>Hoàn thành</span>
                                        <span>{userStats?.learningProgress || 0}%</span>
                                    </div>
                                    <ProgressBar progress={userStats?.learningProgress || 0} />
                                </div>
                                <p className="text-sm text-gray-600">
                                    Bạn đang là <strong>{userStats?.skillLevel}</strong> chef.
                                    Tiếp tục nấu ăn để nâng cấp kỹ năng!
                                </p>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành động nhanh</h3>
                                <div className="space-y-3">
                                    <QuickActionButton
                                        icon={<Brain className="w-5 h-5" />}
                                        title="Tạo công thức AI"
                                        description="Tạo công thức từ nguyên liệu có sẵn"
                                        onClick={() => window.location.href = '/ai-chat'}
                                        color="bg-blue-500"
                                    />
                                    <QuickActionButton
                                        icon={<Camera className="w-5 h-5" />}
                                        title="Quét món ăn"
                                        description="Nhận dạng món ăn qua hình ảnh"
                                        onClick={() => window.location.href = '/image-recognition'}
                                        color="bg-green-500"
                                    />
                                    <QuickActionButton
                                        icon={<Mic className="w-5 h-5" />}
                                        title="Trợ lý giọng nói"
                                        description="Nói chuyện với AI assistant"
                                        onClick={() => window.location.href = '/voice-assistant'}
                                        color="bg-orange-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Recent Activity */}
                {selectedTab === 'activity' && (
                    <div className="bg-white rounded-xl shadow-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
                        </div>
                        <div className="p-6">
                            {recentActivity.length > 0 ? (
                                <div className="space-y-4">
                                    {recentActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-start space-x-4">
                                            <div className={`${activity.color} p-2 rounded-full text-white`}>
                                                {activity.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                                <p className="text-sm text-gray-600">{activity.description}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {activity.timestamp.toLocaleString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Chưa có hoạt động nào. Hãy bắt đầu nấu ăn!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
}> = ({ title, value, icon, color, trend }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`${color} p-3 rounded-lg`}>
                    {icon}
                </div>
                {trend && (
                    <div className="flex items-center text-green-500 text-sm font-medium">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</h3>
                <p className="text-gray-600 text-sm">{title}</p>
            </div>
        </div>
    );
};

// Quick Action Button Component
const QuickActionButton: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    color: string;
}> = ({ icon, title, description, onClick, color }) => {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
        >
            <div className={`${color} p-2 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <div className="flex-1 text-left">
                <h4 className="font-medium text-gray-900">{title}</h4>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </button>
    );
};

export default UserDashboard;

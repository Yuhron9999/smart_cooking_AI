import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { Mail, Smartphone } from 'lucide-react';
import Image from 'next/image';

import {
    ArrowLeft,
    Bell,
    Check,
    X,
    Settings,
    Filter,
    MoreHorizontal,
    ChefHat,
    Heart,
    Users,
    MessageCircle,
    Star,
    Gift,
    Zap,
    Calendar,
    Clock,
    Eye,
    EyeOff,
    Trash2,
    CheckCircle,
    AlertCircle,
    Info,
    Award,
    Sparkles,
    TrendingUp,
    User,
    Share
} from 'lucide-react';

interface Notification {
    id: string;
    type: 'LIKE' | 'FOLLOW' | 'COMMENT' | 'RECIPE_APPROVED' | 'ACHIEVEMENT' | 'SYSTEM' | 'AI_UPDATE' | 'RECIPE_SHARED';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    isImportant: boolean;
    actionUrl?: string;
    avatar?: string;
    senderName?: string;
    metadata?: {
        recipeName?: string;
        achievementName?: string;
        updateVersion?: string;
    };
}

// Fake data để hiển thị UI khi API chưa sẵn sàng
const mockNotificationsData: Notification[] = [
    {
        id: '1',
        type: 'LIKE',
        title: 'Công thức được yêu thích',
        message: 'Nguyễn Thị Lan và 5 người khác đã thích công thức "Phở Bò Hà Nội" của bạn',
        timestamp: '5 phút trước',
        isRead: false,
        isImportant: false,
        actionUrl: '/recipes/pho-bo-hanoi',
        avatar: '/api/placeholder/40/40',
        senderName: 'Nguyễn Thị Lan',
        metadata: { recipeName: 'Phở Bò Hà Nội' }
    },
    {
        id: '2',
        type: 'ACHIEVEMENT',
        title: 'Thành tựu mới mở khóa!',
        message: 'Chúc mừng! Bạn đã mở khóa thành tựu "Master Chef" sau khi tạo 50 công thức',
        timestamp: '1 giờ trước',
        isRead: false,
        isImportant: true,
        actionUrl: '/profile/achievements',
        metadata: { achievementName: 'Master Chef' }
    },
    {
        id: '3',
        type: 'SYSTEM',
        title: 'Cập nhật hệ thống',
        message: 'Smart Cooking AI đã được nâng cấp lên phiên bản 2.5 với nhiều tính năng mới',
        timestamp: '1 ngày trước',
        isRead: true,
        isImportant: false,
        metadata: { updateVersion: '2.5' }
    },
    {
        id: '4',
        type: 'COMMENT',
        title: 'Bình luận mới',
        message: 'Trần Văn Bình đã bình luận về công thức "Bánh xèo miền Tây" của bạn',
        timestamp: '2 ngày trước',
        isRead: true,
        isImportant: false,
        actionUrl: '/recipes/banh-xeo-mien-tay#comments',
        avatar: '/api/placeholder/40/40',
        senderName: 'Trần Văn Bình'
    },
    {
        id: '5',
        type: 'FOLLOW',
        title: 'Người theo dõi mới',
        message: 'Lê Thị Hoa bắt đầu theo dõi bạn',
        timestamp: '3 ngày trước',
        isRead: true,
        isImportant: false,
        actionUrl: '/profile/le-thi-hoa',
        avatar: '/api/placeholder/40/40',
        senderName: 'Lê Thị Hoa'
    },
    {
        id: '6',
        type: 'RECIPE_APPROVED',
        title: 'Công thức đã được duyệt',
        message: 'Công thức "Bún chả Hà Nội" của bạn đã được chấp nhận và xuất hiện trên trang chủ',
        timestamp: '4 ngày trước',
        isRead: true,
        isImportant: true,
        actionUrl: '/recipes/bun-cha-ha-noi'
    },
    {
        id: '7',
        type: 'AI_UPDATE',
        title: 'Gợi ý mới từ AI',
        message: 'Dựa trên lịch sử nấu ăn của bạn, bạn có thể thích "Cách làm Sushi tại nhà"',
        timestamp: '5 ngày trước',
        isRead: false,
        isImportant: false,
        actionUrl: '/ai-suggestions/sushi'
    },
    {
        id: '8',
        type: 'RECIPE_SHARED',
        title: 'Công thức được chia sẻ',
        message: 'Phạm Văn Đức đã chia sẻ công thức "Gà nướng muối ớt" của bạn lên Facebook',
        timestamp: '1 tuần trước',
        isRead: true,
        isImportant: false,
        avatar: '/api/placeholder/40/40',
        senderName: 'Phạm Văn Đức'
    }
];

export default function NotificationsPage() {
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'important' | 'today'>('all');
    const [showSettings, setShowSettings] = useState(false);

    // Sử dụng dữ liệu mẫu thay vì gọi API thực
    const [notificationsList, setNotificationsList] = useState<Notification[]>(mockNotificationsData);
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        newRecipes: true,
        comments: true,
        follows: true,
        achievements: true,
        systemUpdates: false,
        aiSuggestions: true
    });

    // Các hàm xử lý thông báo
    const handleMarkAsRead = (id: string) => {
        setNotificationsList(prev =>
            prev.map(notification =>
                notification.id === id ? { ...notification, isRead: true } : notification
            )
        );
    };

    const handleMarkAllAsRead = () => {
        setNotificationsList(prev =>
            prev.map(notification => ({ ...notification, isRead: true }))
        );
    };

    const handleDeleteNotification = (id: string) => {
        setNotificationsList(prev =>
            prev.filter(notification => notification.id !== id)
        );
    };

    const handleToggleImportant = (id: string) => {
        setNotificationsList(prev =>
            prev.map(notification =>
                notification.id === id ? { ...notification, isImportant: !notification.isImportant } : notification
            )
        );
    };

    const handleUpdateSettings = (key: string, value: boolean) => {
        setNotificationSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Lọc thông báo dựa trên bộ lọc hoạt động
    const filteredNotifications = notificationsList.filter(notification => {
        if (activeFilter === 'unread') {
            return !notification.isRead;
        } else if (activeFilter === 'important') {
            return notification.isImportant;
        } else if (activeFilter === 'today') {
            // Đơn giản hóa: chỉ hiển thị thông báo có timestamp chứa "phút" hoặc "giờ"
            return notification.timestamp.includes('phút') || notification.timestamp.includes('giờ');
        }
        return true;
    });

    // Tính số thông báo chưa đọc
    const unreadCount = notificationsList.filter(notification => !notification.isRead).length;

    return (
        // <AuthWrapper requireAuth>
        <div className="page-container min-h-screen bg-gray-50">
            <Head>
                <title>Thông Báo - Smart Cooking AI</title>
                <meta name="description" content="Quản lý thông báo Smart Cooking AI - cập nhật, tương tác và thành tựu" />
            </Head>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <Link href="/dashboard" className="mr-4">
                            <span className="flex items-center text-gray-500 hover:text-gray-800">
                                <ArrowLeft className="w-5 h-5" />
                            </span>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Bell className="w-6 h-6 mr-2 text-orange-500" />
                            Thông Báo
                            {unreadCount > 0 && (
                                <span className="ml-2 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                                    {unreadCount} mới
                                </span>
                            )}
                        </h1>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={handleMarkAllAsRead}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-800"
                    >
                        <Check className="w-4 h-4 mr-1" />
                        Đánh dấu tất cả đã đọc
                    </button>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-800"
                    >
                        <Settings className="w-4 h-4 mr-1" />
                        Cài đặt
                    </button>
                </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="mb-6 p-6 bg-white rounded-xl shadow-md animate-fadeIn">
                    <div>
                        <button
                            onClick={() => setShowSettings(false)}
                            className="text-gray-400 hover:text-gray-500"
                            title="Đóng cài đặt"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.emailNotifications}
                                    onChange={() => handleUpdateSettings('emailNotifications', !notificationSettings.emailNotifications)}
                                    className="form-checkbox h-5 w-5 text-orange-500"
                                />
                                <span className="ml-2 text-gray-700">Thông báo qua email</span>
                            </label>
                            <Mail className="w-5 h-5 text-gray-400" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.pushNotifications}
                                    onChange={() => handleUpdateSettings('pushNotifications', !notificationSettings.pushNotifications)}
                                    className="form-checkbox h-5 w-5 text-orange-500"
                                />
                                <span className="ml-2 text-gray-700">Thông báo push</span>
                            </label>
                            <Smartphone className="w-5 h-5 text-gray-400" />
                        </div>

                        <div className="mt-6 border-t border-gray-200 pt-4">
                            <h3 className="text-sm font-medium text-gray-500 mb-3">
                                Loại thông báo
                            </h3>

                            <div className="space-y-3">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.newRecipes}
                                        onChange={() => handleUpdateSettings('newRecipes', !notificationSettings.newRecipes)}
                                        className="form-checkbox h-4 w-4 text-orange-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Công thức mới</span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.comments}
                                        onChange={() => handleUpdateSettings('comments', !notificationSettings.comments)}
                                        className="form-checkbox h-4 w-4 text-orange-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Bình luận</span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.follows}
                                        onChange={() => handleUpdateSettings('follows', !notificationSettings.follows)}
                                        className="form-checkbox h-4 w-4 text-orange-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Người theo dõi</span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.achievements}
                                        onChange={() => handleUpdateSettings('achievements', !notificationSettings.achievements)}
                                        className="form-checkbox h-4 w-4 text-orange-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Thành tựu</span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.systemUpdates}
                                        onChange={() => handleUpdateSettings('systemUpdates', !notificationSettings.systemUpdates)}
                                        className="form-checkbox h-4 w-4 text-orange-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Cập nhật hệ thống</span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.aiSuggestions}
                                        onChange={() => handleUpdateSettings('aiSuggestions', !notificationSettings.aiSuggestions)}
                                        className="form-checkbox h-4 w-4 text-orange-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Gợi ý từ AI</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => setShowSettings(false)}
                            className="btn-primary"
                        >
                            Lưu cài đặt
                        </button>
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeFilter === 'all'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Tất cả
                </button>
                <button
                    onClick={() => setActiveFilter('unread')}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeFilter === 'unread'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Chưa đọc
                </button>
                <button
                    onClick={() => setActiveFilter('important')}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeFilter === 'important'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Quan trọng
                </button>
                <button
                    onClick={() => setActiveFilter('today')}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeFilter === 'today'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Hôm nay
                </button>
            </div>

            {/* Notifications */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <div className="text-center py-10">
                        <Bell className="w-12 h-12 mx-auto text-gray-300" />
                        <p className="text-lg text-gray-500 mt-4">Không có thông báo nào</p>
                        <p className="text-sm text-gray-400">Khi có thông báo mới, chúng sẽ hiện ở đây</p>
                    </div>
                ) : (
                    filteredNotifications.map(notification => {
                        let icon;
                        let colors = '';

                        switch (notification.type) {
                            case 'LIKE':
                                icon = <Heart className="w-5 h-5" />;
                                colors = 'text-pink-600 bg-pink-100';
                                break;
                            case 'FOLLOW':
                                icon = <Users className="w-5 h-5" />;
                                colors = 'text-blue-600 bg-blue-100';
                                break;
                            case 'COMMENT':
                                icon = <MessageCircle className="w-5 h-5" />;
                                colors = 'text-indigo-600 bg-indigo-100';
                                break;
                            case 'RECIPE_APPROVED':
                                icon = <CheckCircle className="w-5 h-5" />;
                                colors = 'text-green-600 bg-green-100';
                                break;
                            case 'ACHIEVEMENT':
                                icon = <Award className="w-5 h-5" />;
                                colors = 'text-amber-600 bg-amber-100';
                                break;
                            case 'SYSTEM':
                                icon = <Info className="w-5 h-5" />;
                                colors = 'text-gray-600 bg-gray-100';
                                break;
                            case 'AI_UPDATE':
                                icon = <Sparkles className="w-5 h-5" />;
                                colors = 'text-purple-600 bg-purple-100';
                                break;
                            case 'RECIPE_SHARED':
                                icon = <TrendingUp className="w-5 h-5" />;
                                colors = 'text-teal-600 bg-teal-100';
                                break;
                            default:
                                icon = <Bell className="w-5 h-5" />;
                                colors = 'text-orange-600 bg-orange-100';
                        }

                        const [textColor, bgColor] = colors.split(' ');

                        return (
                            <div
                                key={notification.id}
                                className={`p-4 rounded-xl bg-white shadow-sm border-l-4 ${notification.isRead ? 'border-transparent' : 'border-orange-500'
                                    }`}
                            >
                                <div className="flex">
                                    {/* Icon column */}
                                    <div className={`mr-4 p-2 rounded-full ${bgColor}`}>
                                        <div className={textColor}>{icon}</div>
                                    </div>

                                    {/* Content column */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-1">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                {notification.title}
                                            </h3>
                                            <div className="flex items-center">
                                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                                    {notification.timestamp}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                                        {notification.avatar && (
                                            <Image
                                                src={notification.avatar}
                                                alt={notification.senderName || ''}
                                                width={24}
                                                height={24}
                                                className="w-6 h-6 rounded-full mr-2"
                                            />
                                        )}
                                        {notification.senderName && (
                                            <span className="text-xs text-gray-600">
                                                {notification.senderName}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleToggleImportant(notification.id)}
                                            className="text-gray-400 hover:text-amber-500"
                                            title={notification.isImportant ? "Bỏ đánh dấu quan trọng" : "Đánh dấu quan trọng"}
                                        >
                                            <Star className={`w-4 h-4 ${notification.isImportant ? 'text-amber-500 fill-amber-500' : ''}`} />
                                        </button>

                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="text-gray-400 hover:text-blue-500"
                                            title="Đánh dấu đã đọc"
                                        >
                                            {notification.isRead ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>

                                        <button
                                            onClick={() => handleDeleteNotification(notification.id)}
                                            className="text-gray-400 hover:text-red-500"
                                            title="Xóa thông báo"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    {notification.actionUrl && (
                                        <Link
                                            href={notification.actionUrl}
                                            className="inline-flex items-center text-xs font-medium text-orange-600 hover:text-orange-700"
                                        >
                                            Xem chi tiết
                                            <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>


    )
}


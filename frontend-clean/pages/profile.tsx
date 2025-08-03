import React, { useState, useEffect, useMemo } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import Header from '@/components/layout/Header_fixed';
import styles from '../styles/profile.module.css';
import {
    User,
    Mail,
    MapPin,
    Calendar,
    Award,
    Settings,
    Edit3,
    Save,
    X,
    Camera,
    Heart,
    BookOpen,
    ChefHat,
    Clock,
    TrendingUp,
    Star,
    Globe,
    Bell,
    Eye,
    CheckCircle,
    AlertCircle,
    LogOut,
    Trash2
} from 'lucide-react';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    image?: string;
    phone?: string;
    location?: string;
    bio?: string;
    joinDate: string;
    language: string;
    timezone: string;
    dietaryRestrictions: string[];
    favoritesCuisines: string[];
    cookingLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    preferences: {
        emailNotifications: boolean;
        pushNotifications: boolean;
        publicProfile: boolean;
        showActivity: boolean;
    };
    stats: {
        favoriteRecipes: number;
        recipesCreated: number;
        aiInteractions: number;
        totalCookingTime: number;
        averageRating: number;
    };
}

interface Achievement {
    id: number;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: string;
    progress?: number;
    maxProgress?: number;
}

const ProfilePage: React.FC = () => {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Sample profile data
    const sampleProfile: UserProfile = useMemo(() => ({
        id: session?.user?.email || 'user-id',
        name: session?.user?.name || 'Người dùng Smart Cooking AI',
        email: session?.user?.email || 'user@example.com',
        image: session?.user?.image || undefined,
        phone: '+84 123 456 789',
        location: 'Hà Nội, Việt Nam',
        bio: 'Đam mê nấu ăn và khám phá những món ăn mới. Yêu thích sự kết hợp giữa truyền thống và hiện đại trong ẩm thực.',
        joinDate: '2024-01-01',
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        dietaryRestrictions: ['Không ăn cay', 'Ăn chay thỉnh thoảng'],
        favoritesCuisines: ['Món Việt', 'Món Á', 'Món Tây'],
        cookingLevel: 'Intermediate',
        preferences: {
            emailNotifications: true,
            pushNotifications: true,
            publicProfile: true,
            showActivity: true
        },
        stats: {
            favoriteRecipes: 24,
            recipesCreated: 8,
            aiInteractions: 156,
            totalCookingTime: 2450, // minutes
            averageRating: 4.6
        }
    }), [session]);

    // Sample achievements
    const sampleAchievements: Achievement[] = useMemo(() => [
        {
            id: 1,
            title: 'Người mới bắt đầu',
            description: 'Tạo tài khoản và hoàn thành hồ sơ',
            icon: '🎯',
            unlockedAt: '2024-01-01'
        },
        {
            id: 2,
            title: 'Đầu bếp AI',
            description: 'Tạo 10 công thức với AI',
            icon: '🤖',
            unlockedAt: '2024-01-15',
            progress: 8,
            maxProgress: 10
        },
        {
            id: 3,
            title: 'Người sưu tầm',
            description: 'Lưu 50 công thức yêu thích',
            icon: '❤️',
            progress: 24,
            maxProgress: 50
        },
        {
            id: 4,
            title: 'Chuyên gia giọng nói',
            description: 'Sử dụng trợ lý giọng nói 100 lần',
            icon: '🎤',
            progress: 87,
            maxProgress: 100
        },
        {
            id: 5,
            title: 'Khám phá ẩm thực',
            description: 'Thử các món từ 5 quốc gia khác nhau',
            icon: '🌍',
            unlockedAt: '2024-02-01'
        },
        {
            id: 6,
            title: 'Bậc thầy nấu ăn',
            description: 'Đạt 1000 phút nấu ăn',
            icon: '⏰',
            progress: 2450,
            maxProgress: 1000,
            unlockedAt: '2024-02-10'
        }
    ], []);

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            setLoading(false);
            return;
        }

        // Simulate API call to load user profile
        const loadProfile = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setProfile(sampleProfile);
            setAchievements(sampleAchievements);
            setEditForm(sampleProfile);
            setLoading(false);
        };

        loadProfile();
    }, [session, status, sampleProfile, sampleAchievements]);

    const handleSaveProfile = async () => {
        if (!profile) return;

        setSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        setProfile({ ...profile, ...editForm });
        setIsEditing(false);
        setSaving(false);
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock image upload
        const imageUrl = URL.createObjectURL(file);
        setEditForm(prev => ({ ...prev, image: imageUrl }));
        setUploadingImage(false);
    };

    const getCookingLevelColor = (level: string) => {
        switch (level) {
            case 'Beginner': return 'bg-green-100 text-green-700';
            case 'Intermediate': return 'bg-blue-100 text-blue-700';
            case 'Advanced': return 'bg-purple-100 text-purple-700';
            case 'Expert': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải hồ sơ...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <>
                <Head>
                    <title>Hồ sơ - Smart Cooking AI</title>
                    <meta name="description" content="Quản lý hồ sơ cá nhân và cài đặt tài khoản" />
                </Head>

                <div className="min-h-screen bg-gray-50">
                    <Header />

                    <main className="container mx-auto px-4 py-8">
                        <div className="max-w-2xl mx-auto text-center">
                            <div className="bg-white rounded-lg shadow-md p-8">
                                <User className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                    Đăng nhập để xem hồ sơ
                                </h1>
                                <p className="text-gray-600 mb-6">
                                    Đăng nhập để quản lý hồ sơ cá nhân và tùy chỉnh trải nghiệm nấu ăn
                                </p>
                                <button
                                    onClick={() => signIn('google')}
                                    className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    Đăng nhập với Google
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">Không thể tải hồ sơ người dùng</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Hồ sơ - Smart Cooking AI</title>
                <meta name="description" content="Quản lý hồ sơ cá nhân và cài đặt tài khoản" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Header />

                <main className="container mx-auto px-4 py-6">
                    {/* Profile Header */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                            {/* Profile Image */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center overflow-hidden">
                                    {(isEditing ? editForm.image : profile.image) ? (
                                        <Image
                                            src={(isEditing ? editForm.image : profile.image) || ''}
                                            alt="Profile"
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-12 w-12 text-white" />
                                    )}
                                </div>

                                {isEditing && (
                                    <div className="absolute bottom-0 right-0">
                                        <label className="bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors">
                                            {uploadingImage ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            ) : (
                                                <Camera className="h-4 w-4" />
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                disabled={uploadingImage}
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                title="Chỉnh sửa tên"
                                                placeholder="Nhập tên của bạn"
                                                value={editForm.name || ''}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                                className="text-2xl font-bold bg-transparent border-b-2 border-orange-300 focus:border-orange-500 outline-none"
                                            />
                                        ) : (
                                            profile.name
                                        )}
                                    </h1>

                                    <div className="flex space-x-2">
                                        {isEditing ? (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={handleSaveProfile}
                                                    disabled={saving}
                                                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                                                >
                                                    {saving ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    ) : (
                                                        <Save className="h-4 w-4 mr-2" />
                                                    )}
                                                    {saving ? 'Đang lưu...' : 'Lưu'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setEditForm(profile);
                                                    }}
                                                    className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    Hủy
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                                            >
                                                <Edit3 className="h-4 w-4 mr-2" />
                                                Chỉnh sửa
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 text-gray-600">
                                    <div className="flex items-center">
                                        <Mail className="h-4 w-4 mr-2" />
                                        <span>{profile.email}</span>
                                    </div>

                                    {(isEditing ? editForm.location : profile.location) && (
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editForm.location || ''}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                                                    className="bg-transparent border-b border-gray-300 focus:border-orange-500 outline-none"
                                                    placeholder="Vị trí"
                                                />
                                            ) : (
                                                <span>{profile.location}</span>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <span>Tham gia từ {new Date(profile.joinDate).toLocaleDateString('vi-VN')}</span>
                                    </div>

                                    <div className="flex items-center">
                                        <Award className="h-4 w-4 mr-2" />
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCookingLevelColor(profile.cookingLevel)}`}>
                                            {profile.cookingLevel}
                                        </span>
                                    </div>
                                </div>

                                {/* Bio */}
                                {(isEditing || profile.bio) && (
                                    <div className="mt-4">
                                        {isEditing ? (
                                            <textarea
                                                value={editForm.bio || ''}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                                                placeholder="Giới thiệu về bản thân..."
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                                rows={3}
                                            />
                                        ) : (
                                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                {profile.bio}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-md p-4 text-center">
                            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">{profile.stats.favoriteRecipes}</div>
                            <div className="text-sm text-gray-600">Yêu thích</div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-4 text-center">
                            <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">{profile.stats.recipesCreated}</div>
                            <div className="text-sm text-gray-600">Đã tạo</div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-4 text-center">
                            <ChefHat className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">{profile.stats.aiInteractions}</div>
                            <div className="text-sm text-gray-600">Chat AI</div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-4 text-center">
                            <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">{Math.round(profile.stats.totalCookingTime / 60)}</div>
                            <div className="text-sm text-gray-600">Giờ nấu</div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-4 text-center">
                            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">{profile.stats.averageRating}</div>
                            <div className="text-sm text-gray-600">Đánh giá</div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6">
                                {[
                                    { id: 'overview', label: 'Tổng quan', icon: TrendingUp },
                                    { id: 'achievements', label: 'Thành tích', icon: Award },
                                    { id: 'preferences', label: 'Tùy chọn', icon: Settings }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                            ? 'border-orange-500 text-orange-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <tab.icon className="h-5 w-5 mr-2" />
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6">
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    {/* Recent Activity */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                                                <ChefHat className="h-5 w-5 text-orange-500 mr-3" />
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-900">Tạo công thức &quot;Phở Bò Hà Nội&quot; với AI</p>
                                                    <p className="text-xs text-gray-500">2 giờ trước</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center p-3 bg-red-50 rounded-lg">
                                                <Heart className="h-5 w-5 text-red-500 mr-3" />
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-900">Thêm &quot;Bánh Xèo Miền Nam&quot; vào yêu thích</p>
                                                    <p className="text-xs text-gray-500">1 ngày trước</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                                                <Award className="h-5 w-5 text-blue-500 mr-3" />
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-900">Đạt thành tích &quot;Bậc thầy nấu ăn&quot;</p>
                                                    <p className="text-xs text-gray-500">3 ngày trước</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dietary Info */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin ẩm thực</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Hạn chế ăn uống</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {profile.dietaryRestrictions.map((restriction, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                                                        >
                                                            {restriction}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Ẩm thực yêu thích</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {profile.favoritesCuisines.map((cuisine, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                                                        >
                                                            {cuisine}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Achievements Tab */}
                            {activeTab === 'achievements' && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thành tích ({achievements.filter(a => a.unlockedAt).length}/{achievements.length})</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {achievements.map((achievement) => (
                                            <div
                                                key={achievement.id}
                                                className={`p-4 rounded-lg border-2 ${achievement.unlockedAt
                                                    ? 'bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-300'
                                                    : 'bg-gray-50 border-gray-200'
                                                    }`}
                                            >
                                                <div className="flex items-center mb-3">
                                                    <span className="text-2xl mr-3">{achievement.icon}</span>
                                                    <div className="flex-1">
                                                        <h4 className={`font-semibold ${achievement.unlockedAt ? 'text-gray-900' : 'text-gray-500'
                                                            }`}>
                                                            {achievement.title}
                                                        </h4>
                                                        {achievement.unlockedAt && (
                                                            <p className="text-xs text-green-600 flex items-center">
                                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                                Đã mở khóa
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className={`text-sm mb-3 ${achievement.unlockedAt ? 'text-gray-700' : 'text-gray-500'
                                                    }`}>
                                                    {achievement.description}
                                                </p>

                                                {achievement.progress !== undefined && achievement.maxProgress && (
                                                    <div>
                                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                            <span>Tiến độ</span>
                                                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full ${styles.progressBar} ${achievement.unlockedAt ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-orange-400'
                                                                    }`}
                                                                data-progress={Math.round(Math.min((achievement.progress || 0) / (achievement.maxProgress || 1) * 100, 100))}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}

                                                {achievement.unlockedAt && (
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Mở khóa: {new Date(achievement.unlockedAt).toLocaleDateString('vi-VN')}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === 'preferences' && (
                                <div className="space-y-6">
                                    {/* Privacy Settings */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quyền riêng tư</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center">
                                                    <Globe className="h-5 w-5 text-gray-500 mr-3" />
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">Hồ sơ công khai</h4>
                                                        <p className="text-sm text-gray-600">Cho phép người khác xem hồ sơ của bạn</p>
                                                    </div>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    title="Hồ sơ công khai"
                                                    checked={profile.preferences.publicProfile}
                                                    onChange={(e) => setProfile(prev => prev ? {
                                                        ...prev,
                                                        preferences: { ...prev.preferences, publicProfile: e.target.checked }
                                                    } : null)}
                                                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center">
                                                    <Eye className="h-5 w-5 text-gray-500 mr-3" />
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">Hiển thị hoạt động</h4>
                                                        <p className="text-sm text-gray-600">Cho phép hiển thị hoạt động nấu ăn của bạn</p>
                                                    </div>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    title="Hiển thị hoạt động"
                                                    checked={profile.preferences.showActivity}
                                                    onChange={(e) => setProfile(prev => prev ? {
                                                        ...prev,
                                                        preferences: { ...prev.preferences, showActivity: e.target.checked }
                                                    } : null)}
                                                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notification Settings */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông báo</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center">
                                                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">Thông báo email</h4>
                                                        <p className="text-sm text-gray-600">Nhận thông báo qua email về các công thức mới</p>
                                                    </div>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    title="Thông báo email"
                                                    checked={profile.preferences.emailNotifications}
                                                    onChange={(e) => setProfile(prev => prev ? {
                                                        ...prev,
                                                        preferences: { ...prev.preferences, emailNotifications: e.target.checked }
                                                    } : null)}
                                                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center">
                                                    <Bell className="h-5 w-5 text-gray-500 mr-3" />
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">Thông báo đẩy</h4>
                                                        <p className="text-sm text-gray-600">Nhận thông báo đẩy trên thiết bị</p>
                                                    </div>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    title="Thông báo đẩy"
                                                    checked={profile.preferences.pushNotifications}
                                                    onChange={(e) => setProfile(prev => prev ? {
                                                        ...prev,
                                                        preferences: { ...prev.preferences, pushNotifications: e.target.checked }
                                                    } : null)}
                                                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Language & Region */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ngôn ngữ & Khu vực</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Ngôn ngữ</label>
                                                <select
                                                    value={profile.language}
                                                    onChange={(e) => setProfile(prev => prev ? { ...prev, language: e.target.value } : null)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    title="Chọn ngôn ngữ"
                                                >
                                                    <option value="vi">🇻🇳 Tiếng Việt</option>
                                                    <option value="en">🇺🇸 English</option>
                                                    <option value="ja">🇯🇵 日本語</option>
                                                    <option value="ko">🇰🇷 한국어</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Múi giờ</label>
                                                <select
                                                    value={profile.timezone}
                                                    onChange={(e) => setProfile(prev => prev ? { ...prev, timezone: e.target.value } : null)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    title="Chọn múi giờ"
                                                >
                                                    <option value="Asia/Ho_Chi_Minh">GMT+7 (Việt Nam)</option>
                                                    <option value="Asia/Tokyo">GMT+9 (Nhật Bản)</option>
                                                    <option value="America/New_York">GMT-5 (New York)</option>
                                                    <option value="Europe/London">GMT+0 (London)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account Actions */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tài khoản</h3>
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => signOut()}
                                                className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <LogOut className="h-5 w-5 mr-2" />
                                                Đăng xuất
                                            </button>

                                            <button className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="h-5 w-5 mr-2" />
                                                Xóa tài khoản
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default ProfilePage;

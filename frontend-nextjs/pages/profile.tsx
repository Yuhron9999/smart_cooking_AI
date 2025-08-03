import React, { useState } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Header from '@/components/layout/Header';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Camera,
    Edit3,
    Save,
    X,
    Globe,
    Lock,
    Bell,
    Shield,
    Heart,
    BookOpen,
    Award,
    TrendingUp,
    Settings,
    ChefHat,
    Star,
    Trophy,
    Target,
    Clock,
    Users,
    Eye
} from 'lucide-react';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar: string;
    phone?: string;
    location?: string;
    bio?: string;
    birthDate?: string;
    joinDate: string;
    language: string;
    timezone: string;
    isPublic: boolean;
    socialLinks?: {
        facebook?: string;
        instagram?: string;
        youtube?: string;
    };
    preferences: {
        cuisine: string[];
        dietaryRestrictions: string[];
        skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
        notifications: {
            email: boolean;
            push: boolean;
            recipes: boolean;
            learning: boolean;
        };
    };
    stats: {
        recipesCreated: number;
        recipesLiked: number;
        coursesCompleted: number;
        hoursLearned: number;
        badges: string[];
        level: string;
        points: number;
    };
}

export default function ProfilePage() {
    const { data: session } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'privacy' | 'stats'>('profile');

    // Mock user profile data
    const [userProfile, setUserProfile] = useState<UserProfile>({
        id: '1',
        name: session?.user?.name || 'Người dùng',
        email: session?.user?.email || 'user@example.com',
        avatar: session?.user?.image || '',
        phone: '+84 901 234 567',
        location: 'Hà Nội, Việt Nam',
        bio: 'Yêu thích nấu ăn và khám phá những món ăn mới. Đam mê chia sẻ công thức với cộng đồng.',
        birthDate: '1990-05-15',
        joinDate: '2024-01-01',
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        isPublic: true,
        socialLinks: {
            facebook: 'https://facebook.com/user',
            instagram: 'https://instagram.com/user'
        },
        preferences: {
            cuisine: ['Việt Nam', 'Á Đông', 'Âu'],
            dietaryRestrictions: ['Không cay', 'Ít đường'],
            skillLevel: 'Intermediate',
            notifications: {
                email: true,
                push: true,
                recipes: true,
                learning: true
            }
        },
        stats: {
            recipesCreated: 24,
            recipesLiked: 156,
            coursesCompleted: 8,
            hoursLearned: 45,
            badges: ['🥉 Bronze Chef', '⭐ Fast Learner', '🏆 Recipe Master', '💝 Community Favorite'],
            level: 'Bronze Chef',
            points: 1250
        }
    });

    const [editForm, setEditForm] = useState(userProfile);

    const cuisineOptions = ['Việt Nam', 'Á Đông', 'Âu', 'Mỹ', 'Ý', 'Nhật', 'Hàn Quốc', 'Thái'];
    const dietaryOptions = ['Chay', 'Không gluten', 'Không lactose', 'Ít đường', 'Ít muối', 'Không cay'];
    const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];

    const handleSaveProfile = () => {
        setUserProfile(editForm);
        setIsEditing(false);
        // API call to save profile
    };

    const handleCancelEdit = () => {
        setEditForm(userProfile);
        setIsEditing(false);
    };

    const handleInputChange = (field: string, value: any) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePreferenceChange = (field: string, value: any) => {
        setEditForm(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [field]: value
            }
        }));
    };

    const handleNotificationChange = (field: string, value: boolean) => {
        setEditForm(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                notifications: {
                    ...prev.preferences.notifications,
                    [field]: value
                }
            }
        }));
    };

    const handleToggleArrayValue = (array: string[], value: string) => {
        return array.includes(value)
            ? array.filter(item => item !== value)
            : [...array, value];
    };

    return (
        <>
            <Head>
                <title>Profile - Smart Cooking AI</title>
                <meta name="description" content="Quản lý hồ sơ cá nhân - Smart Cooking AI" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Header />

                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Profile Header */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                        </div>

                        <div className="px-8 pb-8">
                            <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 relative z-10">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                                        {userProfile.avatar ? (
                                            <img
                                                src={userProfile.avatar}
                                                alt="Avatar"
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                                <User className="h-16 w-16 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-colors"
                                        title="Thay đổi ảnh đại diện"
                                    >
                                        <Camera className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 md:ml-6 mt-4 md:mt-0">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-end">
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900 mb-1">{userProfile.name}</h1>
                                            <p className="text-gray-600 mb-2">{userProfile.bio}</p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span className="flex items-center space-x-1">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{userProfile.location}</span>
                                                </span>
                                                <span className="flex items-center space-x-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Tham gia {new Date(userProfile.joinDate).toLocaleDateString('vi-VN')}</span>
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className="mt-4 md:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                            <span>{isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa hồ sơ'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600 mb-1">{userProfile.stats.recipesCreated}</div>
                                    <div className="text-sm text-gray-600">Công thức tạo</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-600 mb-1">{userProfile.stats.recipesLiked}</div>
                                    <div className="text-sm text-gray-600">Công thức yêu thích</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600 mb-1">{userProfile.stats.coursesCompleted}</div>
                                    <div className="text-sm text-gray-600">Khóa học hoàn thành</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600 mb-1">{userProfile.stats.hoursLearned}h</div>
                                    <div className="text-sm text-gray-600">Thời gian học</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="flex">
                                {[
                                    { id: 'profile', label: 'Thông tin cá nhân', icon: User },
                                    { id: 'preferences', label: 'Sở thích', icon: Heart },
                                    { id: 'privacy', label: 'Quyền riêng tư', icon: Shield },
                                    { id: 'stats', label: 'Thống kê', icon: TrendingUp }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <tab.icon className="h-4 w-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Họ và tên
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <p className="text-gray-900">{userProfile.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <p className="text-gray-900 flex items-center space-x-2">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                <span>{userProfile.email}</span>
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Số điện thoại
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    value={editForm.phone || ''}
                                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Nhập số điện thoại"
                                                    title="Nhập số điện thoại của bạn"
                                                />
                                            ) : (
                                                <p className="text-gray-900 flex items-center space-x-2">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                    <span>{userProfile.phone || 'Chưa cập nhật'}</span>
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Vị trí
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editForm.location || ''}
                                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <p className="text-gray-900 flex items-center space-x-2">
                                                    <MapPin className="h-4 w-4 text-gray-400" />
                                                    <span>{userProfile.location || 'Chưa cập nhật'}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Giới thiệu bản thân
                                        </label>
                                        {isEditing ? (
                                            <textarea
                                                value={editForm.bio || ''}
                                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Hãy chia sẻ về bản thân bạn..."
                                            />
                                        ) : (
                                            <p className="text-gray-900">{userProfile.bio || 'Chưa có giới thiệu'}</p>
                                        )}
                                    </div>

                                    {isEditing && (
                                        <div className="flex space-x-4 pt-6 border-t border-gray-200">
                                            <button
                                                onClick={handleSaveProfile}
                                                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center space-x-2"
                                            >
                                                <Save className="h-4 w-4" />
                                                <span>Lưu thay đổi</span>
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                                            >
                                                <X className="h-4 w-4" />
                                                <span>Hủy</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === 'preferences' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Ẩm thực yêu thích
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {cuisineOptions.map((cuisine) => (
                                                <label key={cuisine} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={editForm.preferences.cuisine.includes(cuisine)}
                                                        onChange={(e) => {
                                                            handlePreferenceChange(
                                                                'cuisine',
                                                                handleToggleArrayValue(editForm.preferences.cuisine, cuisine)
                                                            );
                                                        }}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        title={`Chọn ẩm thực yêu thích: ${cuisine}`}
                                                        placeholder={`Chọn ẩm thực yêu thích: ${cuisine}`}
                                                    />
                                                    <span className="text-sm text-gray-700">{cuisine}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Hạn chế ăn uống
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {dietaryOptions.map((dietary) => (
                                                <label key={dietary} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={editForm.preferences.dietaryRestrictions.includes(dietary)}
                                                        onChange={(e) => {
                                                            handlePreferenceChange(
                                                                'dietaryRestrictions',
                                                                handleToggleArrayValue(editForm.preferences.dietaryRestrictions, dietary)
                                                            );
                                                        }}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{dietary}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Trình độ nấu ăn
                                        </label>
                                        <select
                                            value={editForm.preferences.skillLevel}
                                            onChange={(e) => handlePreferenceChange('skillLevel', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            title="Chọn trình độ nấu ăn"
                                        >
                                            {skillLevels.map((level) => (
                                                <option key={level} value={level}>
                                                    {level === 'Beginner' ? 'Người mới bắt đầu' :
                                                        level === 'Intermediate' ? 'Trung bình' : 'Nâng cao'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Thông báo
                                        </label>
                                        <div className="space-y-3">
                                            {[
                                                { key: 'email', label: 'Thông báo email' },
                                                { key: 'push', label: 'Thông báo đẩy' },
                                                { key: 'recipes', label: 'Công thức mới' },
                                                { key: 'learning', label: 'Khóa học và lộ trình' }
                                            ].map((notification) => (
                                                <label key={notification.key} className="flex items-center justify-between cursor-pointer">
                                                    <span className="text-sm text-gray-700">{notification.label}</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={editForm.preferences.notifications[notification.key as keyof typeof editForm.preferences.notifications]}
                                                        onChange={(e) => handleNotificationChange(notification.key, e.target.checked)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200">
                                        <button
                                            onClick={handleSaveProfile}
                                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2"
                                        >
                                            <Save className="h-4 w-4" />
                                            <span>Lưu sở thích</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Privacy Tab */}
                            {activeTab === 'privacy' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">Hồ sơ công khai</h3>
                                            <p className="text-sm text-gray-600">Cho phép mọi người xem hồ sơ của bạn</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={editForm.isPublic}
                                            onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            title="Chuyển đổi trạng thái hồ sơ công khai"
                                            placeholder="Chuyển đổi trạng thái hồ sơ công khai"
                                        />
                                    </div>

                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Liên kết mạng xã hội</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Facebook
                                                </label>
                                                <input
                                                    type="url"
                                                    value={editForm.socialLinks?.facebook || ''}
                                                    onChange={(e) => handleInputChange('socialLinks', {
                                                        ...editForm.socialLinks,
                                                        facebook: e.target.value
                                                    })}
                                                    placeholder="https://facebook.com/username"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Instagram
                                                </label>
                                                <input
                                                    type="url"
                                                    value={editForm.socialLinks?.instagram || ''}
                                                    onChange={(e) => handleInputChange('socialLinks', {
                                                        ...editForm.socialLinks,
                                                        instagram: e.target.value
                                                    })}
                                                    placeholder="https://instagram.com/username"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200">
                                        <button
                                            onClick={handleSaveProfile}
                                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2"
                                        >
                                            <Save className="h-4 w-4" />
                                            <span>Lưu cài đặt</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Stats Tab */}
                            {activeTab === 'stats' && (
                                <div className="space-y-8">
                                    {/* Achievements */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Huy hiệu đạt được</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {userProfile.stats.badges.map((badge, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-4 text-center text-white"
                                                >
                                                    <div className="text-2xl mb-1">{badge.charAt(0)}</div>
                                                    <div className="text-sm font-medium">{badge.slice(2)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Tiến độ</h3>
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <Trophy className="h-5 w-5 text-orange-500" />
                                                    <span className="font-medium">Cấp độ hiện tại: {userProfile.stats.level}</span>
                                                </div>
                                                <div className="text-sm text-gray-600">{userProfile.stats.points} điểm</div>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                                <div
                                                    className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full"
                                                    style={{ width: '65%' }}
                                                ></div>
                                            </div>
                                            <div className="text-sm text-gray-600">Còn 350 điểm để lên Silver Chef</div>
                                        </div>
                                    </div>

                                    {/* Activity Chart Placeholder */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Hoạt động gần đây</h3>
                                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                                            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-600">Biểu đồ hoạt động sẽ hiển thị ở đây</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const session = await getSession(context);

    return {
        props: {
            session,
        },
    };
};

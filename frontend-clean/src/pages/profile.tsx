// Pages - Profile Page
import React, { useState } from 'react';
import { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Settings,
    Heart,
    BookOpen,
    Award,
    ChefHat,
    Camera,
    Edit,
    Save,
    X,
    Calendar,
    TrendingUp
} from 'lucide-react';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    avatar: string;
    bio: string;
    dietaryPreferences: string[];
    allergies: string[];
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
    favoriteRecipes: number;
    totalRecipes: number;
    cookingStreak: number;
    joinDate: string;
    achievements: Achievement[];
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    earned: boolean;
    earnedDate?: string;
}

const ProfilePage: NextPage = () => {
    const { t } = useTranslation('common');
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Mock user data
    const [userProfile, setUserProfile] = useState<UserProfile>({
        id: '1',
        name: 'Nguyễn Văn An',
        email: 'nguyen.van.an@example.com',
        phone: '+84 123 456 789',
        location: 'Hà Nội, Việt Nam',
        avatar: '/images/profile/avatar.jpg',
        bio: 'Đam mê nấu ăn và khám phá các món ăn mới. Yêu thích những công thức truyền thống Việt Nam.',
        dietaryPreferences: ['vegetarian', 'low-sodium'],
        allergies: ['peanuts', 'shellfish'],
        skillLevel: 'intermediate',
        favoriteRecipes: 47,
        totalRecipes: 123,
        cookingStreak: 15,
        joinDate: '2023-06-15',
        achievements: [
            {
                id: '1',
                title: 'Đầu Bếp Mới',
                description: 'Tạo công thức đầu tiên',
                icon: '👨‍🍳',
                earned: true,
                earnedDate: '2023-06-20'
            },
            {
                id: '2',
                title: 'Người Nấu Ăn Kiên Trì',
                description: 'Nấu ăn 7 ngày liên tiếp',
                icon: '🔥',
                earned: true,
                earnedDate: '2023-07-01'
            },
            {
                id: '3',
                title: 'Chuyên Gia Món Việt',
                description: 'Thành thạo 20 món ăn Việt Nam',
                icon: '🇻🇳',
                earned: false
            }
        ]
    });

    const [editForm, setEditForm] = useState({
        name: userProfile.name,
        phone: userProfile.phone,
        location: userProfile.location,
        bio: userProfile.bio
    });

    const tabs = [
        { id: 'overview', name: t('profile:overview'), icon: User },
        { id: 'recipes', name: t('profile:my_recipes'), icon: BookOpen },
        { id: 'favorites', name: t('profile:favorites'), icon: Heart },
        { id: 'achievements', name: t('profile:achievements'), icon: Award },
        { id: 'settings', name: t('profile:settings'), icon: Settings }
    ];

    const skillLevels = [
        { id: 'beginner', name: t('profile:beginner'), color: 'bg-green-100 text-green-800' },
        { id: 'intermediate', name: t('profile:intermediate'), color: 'bg-yellow-100 text-yellow-800' },
        { id: 'advanced', name: t('profile:advanced'), color: 'bg-red-100 text-red-800' }
    ];

    const handleSaveProfile = () => {
        setUserProfile({
            ...userProfile,
            ...editForm
        });
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditForm({
            name: userProfile.name,
            phone: userProfile.phone,
            location: userProfile.location,
            bio: userProfile.bio
        });
        setIsEditing(false);
    };

    const renderOverviewTab = () => (
        <div className="space-y-6">
            {/* Profile Header */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {userProfile.name.charAt(0)}
                            </div>
                            <Button
                                size="sm"
                                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                            >
                                <Camera className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="space-y-3">
                                    <Input
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        placeholder={t('profile:full_name')}
                                    />
                                    <Input
                                        value={editForm.phone}
                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                        placeholder={t('profile:phone')}
                                    />
                                    <Input
                                        value={editForm.location}
                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                        placeholder={t('profile:location')}
                                    />
                                    <textarea
                                        value={editForm.bio}
                                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                        placeholder={t('profile:bio')}
                                        className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                                        rows={3}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        {userProfile.name}
                                    </h1>
                                    <div className="space-y-2 text-gray-600 mb-4">
                                        <div className="flex items-center">
                                            <Mail className="w-4 h-4 mr-2" />
                                            {userProfile.email}
                                        </div>
                                        <div className="flex items-center">
                                            <Phone className="w-4 h-4 mr-2" />
                                            {userProfile.phone}
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            {userProfile.location}
                                        </div>
                                    </div>
                                    <p className="text-gray-700">{userProfile.bio}</p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                            {isEditing ? (
                                <>
                                    <Button onClick={handleSaveProfile} size="sm">
                                        <Save className="w-4 h-4 mr-2" />
                                        {t('common:save')}
                                    </Button>
                                    <Button onClick={handleCancelEdit} variant="outline" size="sm">
                                        <X className="w-4 h-4 mr-2" />
                                        {t('common:cancel')}
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                                    <Edit className="w-4 h-4 mr-2" />
                                    {t('common:edit')}
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                            {userProfile.totalRecipes}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {t('profile:total_recipes')}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600 mb-1">
                            {userProfile.favoriteRecipes}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center justify-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {t('profile:favorites')}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                            {userProfile.cookingStreak}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {t('profile:cooking_streak')}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                            {userProfile.achievements.filter(a => a.earned).length}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center justify-center">
                            <Award className="w-4 h-4 mr-1" />
                            {t('profile:achievements')}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Skill Level & Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <ChefHat className="w-5 h-5 mr-2" />
                            {t('profile:cooking_level')}
                        </h3>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">{t('profile:current_level')}:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${skillLevels.find(level => level.id === userProfile.skillLevel)?.color
                                }`}>
                                {skillLevels.find(level => level.id === userProfile.skillLevel)?.name}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Calendar className="w-5 h-5 mr-2" />
                            {t('profile:member_since')}
                        </h3>
                        <p className="text-gray-600">
                            {new Date(userProfile.joinDate).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    const renderAchievementsTab = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('profile:your_achievements')}
                </h2>
                <p className="text-gray-600">
                    {t('profile:achievements_description')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userProfile.achievements.map((achievement) => (
                    <motion.div
                        key={achievement.id}
                        whileHover={{ y: -5 }}
                        className="group"
                    >
                        <Card className={`${achievement.earned ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                            <CardContent className="p-6 text-center">
                                <div className={`text-4xl mb-3 ${achievement.earned ? 'grayscale-0' : 'grayscale'}`}>
                                    {achievement.icon}
                                </div>
                                <h3 className={`font-semibold mb-2 ${achievement.earned ? 'text-green-800' : 'text-gray-600'}`}>
                                    {achievement.title}
                                </h3>
                                <p className={`text-sm ${achievement.earned ? 'text-green-700' : 'text-gray-500'}`}>
                                    {achievement.description}
                                </p>
                                {achievement.earned && achievement.earnedDate && (
                                    <p className="text-xs text-green-600 mt-2">
                                        {t('profile:earned_on')} {new Date(achievement.earnedDate).toLocaleDateString('vi-VN')}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
                {/* Header */}
                <section className="py-12 bg-white/80 backdrop-blur-sm">
                    <div className="container mx-auto px-4">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                {t('profile:title')}
                            </h1>
                            <p className="text-xl text-gray-600">
                                {t('profile:subtitle')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Tabs Navigation */}
                <section className="bg-white border-b border-gray-200 sticky top-0 z-40">
                    <div className="container mx-auto px-4">
                        <div className="flex overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tab.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Tab Content */}
                <section className="py-8">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'overview' && renderOverviewTab()}
                            {activeTab === 'achievements' && renderAchievementsTab()}
                            {activeTab === 'recipes' && (
                                <div className="text-center py-16">
                                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                        {t('profile:recipes_coming_soon')}
                                    </h3>
                                </div>
                            )}
                            {activeTab === 'favorites' && (
                                <div className="text-center py-16">
                                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                        {t('profile:favorites_coming_soon')}
                                    </h3>
                                </div>
                            )}
                            {activeTab === 'settings' && (
                                <div className="text-center py-16">
                                    <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                        {t('profile:settings_coming_soon')}
                                    </h3>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'vi', ['common', 'profile'])),
        },
    };
};

export default ProfilePage;

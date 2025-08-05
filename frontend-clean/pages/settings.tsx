import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import LoadingState from '@/components/LoadingState';
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Shield,
    Globe,
    Palette,
    Database,
    Key,
    Mail,
    Phone,
    Volume2,
    VolumeX,
    Moon,
    Sun,
    Monitor,
    Smartphone,
    Save,
    RotateCcw,
    Download,
    Upload,
    Trash2,
    AlertTriangle,
    CheckCircle,
    HelpCircle,
    ExternalLink,
    LogOut,
    RefreshCw
} from 'lucide-react';

interface SettingsData {
    // Account Settings
    account: {
        twoFactorEnabled: boolean;
        emailVerified: boolean;
        phoneVerified: boolean;
        lastPasswordChange: string;
    };

    // Privacy Settings
    privacy: {
        profileVisibility: 'public' | 'private' | 'friends';
        activityTracking: boolean;
        dataCollection: boolean;
        personalization: boolean;
        analytics: boolean;
    };

    // Notification Settings
    notifications: {
        email: {
            newRecipes: boolean;
            weeklyDigest: boolean;
            recipeRecommendations: boolean;
            systemUpdates: boolean;
            securityAlerts: boolean;
        };
        push: {
            enabled: boolean;
            newRecipes: boolean;
            cookingReminders: boolean;
            achievements: boolean;
            socialActivity: boolean;
        };
        sound: {
            enabled: boolean;
            volume: number;
            voiceAssistant: boolean;
        };
    };

    // Appearance Settings
    appearance: {
        theme: 'light' | 'dark' | 'system';
        language: string;
        fontSize: 'small' | 'medium' | 'large';
        animations: boolean;
        compactMode: boolean;
    };

    // Advanced Settings
    advanced: {
        autoSave: boolean;
        offlineMode: boolean;
        debugMode: boolean;
        experimentalFeatures: boolean;
        dataSync: boolean;
    };
}

const Settings: React.FC = () => {
    const { data: session, status } = useSession();
    const [settings, setSettings] = useState<SettingsData | null>(null);
    const [activeSection, setActiveSection] = useState('account');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [exportingData, setExportingData] = useState(false);
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            setLoading(false);
            return;
        }

        // Chỉ load settings một lần khi component mount
        if (!settingsLoaded) {
            const loadSettings = async () => {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Tạo object mới mà không reference đến defaultSettings
                const initialSettings: SettingsData = {
                    account: {
                        twoFactorEnabled: false,
                        emailVerified: true,
                        phoneVerified: false,
                        lastPasswordChange: '2024-01-01'
                    },
                    privacy: {
                        profileVisibility: 'public',
                        activityTracking: true,
                        dataCollection: true,
                        personalization: true,
                        analytics: true
                    },
                    notifications: {
                        email: {
                            newRecipes: true,
                            weeklyDigest: true,
                            recipeRecommendations: true,
                            systemUpdates: true,
                            securityAlerts: true
                        },
                        push: {
                            enabled: true,
                            newRecipes: true,
                            cookingReminders: true,
                            achievements: true,
                            socialActivity: false
                        },
                        sound: {
                            enabled: true,
                            volume: 70,
                            voiceAssistant: true
                        }
                    },
                    appearance: {
                        theme: 'system',
                        language: 'vi',
                        fontSize: 'medium',
                        animations: true,
                        compactMode: false
                    },
                    advanced: {
                        autoSave: true,
                        offlineMode: false,
                        debugMode: false,
                        experimentalFeatures: false,
                        dataSync: true
                    }
                };

                setSettings(initialSettings);
                setSettingsLoaded(true);
                setLoading(false);
            };

            loadSettings();
        }
    }, [session, status, settingsLoaded]); // Added settingsLoaded dependency

    const handleSaveSettings = useCallback(async () => {
        if (!settings) return;

        setSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setHasChanges(false);
        setSaving(false);
    }, [settings]);

    const handleResetSettings = useCallback(async () => {
        // Tạo object mới mà không reference đến defaultSettings
        const freshSettings: SettingsData = {
            account: {
                twoFactorEnabled: false,
                emailVerified: true,
                phoneVerified: false,
                lastPasswordChange: '2024-01-01'
            },
            privacy: {
                profileVisibility: 'public',
                activityTracking: true,
                dataCollection: true,
                personalization: true,
                analytics: true
            },
            notifications: {
                email: {
                    newRecipes: true,
                    weeklyDigest: true,
                    recipeRecommendations: true,
                    systemUpdates: true,
                    securityAlerts: true
                },
                push: {
                    enabled: true,
                    newRecipes: true,
                    cookingReminders: true,
                    achievements: true,
                    socialActivity: false
                },
                sound: {
                    enabled: true,
                    volume: 70,
                    voiceAssistant: true
                }
            },
            appearance: {
                theme: 'system',
                language: 'vi',
                fontSize: 'medium',
                animations: true,
                compactMode: false
            },
            advanced: {
                autoSave: true,
                offlineMode: false,
                debugMode: false,
                experimentalFeatures: false,
                dataSync: true
            }
        };
        setSettings(freshSettings);
        setHasChanges(true);
        setShowResetConfirm(false);
    }, []); // No dependencies

    const handleExportData = useCallback(async () => {
        setExportingData(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock data export
        const exportData = {
            profile: session?.user,
            settings: settings,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'smart-cooking-ai-data.json';
        a.click();
        URL.revokeObjectURL(url);

        setExportingData(false);
    }, [session, settings]);

    const updateSettings = useCallback((path: string, value: boolean | string | number) => {
        if (!settings) return;

        const pathArray = path.split('.');
        const newSettings = { ...settings };
        let current: Record<string, unknown> = newSettings;

        for (let i = 0; i < pathArray.length - 1; i++) {
            current[pathArray[i]] = { ...(current[pathArray[i]] as Record<string, unknown>) };
            current = current[pathArray[i]] as Record<string, unknown>;
        }

        current[pathArray[pathArray.length - 1]] = value;
        setSettings(newSettings);
        setHasChanges(true);
    }, [settings]);

    const sections = [
        { id: 'account', label: 'Tài khoản', icon: User },
        { id: 'privacy', label: 'Quyền riêng tư', icon: Shield },
        { id: 'notifications', label: 'Thông báo', icon: Bell },
        { id: 'appearance', label: 'Giao diện', icon: Palette },
        { id: 'advanced', label: 'Nâng cao', icon: Settings }
    ];

    if (status === 'loading' || loading) {
        return <LoadingState message="Đang tải cài đặt..." showDetails={true} />;
    }

    if (!session) {
        return (
            <>
                <Head>
                    <title>Cài đặt - Smart Cooking AI</title>
                    <meta name="description" content="Cài đặt ứng dụng và tùy chỉnh trải nghiệm" />
                </Head>

                <div className="min-h-screen bg-gray-50">
                    <Header />

                    <main className="container mx-auto px-4 py-8">
                        <div className="max-w-2xl mx-auto text-center">
                            <div className="bg-white rounded-lg shadow-md p-8">
                                <SettingsIcon className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                    Đăng nhập để truy cập cài đặt
                                </h1>
                                <p className="text-gray-600 mb-6">
                                    Đăng nhập để tùy chỉnh trải nghiệm và quản lý cài đặt tài khoản
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

    if (!settings) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">Không thể tải cài đặt</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Cài đặt - Smart Cooking AI</title>
                <meta name="description" content="Cài đặt ứng dụng và tùy chỉnh trải nghiệm" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Header />

                <main className="container mx-auto px-4 py-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                                <SettingsIcon className="h-8 w-8 text-orange-500 mr-3" />
                                Cài đặt
                            </h1>
                            <p className="text-gray-600">Tùy chỉnh trải nghiệm Smart Cooking AI của bạn</p>
                        </div>

                        {/* Save Changes */}
                        {hasChanges && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleSaveSettings}
                                    disabled={saving}
                                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    ) : (
                                        <Save className="h-4 w-4 mr-2" />
                                    )}
                                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                                <button
                                    onClick={() => {
                                        setSettings(defaultSettings);
                                        setHasChanges(false);
                                    }}
                                    className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Hủy
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Sidebar */}
                        <div className="lg:w-1/4">
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <nav className="space-y-2">
                                    {sections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${activeSection === section.id
                                                ? 'bg-orange-100 text-orange-700 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <section.icon className="h-5 w-5 mr-3" />
                                            {section.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="lg:w-3/4">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                {/* Account Settings */}
                                {activeSection === 'account' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cài đặt tài khoản</h2>
                                        </div>

                                        {/* Account Security */}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Bảo mật</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center">
                                                        <Key className="h-5 w-5 text-gray-500 mr-3" />
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">Xác thực hai yếu tố</h4>
                                                            <p className="text-sm text-gray-600">Tăng cường bảo mật cho tài khoản</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {settings.account.twoFactorEnabled ? (
                                                            <span className="text-green-600 text-sm font-medium flex items-center">
                                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                                Đã bật
                                                            </span>
                                                        ) : (
                                                            <span className="text-red-600 text-sm font-medium">Tắt</span>
                                                        )}
                                                        <button
                                                            onClick={() => updateSettings('account.twoFactorEnabled', !settings.account.twoFactorEnabled)}
                                                            className={`px-3 py-1 rounded text-sm font-medium ${settings.account.twoFactorEnabled
                                                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                }`}
                                                        >
                                                            {settings.account.twoFactorEnabled ? 'Tắt' : 'Bật'}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center">
                                                        <Mail className="h-5 w-5 text-gray-500 mr-3" />
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">Email đã xác thực</h4>
                                                            <p className="text-sm text-gray-600">{session?.user?.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        {settings.account.emailVerified ? (
                                                            <span className="text-green-600 text-sm font-medium flex items-center">
                                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                                Đã xác thực
                                                            </span>
                                                        ) : (
                                                            <button className="text-orange-600 text-sm font-medium hover:text-orange-700">
                                                                Xác thực ngay
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center">
                                                        <Phone className="h-5 w-5 text-gray-500 mr-3" />
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">Số điện thoại</h4>
                                                            <p className="text-sm text-gray-600">Thêm số điện thoại để bảo mật</p>
                                                        </div>
                                                    </div>
                                                    <button className="text-orange-600 text-sm font-medium hover:text-orange-700">
                                                        Thêm số
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Mật khẩu</h3>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">Thay đổi mật khẩu</h4>
                                                        <p className="text-sm text-gray-600">
                                                            Lần cuối thay đổi: {new Date(settings.account.lastPasswordChange).toLocaleDateString('vi-VN')}
                                                        </p>
                                                    </div>
                                                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                                                        Đổi mật khẩu
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Privacy Settings */}
                                {activeSection === 'privacy' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quyền riêng tư</h2>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium text-gray-900">Khả năng hiển thị hồ sơ</h4>
                                                </div>
                                                <select
                                                    value={settings.privacy.profileVisibility}
                                                    onChange={(e) => updateSettings('privacy.profileVisibility', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    title="Chọn mức độ hiển thị"
                                                >
                                                    <option value="public">Công khai - Mọi người có thể xem</option>
                                                    <option value="friends">Bạn bè - Chỉ bạn bè có thể xem</option>
                                                    <option value="private">Riêng tư - Chỉ mình tôi</option>
                                                </select>
                                            </div>

                                            {[
                                                { key: 'activityTracking', label: 'Theo dõi hoạt động', desc: 'Cho phép theo dõi cách bạn sử dụng ứng dụng' },
                                                { key: 'dataCollection', label: 'Thu thập dữ liệu', desc: 'Thu thập dữ liệu để cải thiện dịch vụ' },
                                                { key: 'personalization', label: 'Cá nhân hóa', desc: 'Sử dụng dữ liệu để cá nhân hóa trải nghiệm' },
                                                { key: 'analytics', label: 'Phân tích', desc: 'Chia sẻ dữ liệu phân tích ẩn danh' }
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center">
                                                        <Database className="h-5 w-5 text-gray-500 mr-3" />
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{item.label}</h4>
                                                            <p className="text-sm text-gray-600">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        title={item.desc}
                                                        checked={settings.privacy[item.key as keyof typeof settings.privacy] as boolean}
                                                        onChange={(e) => updateSettings(`privacy.${item.key}`, e.target.checked)}
                                                        className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Notification Settings */}
                                {activeSection === 'notifications' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cài đặt thông báo</h2>
                                        </div>

                                        {/* Email Notifications */}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Thông báo Email</h3>
                                            <div className="space-y-3">
                                                {[
                                                    { key: 'newRecipes', label: 'Công thức mới', desc: 'Thông báo khi có công thức mới phù hợp' },
                                                    { key: 'weeklyDigest', label: 'Tóm tắt tuần', desc: 'Tóm tắt hoạt động hàng tuần' },
                                                    { key: 'recipeRecommendations', label: 'Gợi ý công thức', desc: 'Gợi ý công thức dựa trên sở thích' },
                                                    { key: 'systemUpdates', label: 'Cập nhật hệ thống', desc: 'Thông báo về tính năng mới' },
                                                    { key: 'securityAlerts', label: 'Cảnh báo bảo mật', desc: 'Cảnh báo về hoạt động đáng ngờ' }
                                                ].map((item) => (
                                                    <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{item.label}</h4>
                                                            <p className="text-sm text-gray-600">{item.desc}</p>
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            title={item.desc}
                                                            checked={settings.notifications.email[item.key as keyof typeof settings.notifications.email]}
                                                            onChange={(e) => updateSettings(`notifications.email.${item.key}`, e.target.checked)}
                                                            className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Push Notifications */}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Thông báo đẩy</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                                                    <div className="flex items-center">
                                                        <Smartphone className="h-5 w-5 text-orange-500 mr-3" />
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">Bật thông báo đẩy</h4>
                                                            <p className="text-sm text-gray-600">Cho phép nhận thông báo trên thiết bị</p>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        title="Cho phép nhận thông báo trên thiết bị"
                                                        checked={settings.notifications.push.enabled}
                                                        onChange={(e) => updateSettings('notifications.push.enabled', e.target.checked)}
                                                        className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                                                    />
                                                </div>

                                                {settings.notifications.push.enabled && (
                                                    <>
                                                        {[
                                                            { key: 'newRecipes', label: 'Công thức mới' },
                                                            { key: 'cookingReminders', label: 'Nhắc nhở nấu ăn' },
                                                            { key: 'achievements', label: 'Thành tích mới' },
                                                            { key: 'socialActivity', label: 'Hoạt động xã hội' }
                                                        ].map((item) => (
                                                            <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                                <h4 className="font-medium text-gray-900">{item.label}</h4>
                                                                <input
                                                                    type="checkbox"
                                                                    title={item.label}
                                                                    checked={settings.notifications.push[item.key as keyof typeof settings.notifications.push] as boolean}
                                                                    onChange={(e) => updateSettings(`notifications.push.${item.key}`, e.target.checked)}
                                                                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                                                                />
                                                            </div>
                                                        ))}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Sound Settings */}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Âm thanh</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center">
                                                        {settings.notifications.sound.enabled ? (
                                                            <Volume2 className="h-5 w-5 text-gray-500 mr-3" />
                                                        ) : (
                                                            <VolumeX className="h-5 w-5 text-gray-500 mr-3" />
                                                        )}
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">Âm thanh thông báo</h4>
                                                            <p className="text-sm text-gray-600">Phát âm thanh khi có thông báo</p>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.notifications.sound.enabled}
                                                        onChange={(e) => updateSettings('notifications.sound.enabled', e.target.checked)}
                                                        className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                                                        title="Bật/tắt âm thanh thông báo"
                                                    />
                                                </div>

                                                {settings.notifications.sound.enabled && (
                                                    <div className="p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="font-medium text-gray-900">Âm lượng</h4>
                                                            <span className="text-sm text-gray-600">{settings.notifications.sound.volume}%</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            title="Điều chỉnh âm lượng"
                                                            min="0"
                                                            max="100"
                                                            value={settings.notifications.sound.volume}
                                                            onChange={(e) => updateSettings('notifications.sound.volume', parseInt(e.target.value))}
                                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Appearance Settings */}
                                {activeSection === 'appearance' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Giao diện</h2>
                                        </div>

                                        {/* Theme */}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Chủ đề</h3>
                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { value: 'light', label: 'Sáng', icon: Sun },
                                                    { value: 'dark', label: 'Tối', icon: Moon },
                                                    { value: 'system', label: 'Hệ thống', icon: Monitor }
                                                ].map((theme) => (
                                                    <button
                                                        key={theme.value}
                                                        onClick={() => updateSettings('appearance.theme', theme.value)}
                                                        className={`p-4 rounded-lg border-2 flex flex-col items-center space-y-2 transition-colors ${settings.appearance.theme === theme.value
                                                            ? 'border-orange-500 bg-orange-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <theme.icon className="h-6 w-6 text-gray-600" />
                                                        <span className="text-sm font-medium">{theme.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Language */}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Ngôn ngữ</h3>
                                            <select
                                                value={settings.appearance.language}
                                                onChange={(e) => updateSettings('appearance.language', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                title="Chọn ngôn ngữ"
                                            >
                                                <option value="vi">🇻🇳 Tiếng Việt</option>
                                                <option value="en">🇺🇸 English</option>
                                                <option value="ja">🇯🇵 日本語</option>
                                                <option value="ko">🇰🇷 한국어</option>
                                            </select>
                                        </div>

                                        {/* Font Size */}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Kích thước chữ</h3>
                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { value: 'small', label: 'Nhỏ' },
                                                    { value: 'medium', label: 'Vừa' },
                                                    { value: 'large', label: 'Lớn' }
                                                ].map((size) => (
                                                    <button
                                                        key={size.value}
                                                        onClick={() => updateSettings('appearance.fontSize', size.value)}
                                                        className={`p-3 rounded-lg border-2 text-center transition-colors ${settings.appearance.fontSize === size.value
                                                            ? 'border-orange-500 bg-orange-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <span className={`font-medium ${size.value === 'small' ? 'text-sm' :
                                                            size.value === 'large' ? 'text-lg' : 'text-base'
                                                            }`}>
                                                            {size.label}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Other Appearance Settings */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">Hiệu ứng động</h4>
                                                    <p className="text-sm text-gray-600">Hiển thị hiệu ứng chuyển động</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    title="Hiển thị hiệu ứng chuyển động"
                                                    checked={settings.appearance.animations}
                                                    onChange={(e) => updateSettings('appearance.animations', e.target.checked)}
                                                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">Chế độ gọn</h4>
                                                    <p className="text-sm text-gray-600">Giao diện gọn gàng hơn</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    title="Giao diện gọn gàng hơn"
                                                    checked={settings.appearance.compactMode}
                                                    onChange={(e) => updateSettings('appearance.compactMode', e.target.checked)}
                                                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Advanced Settings */}
                                {activeSection === 'advanced' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cài đặt nâng cao</h2>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                {
                                                    key: 'autoSave',
                                                    label: 'Tự động lưu',
                                                    desc: 'Tự động lưu dữ liệu khi thay đổi',
                                                    icon: Save
                                                },
                                                {
                                                    key: 'offlineMode',
                                                    label: 'Chế độ offline',
                                                    desc: 'Cho phép sử dụng ứng dụng khi không có mạng',
                                                    icon: Globe
                                                },
                                                {
                                                    key: 'debugMode',
                                                    label: 'Chế độ debug',
                                                    desc: 'Hiển thị thông tin debug (dành cho nhà phát triển)',
                                                    icon: HelpCircle
                                                },
                                                {
                                                    key: 'experimentalFeatures',
                                                    label: 'Tính năng thử nghiệm',
                                                    desc: 'Bật các tính năng đang thử nghiệm',
                                                    icon: ExternalLink
                                                },
                                                {
                                                    key: 'dataSync',
                                                    label: 'Đồng bộ dữ liệu',
                                                    desc: 'Đồng bộ dữ liệu giữa các thiết bị',
                                                    icon: RefreshCw
                                                }
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center">
                                                        <item.icon className="h-5 w-5 text-gray-500 mr-3" />
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{item.label}</h4>
                                                            <p className="text-sm text-gray-600">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        title={item.desc}
                                                        checked={settings.advanced[item.key as keyof typeof settings.advanced]}
                                                        onChange={(e) => updateSettings(`advanced.${item.key}`, e.target.checked)}
                                                        className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Data Management */}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Quản lý dữ liệu</h3>
                                            <div className="space-y-3">
                                                <button
                                                    onClick={handleExportData}
                                                    disabled={exportingData}
                                                    className="flex items-center w-full p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                                                >
                                                    {exportingData ? (
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700 mr-3"></div>
                                                    ) : (
                                                        <Download className="h-5 w-5 mr-3" />
                                                    )}
                                                    {exportingData ? 'Đang xuất dữ liệu...' : 'Xuất toàn bộ dữ liệu'}
                                                </button>

                                                <button className="flex items-center w-full p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                                                    <Upload className="h-5 w-5 mr-3" />
                                                    Nhập dữ liệu từ file
                                                </button>

                                                <button
                                                    onClick={() => setShowResetConfirm(true)}
                                                    className="flex items-center w-full p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    <RotateCcw className="h-5 w-5 mr-3" />
                                                    Đặt lại tất cả cài đặt
                                                </button>
                                            </div>
                                        </div>

                                        {/* Account Actions */}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Tài khoản</h3>
                                            <div className="space-y-3">
                                                <button
                                                    onClick={() => signOut()}
                                                    className="flex items-center w-full p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                                                >
                                                    <LogOut className="h-5 w-5 mr-3" />
                                                    Đăng xuất
                                                </button>

                                                <button className="flex items-center w-full p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                                                    <Trash2 className="h-5 w-5 mr-3" />
                                                    Xóa tài khoản vĩnh viễn
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Reset Confirmation Modal */}
                    {showResetConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                                <div className="flex items-center mb-4">
                                    <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                                    <h3 className="text-lg font-semibold text-gray-900">Xác nhận đặt lại</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Bạn có chắc chắn muốn đặt lại tất cả cài đặt về mặc định?
                                    Hành động này không thể hoàn tác.
                                </p>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleResetSettings}
                                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                                    >
                                        Đặt lại
                                    </button>
                                    <button
                                        onClick={() => setShowResetConfirm(false)}
                                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default Settings;

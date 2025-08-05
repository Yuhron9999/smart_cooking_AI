// import React, { useState } from 'react';
// import Head from 'next/head';
// import { GetServerSideProps } from 'next';
// import { getSession, signOut } from 'next-auth/react';
// import Header from '@/components/layout/Header';
// import {
//     Settings as SettingsIcon,
//     Bell,
//     Globe,
//     Shield,
//     Eye,
//     Download,
//     Trash2,
//     Key,
//     Smartphone,
//     Mail,
//     Moon,
//     Sun,
//     Volume2,
//     VolumeX,
//     Wifi,
//     WifiOff,
//     Database,
//     HardDrive,
//     Cloud,
//     AlertTriangle,
//     CheckCircle,
//     Info,
//     ExternalLink,
//     LogOut,
//     Save,
//     RefreshCw
// } from 'lucide-react';

// interface AppSettings {
//     theme: 'light' | 'dark' | 'system';
//     language: string;
//     notifications: {
//         push: boolean;
//         email: boolean;
//         sound: boolean;
//         recipes: boolean;
//         learning: boolean;
//         reminders: boolean;
//         social: boolean;
//     };
//     privacy: {
//         profileVisibility: 'public' | 'friends' | 'private';
//         activityTracking: boolean;
//         dataCollection: boolean;
//         personalizedAds: boolean;
//     };
//     display: {
//         fontSize: 'small' | 'medium' | 'large';
//         animations: boolean;
//         autoPlay: boolean;
//     };
//     voice: {
//         enabled: boolean;
//         language: string;
//         speed: number;
//         volume: number;
//     };
//     storage: {
//         cacheSize: string;
//         offlineMode: boolean;
//         autoSync: boolean;
//     };
// }

// export default function SettingsPage() {
//     const [activeSection, setActiveSection] = useState('general');
//     const [isLoading, setIsLoading] = useState(false);
//     const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//     const [settings, setSettings] = useState<AppSettings>({
//         theme: 'light',
//         language: 'vi',
//         notifications: {
//             push: true,
//             email: true,
//             sound: true,
//             recipes: true,
//             learning: true,
//             reminders: true,
//             social: false
//         },
//         privacy: {
//             profileVisibility: 'public',
//             activityTracking: true,
//             dataCollection: false,
//             personalizedAds: false
//         },
//         display: {
//             fontSize: 'medium',
//             animations: true,
//             autoPlay: true
//         },
//         voice: {
//             enabled: true,
//             language: 'vi-VN',
//             speed: 1.0,
//             volume: 0.8
//         },
//         storage: {
//             cacheSize: '250 MB',
//             offlineMode: false,
//             autoSync: true
//         }
//     });

//     const sections = [
//         { id: 'general', label: 'Tổng quan', icon: SettingsIcon },
//         { id: 'notifications', label: 'Thông báo', icon: Bell },
//         { id: 'privacy', label: 'Quyền riêng tư', icon: Shield },
//         { id: 'display', label: 'Hiển thị', icon: Eye },
//         { id: 'voice', label: 'Giọng nói', icon: Volume2 },
//         { id: 'storage', label: 'Lưu trữ', icon: Database },
//         { id: 'account', label: 'Tài khoản', icon: Key }
//     ];

//     const languages = [
//         { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
//         { code: 'en', name: 'English', flag: '🇺🇸' },
//         { code: 'ja', name: '日本語', flag: '🇯🇵' },
//         { code: 'ko', name: '한국어', flag: '🇰🇷' }
//     ];

//     const themes = [
//         { value: 'light', label: 'Sáng', icon: Sun },
//         { value: 'dark', label: 'Tối', icon: Moon },
//         { value: 'system', label: 'Theo hệ thống', icon: Smartphone }
//     ];

//     const handleUpdateSettings = (section: keyof AppSettings, key: string, value: any) => {
//         setSettings(prev => {
//             // If the section is an object, spread and update its key
//             if (typeof prev[section] === 'object' && prev[section] !== null) {
//                 return {
//                     ...prev,
//                     [section]: {
//                         ...prev[section],
//                         [key]: value
//                     }
//                 };
//             } else {
//                 // For primitive sections, update directly
//                 return {
//                     ...prev,
//                     [section]: value
//                 };
//             }
//         });
//     };

//     const handleSaveSettings = async () => {
//         setIsLoading(true);
//         // Simulate API call
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         setIsLoading(false);
//         // Show success message
//     };

//     const handleClearCache = async () => {
//         setIsLoading(true);
//         // Clear cache logic
//         await new Promise(resolve => setTimeout(resolve, 1500));
//         setIsLoading(false);
//     };

//     const handleExportData = () => {
//         // Export user data
//         const data = {
//             profile: 'user profile data',
//             recipes: 'user recipes',
//             favorites: 'favorite recipes',
//             settings: settings
//         };

//         const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'smart-cooking-ai-data.json';
//         a.click();
//         URL.revokeObjectURL(url);
//     };

//     const handleDeleteAccount = async () => {
//         // Delete account logic
//         await signOut({ callbackUrl: '/' });
//     };

//     return (
//         <>
//             <Head>
//                 <title>Settings - Smart Cooking AI</title>
//                 <meta name="description" content="Cài đặt ứng dụng - Smart Cooking AI" />
//             </Head>

//             <div className="min-h-screen bg-gray-50">
//                 <Header />

//                 <div className="max-w-7xl mx-auto px-4 py-8">
//                     {/* Header */}
//                     <div className="text-center mb-8">
//                         <div className="flex justify-center mb-4">
//                             <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
//                                 <SettingsIcon className="h-8 w-8 text-white" />
//                             </div>
//                         </div>
//                         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                             Settings ⚙️
//                         </h1>
//                         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//                             Tùy chỉnh ứng dụng theo sở thích của bạn
//                         </p>
//                     </div>

//                     <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//                         {/* Sidebar */}
//                         <div className="lg:col-span-1">
//                             <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
//                                 <nav className="space-y-2">
//                                     {sections.map((section) => (
//                                         <button
//                                             key={section.id}
//                                             onClick={() => setActiveSection(section.id)}
//                                             className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === section.id
//                                                     ? 'bg-blue-100 text-blue-700 font-medium'
//                                                     : 'text-gray-600 hover:bg-gray-100'
//                                                 }`}
//                                         >
//                                             <section.icon className="h-5 w-5" />
//                                             <span>{section.label}</span>
//                                         </button>
//                                     ))}
//                                 </nav>
//                             </div>
//                         </div>

//                         {/* Content */}
//                         <div className="lg:col-span-3">
//                             <div className="bg-white rounded-2xl shadow-lg p-8">
//                                 {/* General Settings */}
//                                 {activeSection === 'general' && (
//                                     <div className="space-y-8">
//                                         <div>
//                                             <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài đặt tổng quan</h2>

//                                             {/* Theme */}
//                                             <div className="mb-8">
//                                                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                                                     Chủ đề giao diện
//                                                 </label>
//                                                 <div className="grid grid-cols-3 gap-3">
//                                                     {themes.map((theme) => (
//                                                         <button
//                                                             key={theme.value}
//                                                             onClick={() => setSettings(prev => ({ ...prev, theme: theme.value as any }))}
//                                                             className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors ${settings.theme === theme.value
//                                                                     ? 'border-blue-500 bg-blue-50'
//                                                                     : 'border-gray-200 hover:border-gray-300'
//                                                                 }`}
//                                                         >
//                                                             <theme.icon className="h-5 w-5" />
//                                                             <span>{theme.label}</span>
//                                                         </button>
//                                                     ))}
//                                                 </div>
//                                             </div>

//                                             {/* Language */}
//                                             <div className="mb-8">
//                                                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                                                     Ngôn ngữ
//                                                 </label>
//                                                 <div className="grid grid-cols-2 gap-3">
//                                                     {languages.map((lang) => (
//                                                         <button
//                                                             key={lang.code}
//                                                             onClick={() => setSettings(prev => ({ ...prev, language: lang.code }))}
//                                                             className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${settings.language === lang.code
//                                                                     ? 'border-blue-500 bg-blue-50'
//                                                                     : 'border-gray-200 hover:border-gray-300'
//                                                                 }`}
//                                                         >
//                                                             <span className="text-xl">{lang.flag}</span>
//                                                             <span>{lang.name}</span>
//                                                         </button>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Notifications Settings */}
//                                 {activeSection === 'notifications' && (
//                                     <div className="space-y-8">
//                                         <div>
//                                             <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài đặt thông báo</h2>

//                                             <div className="space-y-6">
//                                                 {[
//                                                     { key: 'push', label: 'Thông báo đẩy', description: 'Nhận thông báo trên thiết bị' },
//                                                     { key: 'email', label: 'Thông báo email', description: 'Nhận thông báo qua email' },
//                                                     { key: 'sound', label: 'Âm thanh thông báo', description: 'Phát âm thanh khi có thông báo' },
//                                                     { key: 'recipes', label: 'Công thức mới', description: 'Thông báo về công thức nấu ăn mới' },
//                                                     { key: 'learning', label: 'Khóa học', description: 'Thông báo về tiến độ học tập' },
//                                                     { key: 'reminders', label: 'Nhắc nhở', description: 'Nhắc nhở về việc nấu ăn và học tập' },
//                                                     { key: 'social', label: 'Hoạt động xã hội', description: 'Thông báo về comments, likes' }
//                                                 ].map((notification) => (
//                                                     <div key={notification.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                                                         <div>
//                                                             <div className="font-medium text-gray-900">{notification.label}</div>
//                                                             <div className="text-sm text-gray-600">{notification.description}</div>
//                                                         </div>
//                                                         <input
//                                                             type="checkbox"
//                                                             checked={settings.notifications[notification.key as keyof typeof settings.notifications]}
//                                                             onChange={(e) => handleUpdateSettings('notifications', notification.key, e.target.checked)}
//                                                             className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                                                             title={notification.label}
//                                                         />
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Privacy Settings */}
//                                 {activeSection === 'privacy' && (
//                                     <div className="space-y-8">
//                                         <div>
//                                             <h2 className="text-2xl font-bold text-gray-900 mb-6">Quyền riêng tư</h2>

//                                             <div className="space-y-6">
//                                                 <div className="p-4 border border-gray-200 rounded-lg">
//                                                     <label className="block font-medium text-gray-900 mb-2">
//                                                         Hiển thị hồ sơ
//                                                     </label>
//                                                     <label id="profileVisibilityLabel" className="block font-medium text-gray-900 mb-2">
//                                                         Hiển thị hồ sơ
//                                                     </label>
//                                                     <select
//                                                         aria-labelledby="profileVisibilityLabel"
//                                                         value={settings.privacy.profileVisibility}
//                                                         onChange={(e) => handleUpdateSettings('privacy', 'profileVisibility', e.target.value)}
//                                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                     >
//                                                         <option value="public">Công khai</option>
//                                                         <option value="friends">Chỉ bạn bè</option>
//                                                         <option value="private">Riêng tư</option>
//                                                     </select>
//                                                 </div>

//                                                 {[
//                                                     { key: 'activityTracking', label: 'Theo dõi hoạt động', description: 'Cho phép ứng dụng theo dõi hoạt động của bạn' },
//                                                     { key: 'dataCollection', label: 'Thu thập dữ liệu', description: 'Chia sẻ dữ liệu để cải thiện dịch vụ' },
//                                                     { key: 'personalizedAds', label: 'Quảng cáo cá nhân hóa', description: 'Hiển thị quảng cáo phù hợp với sở thích' }
//                                                 ].map((privacy) => (
//                                                     <div key={privacy.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                                                         <div>
//                                                             <div className="font-medium text-gray-900">{privacy.label}</div>
//                                                             <div className="text-sm text-gray-600">{privacy.description}</div>
//                                                         </div>
//                                                         <input
//                                                             type="checkbox"
//                                                             checked={settings.privacy[privacy.key as keyof typeof settings.privacy]}
//                                                             onChange={(e) => handleUpdateSettings('privacy', privacy.key, e.target.checked)}
//                                                             className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                                                         />
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Display Settings */}
//                                 {activeSection === 'display' && (
//                                     <div className="space-y-8">
//                                         <div>
//                                             <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài đặt hiển thị</h2>

//                                             <div className="space-y-6">
//                                                 <div className="p-4 border border-gray-200 rounded-lg">
//                                                     <label className="block font-medium text-gray-900 mb-2">
//                                                         Kích thước chữ
//                                                     </label>
//                                                     <select
//                                                         value={settings.display.fontSize}
//                                                         onChange={(e) => handleUpdateSettings('display', 'fontSize', e.target.value)}
//                                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                     >
//                                                         <option value="small">Nhỏ</option>
//                                                         <option value="medium">Trung bình</option>
//                                                         <option value="large">Lớn</option>
//                                                     </select>
//                                                 </div>

//                                                 {[
//                                                     { key: 'animations', label: 'Hiệu ứng động', description: 'Hiển thị hiệu ứng chuyển động' },
//                                                     { key: 'autoPlay', label: 'Tự động phát video', description: 'Tự động phát video trong ứng dụng' }
//                                                 ].map((display) => (
//                                                     <div key={display.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                                                         <div>
//                                                             <div className="font-medium text-gray-900">{display.label}</div>
//                                                             <div className="text-sm text-gray-600">{display.description}</div>
//                                                         </div>
//                                                         <input
//                                                             type="checkbox"
//                                                             checked={settings.display[display.key as keyof typeof settings.display]}
//                                                             onChange={(e) => handleUpdateSettings('display', display.key, e.target.checked)}
//                                                             className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                                                             title={display.label}
//                                                         />
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Voice Settings */}
//                                 {activeSection === 'voice' && (
//                                     <div className="space-y-8">
//                                         <div>
//                                             <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài đặt giọng nói</h2>

//                                             <div className="space-y-6">
//                                                 <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                                                     <div>
//                                                         <div className="font-medium text-gray-900">Bật trợ lý giọng nói</div>
//                                                         <div className="text-sm text-gray-600">Sử dụng lệnh giọng nói để điều khiển ứng dụng</div>
//                                                     </div>
//                                                     <input
//                                                         type="checkbox"
//                                                         checked={settings.voice.enabled}
//                                                         onChange={(e) => handleUpdateSettings('voice', 'enabled', e.target.checked)}
//                                                         className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                                                         title="Bật trợ lý giọng nói"
//                                                     />
//                                                 </div>

//                                                 {settings.voice.enabled && (
//                                                     <>
//                                                         <div className="p-4 border border-gray-200 rounded-lg">
//                                                             <label className="block font-medium text-gray-900 mb-2">
//                                                                 Ngôn ngữ giọng nói
//                                                             </label>
//                                                             <select
//                                                                 value={settings.voice.language}
//                                                                 onChange={(e) => handleUpdateSettings('voice', 'language', e.target.value)}
//                                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                             >
//                                                                 <option value="vi-VN">Tiếng Việt</option>
//                                                                 <option value="en-US">English (US)</option>
//                                                                 <option value="ja-JP">日本語</option>
//                                                                 <option value="ko-KR">한국어</option>
//                                                             </select>
//                                                         </div>

//                                                         <div className="p-4 border border-gray-200 rounded-lg">
//                                                             <label className="block font-medium text-gray-900 mb-3">
//                                                                 Tốc độ giọng nói: {settings.voice.speed}x
//                                                             </label>
//                                                             <input
//                                                                 type="range"
//                                                                 min="0.5"
//                                                                 max="2.0"
//                                                                 step="0.1"
//                                                                 value={settings.voice.speed}
//                                                                 onChange={(e) => handleUpdateSettings('voice', 'speed', parseFloat(e.target.value))}
//                                                                 className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                                                             />
//                                                         </div>

//                                                         <div className="p-4 border border-gray-200 rounded-lg">
//                                                             <label className="block font-medium text-gray-900 mb-3">
//                                                                 Âm lượng: {Math.round(settings.voice.volume * 100)}%
//                                                             </label>
//                                                             <input
//                                                                 type="range"
//                                                                 min="0"
//                                                                 max="1"
//                                                                 step="0.1"
//                                                                 value={settings.voice.volume}
//                                                                 onChange={(e) => handleUpdateSettings('voice', 'volume', parseFloat(e.target.value))}
//                                                                 className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                                                             />
//                                                         </div>
//                                                     </>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Storage Settings */}
//                                 {activeSection === 'storage' && (
//                                     <div className="space-y-8">
//                                         <div>
//                                             <h2 className="text-2xl font-bold text-gray-900 mb-6">Quản lý lưu trữ</h2>

//                                             <div className="space-y-6">
//                                                 <div className="p-4 border border-gray-200 rounded-lg">
//                                                     <div className="flex items-center justify-between mb-4">
//                                                         <div>
//                                                             <div className="font-medium text-gray-900">Bộ nhớ cache</div>
//                                                             <div className="text-sm text-gray-600">Đã sử dụng: {settings.storage.cacheSize}</div>
//                                                         </div>
//                                                         <button
//                                                             onClick={handleClearCache}
//                                                             disabled={isLoading}
//                                                             className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
//                                                         >
//                                                             {isLoading ? (
//                                                                 <RefreshCw className="h-4 w-4 animate-spin" />
//                                                             ) : (
//                                                                 <Trash2 className="h-4 w-4" />
//                                                             )}
//                                                             <span>Xóa cache</span>
//                                                         </button>
//                                                     </div>
//                                                     <div className="w-full bg-gray-200 rounded-full h-2">
//                                                         <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
//                                                     </div>
//                                                 </div>

//                                                 {[
//                                                     { key: 'offlineMode', label: 'Chế độ offline', description: 'Cho phép sử dụng ứng dụng khi không có mạng' },
//                                                     { key: 'autoSync', label: 'Tự động đồng bộ', description: 'Tự động đồng bộ dữ liệu khi có mạng' }
//                                                 ].map((storage) => (
//                                                     <div key={storage.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                                                         <div>
//                                                             <div className="font-medium text-gray-900">{storage.label}</div>
//                                                             <div className="text-sm text-gray-600">{storage.description}</div>
//                                                         </div>
//                                                         <input
//                                                             type="checkbox"
                                                            // checked={settings.storage[storage.key as keyof typeof settings.storage]}
                                                            // onChange={(e) => handleUpdateSettings('storage', storage.key, e.target.checked)}
                                                            // className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                                                         />
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Account Settings */}
//                                 {activeSection === 'account' && (
//                                     <div className="space-y-8">
//                                         <div>
//                                             <h2 className="text-2xl font-bold text-gray-900 mb-6">Quản lý tài khoản</h2>

//                                             <div className="space-y-6">
//                                                 <div className="p-4 border border-gray-200 rounded-lg">
//                                                     <h3 className="font-medium text-gray-900 mb-3">Xuất dữ liệu</h3>
//                                                     <p className="text-sm text-gray-600 mb-4">
//                                                         Tải xuống tất cả dữ liệu cá nhân của bạn
//                                                     </p>
//                                                     <button
//                                                         onClick={handleExportData}
//                                                         className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
//                                                     >
//                                                         <Download className="h-4 w-4" />
//                                                         <span>Xuất dữ liệu</span>
//                                                     </button>
//                                                 </div>

//                                                 <div className="p-4 border border-red-200 rounded-lg bg-red-50">
//                                                     <h3 className="font-medium text-red-900 mb-3">Vùng nguy hiểm</h3>
//                                                     <p className="text-sm text-red-700 mb-4">
//                                                         Các hành động này không thể hoàn tác
//                                                     </p>
//                                                     <button
//                                                         onClick={() => setShowDeleteConfirm(true)}
//                                                         className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
//                                                     >
//                                                         <Trash2 className="h-4 w-4" />
//                                                         <span>Xóa tài khoản</span>
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Save Button */}
//                                 {activeSection !== 'account' && (
//                                     <div className="pt-8 border-t border-gray-200">
//                                         <button
//                                             onClick={handleSaveSettings}
//                                             disabled={isLoading}
//                                             className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2"
//                                         >
//                                             {isLoading ? (
//                                                 <RefreshCw className="h-5 w-5 animate-spin" />
//                                             ) : (
//                                                 <Save className="h-5 w-5" />
//                                             )}
//                                             <span>{isLoading ? 'Đang lưu...' : 'Lưu cài đặt'}</span>
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Delete Account Confirmation Modal */}
//                     {showDeleteConfirm && (
//                         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
//                                 <div className="text-center mb-6">
//                                     <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                         <AlertTriangle className="h-8 w-8 text-red-600" />
//                                     </div>
//                                     <h3 className="text-xl font-bold text-gray-900 mb-2">Xóa tài khoản</h3>
//                                     <p className="text-gray-600">
//                                         Bạn có chắc chắn muốn xóa tài khoản? Tất cả dữ liệu sẽ bị mất vĩnh viễn.
//                                     </p>
//                                 </div>

//                                 <div className="flex space-x-3">
//                                     <button
//                                         onClick={() => setShowDeleteConfirm(false)}
//                                         className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                                     >
//                                         Hủy
//                                     </button>
//                                     <button
//                                         onClick={handleDeleteAccount}
//                                         className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
//                                     >
//                                         <Trash2 className="h-4 w-4" />
//                                         <span>Xóa tài khoản</span>
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// }

// export const getServerSideProps: GetServerSideProps = async (context: any) => {
//     const session = await getSession(context);

//     return {
//         props: {
//             session,
//         },
//     };
// };

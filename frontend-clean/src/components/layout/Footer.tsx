// Layout Components - Footer chuyên nghiệp cho Smart Cooking AI
'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import {
    ChefHat,
    Sparkles,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Heart,
    ArrowRight,
    Globe
} from 'lucide-react';

interface FooterProps {
    className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
    const { t } = useTranslation('common');
    const currentYear = new Date().getFullYear();

    const footerSections = {
        product: {
            title: 'Sản phẩm',
            links: [
                { name: t('navigation.recipes'), href: '/recipes' },
                { name: t('navigation.ai_assistant'), href: '/ai' },
                { name: t('navigation.learning'), href: '/learning' },
                { name: t('navigation.voice'), href: '/voice' },
            ]
        },
        company: {
            title: 'Công ty',
            links: [
                { name: t('navigation.about'), href: '/about' },
                { name: 'Blog', href: '/blog' },
                { name: 'Tuyển dụng', href: '/careers' },
                { name: 'Đối tác', href: '/partners' },
            ]
        },
        support: {
            title: 'Hỗ trợ',
            links: [
                { name: t('navigation.help'), href: '/help' },
                { name: t('navigation.contact'), href: '/contact' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Hướng dẫn', href: '/guide' },
            ]
        },
        legal: {
            title: 'Pháp lý',
            links: [
                { name: 'Điều khoản', href: '/terms' },
                { name: 'Bảo mật', href: '/privacy' },
                { name: 'Cookie', href: '/cookies' },
                { name: 'Bản quyền', href: '/copyright' },
            ]
        }
    };

    const socialLinks = [
        { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600' },
        { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-600' },
        { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
        { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:text-red-600' },
    ];

    return (
        <footer className={`bg-gray-900 text-white ${className}`}>
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="relative">
                                <ChefHat className="h-8 w-8 text-orange-500" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full animate-pulse"></div>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                                Smart Cooking AI
                            </span>
                        </div>

                        <p className="text-gray-300 mb-6 max-w-md">
                            Trải nghiệm nấu ăn thông minh với sự hỗ trợ của AI. Khám phá hàng ngàn công thức,
                            học hỏi từ đầu bếp chuyên nghiệp và tạo ra những món ăn tuyệt vời.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-gray-300">
                                <Mail className="h-4 w-4 text-orange-500" />
                                <span>support@smartcookingai.com</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <Phone className="h-4 w-4 text-orange-500" />
                                <span>+84 123 456 789</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <MapPin className="h-4 w-4 text-orange-500" />
                                <span>Hà Nội, Việt Nam</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Links */}
                    {Object.entries(footerSections).map(([key, section]) => (
                        <div key={key}>
                            <h3 className="text-white font-semibold mb-4">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-300 hover:text-orange-500 transition-colors text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter Subscription */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Đăng ký nhận thông tin</h3>
                            <p className="text-gray-300">
                                Nhận công thức mới, mẹo nấu ăn và cập nhật từ Smart Cooking AI
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"
                                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105">
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </div>

                {/* Social Links & Language */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        {/* Social Links */}
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-400">Theo dõi chúng tôi:</span>
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        className={`text-gray-400 ${social.color} transition-colors`}
                                        aria-label={social.name}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </a>
                                );
                            })}
                        </div>

                        {/* Language Selector */}
                        <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <select
                                className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white focus:ring-2 focus:ring-orange-500"
                                title="Chọn ngôn ngữ"
                                aria-label="Chọn ngôn ngữ hiển thị"
                            >
                                <option value="vi">Tiếng Việt</option>
                                <option value="en">English</option>
                                <option value="ja">日本語</option>
                                <option value="ko">한국어</option>
                                <option value="zh">中文</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-gray-950 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-1 text-sm text-gray-400">
                            <span>© {currentYear} Smart Cooking AI. Made with</span>
                            <Heart className="h-4 w-4 text-red-500" />
                            <span>in Vietnam</span>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                            <span>Phiên bản 1.0.0</span>
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Hoạt động</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

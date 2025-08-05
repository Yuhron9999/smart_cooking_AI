import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
    ArrowLeft,
    HelpCircle,
    Search,
    ChevronDown,
    ChevronRight,
    Book,
    MessageCircle,
    Video,
    Phone,
    Mail,
    ExternalLink,
    Star,
    Clock,
    Users,
    ChefHat,
    Mic,
    Camera,
    Settings,
    Shield,
    CreditCard,
    AlertCircle,
    CheckCircle,
    Info,
    Lightbulb,
    FileText,
    PlayCircle,
    Download,
    Globe,
    Smartphone,
    Headphones,
    MessageSquare,
    Bot,
    Eye
} from 'lucide-react';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
    helpful: number;
    views: number;
}

interface HelpCategory {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    description: string;
    articleCount: number;
    color: string;
}

interface GuideVideo {
    id: string;
    title: string;
    description: string;
    duration: string;
    views: number;
    thumbnail: string;
    category: string;
}

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'faq' | 'guides' | 'videos' | 'contact'>('faq');

    const categories: HelpCategory[] = [
        {
            id: 'getting-started',
            name: 'Bắt đầu sử dụng',
            icon: Lightbulb,
            description: 'Hướng dẫn cơ bản cho người mới',
            articleCount: 12,
            color: 'text-green-500'
        },
        {
            id: 'recipes',
            name: 'Công thức nấu ăn',
            icon: ChefHat,
            description: 'Tìm hiểu về công thức và cách nấu ăn',
            articleCount: 28,
            color: 'text-orange-500'
        },
        {
            id: 'ai-features',
            name: 'Tính năng AI',
            icon: Bot,
            description: 'Sử dụng trợ lý AI và các tính năng thông minh',
            articleCount: 15,
            color: 'text-purple-500'
        },
        {
            id: 'voice-assistant',
            name: 'Trợ lý giọng nói',
            icon: Mic,
            description: 'Hướng dẫn sử dụng tính năng giọng nói',
            articleCount: 8,
            color: 'text-blue-500'
        },
        {
            id: 'account',
            name: 'Tài khoản',
            icon: Users,
            description: 'Quản lý tài khoản và cài đặt',
            articleCount: 10,
            color: 'text-indigo-500'
        },
        {
            id: 'troubleshooting',
            name: 'Khắc phục sự cố',
            icon: AlertCircle,
            description: 'Giải quyết các vấn đề thường gặp',
            articleCount: 18,
            color: 'text-red-500'
        }
    ];

    const faqItems: FAQItem[] = [
        {
            id: '1',
            question: 'Làm thế nào để tạo công thức nấu ăn với AI?',
            answer: 'Để tạo công thức với AI, bạn có thể: 1) Vào trang AI Chat và mô tả nguyên liệu bạn có. 2) Sử dụng tính năng "Tạo công thức từ ảnh" bằng cách chụp ảnh nguyên liệu. 3) Nói với trợ lý giọng nói những gì bạn muốn nấu. AI sẽ đề xuất công thức phù hợp với nguyên liệu và sở thích của bạn.',
            category: 'ai-features',
            helpful: 45,
            views: 234
        },
        {
            id: '2',
            question: 'Tại sao trợ lý giọng nói không hoạt động?',
            answer: 'Có một số nguyên nhân khiến trợ lý giọng nói không hoạt động: 1) Kiểm tra microphone có được cấp quyền không. 2) Đảm bảo bạn đang sử dụng trình duyệt hỗ trợ (Chrome, Edge, Safari mới nhất). 3) Kiểm tra kết nối internet ổn định. 4) Vào Cài đặt > Giọng nói để kiểm tra cấu hình. Nếu vẫn không được, hãy thử refresh trang.',
            category: 'voice-assistant',
            helpful: 38,
            views: 189
        },
        {
            id: '3',
            question: 'Làm thế nào để lưu công thức yêu thích?',
            answer: 'Để lưu công thức yêu thích: 1) Khi xem công thức, click vào biểu tượng ❤️ ở góc trên. 2) Công thức sẽ được tự động lưu vào mục "Yêu thích". 3) Bạn có thể tạo bộ sưu tập để sắp xếp công thức theo chủ đề. 4) Truy cập trang "Yêu thích" để xem tất cả công thức đã lưu.',
            category: 'recipes',
            helpful: 52,
            views: 312
        },
        {
            id: '4',
            question: 'Tại sao không đăng nhập được bằng Google?',
            answer: 'Nếu không đăng nhập được bằng Google: 1) Kiểm tra bạn đã cho phép popup trên trình duyệt. 2) Xóa cache và cookies của trang web. 3) Thử tắt các extension chặn quảng cáo tạm thời. 4) Đảm bảo tài khoản Google của bạn đang hoạt động bình thường. 5) Thử sử dụng chế độ ẩn danh để kiểm tra.',
            category: 'account',
            helpful: 29,
            views: 156
        },
        {
            id: '5',
            question: 'AI có thể nhận dạng được những loại thực phẩm nào từ ảnh?',
            answer: 'AI có thể nhận dạng hầu hết các loại thực phẩm phổ biến: 1) Rau củ quả tươi. 2) Các loại thịt, cá, hải sản. 3) Gia vị, ngũ cốc, đậu. 4) Sản phẩm chế biến sẵn. 5) Món ăn hoàn thành. Để có kết quả tốt nhất, chụp ảnh trong ánh sáng đủ, góc nhìn rõ ràng và không có quá nhiều vật thể trong một ảnh.',
            category: 'ai-features',
            helpful: 41,
            views: 201
        },
        {
            id: '6',
            question: 'Làm thế nào để thay đổi ngôn ngữ ứng dụng?',
            answer: 'Để thay đổi ngôn ngữ: 1) Vào menu Cài đặt từ thanh điều hướng. 2) Chọn tab "Khu vực & Ngôn ngữ". 3) Trong mục "Ngôn ngữ", chọn ngôn ngữ mong muốn. 4) Ứng dụng sẽ tự động cập nhật sang ngôn ngữ mới. Hiện tại hỗ trợ Tiếng Việt, English, 日本語, 한국어 và中文.',
            category: 'account',
            helpful: 33,
            views: 145
        },
        {
            id: '7',
            question: 'Tính năng nào cần kết nối internet?',
            answer: 'Các tính năng cần internet: 1) Trợ lý AI chat và tạo công thức. 2) Nhận dạng hình ảnh thực phẩm. 3) Trợ lý giọng nói (chuyển đổi giọng nói). 4) Đồng bộ dữ liệu giữa các thiết bị. 5) Tải xuống công thức mới. Một số tính năng cơ bản như xem công thức đã lưu có thể hoạt động offline.',
            category: 'troubleshooting',
            helpful: 27,
            views: 98
        },
        {
            id: '8',
            question: 'Làm thế nào để chia sẻ công thức với bạn bè?',
            answer: 'Để chia sẻ công thức: 1) Mở công thức muốn chia sẻ. 2) Click vào biểu tượng "Chia sẻ" 📤. 3) Chọn phương thức: Link, Social media, Email, hoặc QR code. 4) Nếu là công thức riêng tư, bạn cần đặt thành "Công khai" trước khi chia sẻ. 5) Người nhận có thể xem và lưu công thức vào tài khoản của họ.',
            category: 'recipes',
            helpful: 36,
            views: 167
        }
    ];

    const guideVideos: GuideVideo[] = [
        {
            id: '1',
            title: 'Hướng dẫn sử dụng Smart Cooking AI cho người mới',
            description: 'Video giới thiệu tổng quan về tất cả tính năng và cách sử dụng cơ bản',
            duration: '8:24',
            views: 1250,
            thumbnail: '/api/placeholder/300/180',
            category: 'getting-started'
        },
        {
            id: '2',
            title: 'Tạo công thức nấu ăn với AI từ A-Z',
            description: 'Hướng dẫn chi tiết cách sử dụng AI để tạo công thức từ nguyên liệu có sẵn',
            duration: '12:15',
            views: 890,
            thumbnail: '/api/placeholder/300/180',
            category: 'ai-features'
        },
        {
            id: '3',
            title: 'Sử dụng trợ lý giọng nói hiệu quả',
            description: 'Các lệnh giọng nói hữu ích và cách tối ưu hóa trải nghiệm voice',
            duration: '6:45',
            views: 672,
            thumbnail: '/api/placeholder/300/180',
            category: 'voice-assistant'
        },
        {
            id: '4',
            title: 'Nhận dạng thực phẩm bằng camera',
            description: 'Cách chụp ảnh và sử dụng AI để nhận dạng nguyên liệu',
            duration: '5:30',
            views: 534,
            thumbnail: '/api/placeholder/300/180',
            category: 'ai-features'
        }
    ];

    const filteredFAQs = faqItems.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleFAQ = (id: string) => {
        setExpandedFAQ(expandedFAQ === id ? null : id);
    };

    const markHelpful = (id: string) => {
        // Simulate API call to mark as helpful
        console.log(`Marked FAQ ${id} as helpful`);
    };

    return (
        <div className="page-container min-h-screen bg-gray-50">
            <Head>
                <title>Trợ Giúp - Smart Cooking AI</title>
                <meta name="description" content="Trung tâm trợ giúp và hướng dẫn sử dụng Smart Cooking AI" />
            </Head>

            {/* Header */}
            <nav className="navbar bg-white border-b">
                <div className="container-modern">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                                <span>Về trang chủ</span>
                            </Link>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <div className="flex items-center space-x-2">
                                <HelpCircle className="w-6 h-6 text-orange-500" />
                                <span className="text-xl font-bold gradient-text">Trợ Giúp</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link href="/contact" className="btn-outline">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Liên hệ hỗ trợ
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto p-4">
                {/* Hero Section */}
                <div className="text-center py-12 mb-8">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl font-bold gradient-text mb-4">
                            Chúng tôi có thể giúp gì cho bạn?
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Tìm câu trả lời nhanh chóng hoặc khám phá hướng dẫn chi tiết
                        </p>

                        {/* Search */}
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm câu hỏi, hướng dẫn..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Quick Help Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {categories.map(category => (
                        <div
                            key={category.id}
                            onClick={() => {
                                setSelectedCategory(category.id);
                                setActiveTab('faq');
                            }}
                            className="card hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-lg bg-gray-50 group-hover:bg-orange-50 transition-colors`}>
                                        <category.icon className={`w-6 h-6 ${category.color} group-hover:text-orange-500 transition-colors`} />
                                    </div>
                                    <span className="text-sm text-gray-500">{category.articleCount} bài viết</span>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {category.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="border-b">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'faq', label: 'Câu hỏi thường gặp', icon: HelpCircle },
                                { id: 'guides', label: 'Hướng dẫn', icon: Book },
                                { id: 'videos', label: 'Video hướng dẫn', icon: Video },
                                { id: 'contact', label: 'Liên hệ', icon: MessageCircle }
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id as any)}
                                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === id
                                            ? 'border-orange-500 text-orange-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* FAQ Tab */}
                        {activeTab === 'faq' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Câu hỏi thường gặp</h2>

                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="input-field w-64"
                                        aria-label="Lọc theo danh mục"
                                        title="Lọc theo danh mục"
                                    >
                                        <option value="all">Tất cả danh mục</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    {filteredFAQs.length === 0 ? (
                                        <div className="text-center py-12">
                                            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-600 mb-2">
                                                Không tìm thấy câu hỏi phù hợp
                                            </h3>
                                            <p className="text-gray-500 mb-4">
                                                Hãy thử từ khóa khác hoặc liên hệ với chúng tôi
                                            </p>
                                            <button
                                                onClick={() => setActiveTab('contact')}
                                                className="btn-primary"
                                            >
                                                Liên hệ hỗ trợ
                                            </button>
                                        </div>
                                    ) : (
                                        filteredFAQs.map(faq => (
                                            <div key={faq.id} className="border border-gray-200 rounded-lg">
                                                <button
                                                    onClick={() => toggleFAQ(faq.id)}
                                                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                                >
                                                    <h3 className="font-medium text-gray-900 pr-4">
                                                        {faq.question}
                                                    </h3>
                                                    {expandedFAQ === faq.id ? (
                                                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                                    ) : (
                                                        <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                                    )}
                                                </button>

                                                {expandedFAQ === faq.id && (
                                                    <div className="px-6 pb-4 border-t bg-gray-50">
                                                        <div className="pt-4">
                                                            <p className="text-gray-700 leading-relaxed mb-4">
                                                                {faq.answer}
                                                            </p>

                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                                    <span className="flex items-center">
                                                                        <Eye className="w-4 h-4 mr-1" />
                                                                        {faq.views} lượt xem
                                                                    </span>
                                                                    <span className="flex items-center">
                                                                        <Star className="w-4 h-4 mr-1" />
                                                                        {faq.helpful} hữu ích
                                                                    </span>
                                                                </div>

                                                                <button
                                                                    onClick={() => markHelpful(faq.id)}
                                                                    className="flex items-center space-x-1 text-sm text-orange-600 hover:text-orange-700 font-medium"
                                                                >
                                                                    <CheckCircle className="w-4 h-4" />
                                                                    <span>Hữu ích</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Guides Tab */}
                        {activeTab === 'guides' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Hướng dẫn chi tiết</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {categories.map(category => (
                                        <div key={category.id} className="card hover:shadow-md transition-shadow">
                                            <div className="p-6">
                                                <div className="flex items-center mb-4">
                                                    <div className={`p-2 rounded-lg bg-gray-50 mr-3`}>
                                                        <category.icon className={`w-5 h-5 ${category.color}`} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                                        <p className="text-sm text-gray-500">{category.articleCount} bài viết</p>
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 text-sm mb-4">
                                                    {category.description}
                                                </p>

                                                <div className="space-y-2">
                                                    <Link
                                                        href={`/help/guides/${category.id}/getting-started`}
                                                        className="flex items-center text-sm text-orange-600 hover:text-orange-700"
                                                    >
                                                        <FileText className="w-4 h-4 mr-2" />
                                                        Bắt đầu với {category.name}
                                                    </Link>
                                                    <Link
                                                        href={`/help/guides/${category.id}/advanced`}
                                                        className="flex items-center text-sm text-orange-600 hover:text-orange-700"
                                                    >
                                                        <FileText className="w-4 h-4 mr-2" />
                                                        Hướng dẫn nâng cao
                                                    </Link>
                                                    <Link
                                                        href={`/help/guides/${category.id}/tips`}
                                                        className="flex items-center text-sm text-orange-600 hover:text-orange-700"
                                                    >
                                                        <Lightbulb className="w-4 h-4 mr-2" />
                                                        Mẹo và thủ thuật
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Videos Tab */}
                        {activeTab === 'videos' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Video hướng dẫn</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {guideVideos.map(video => (
                                        <div key={video.id} className="card hover:shadow-md transition-shadow group cursor-pointer">
                                            <div className="relative">
                                                <div className="aspect-video bg-gradient-to-br from-orange-100 to-pink-100 rounded-t-lg flex items-center justify-center">
                                                    <PlayCircle className="w-16 h-16 text-orange-500 group-hover:text-orange-600 transition-colors" />
                                                </div>
                                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                                    {video.duration}
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                                    {video.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                    {video.description}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <span className="flex items-center">
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        {video.views.toLocaleString()} lượt xem
                                                    </span>
                                                    <span className="px-2 py-1 bg-gray-100 rounded-full">
                                                        {categories.find(c => c.id === video.category)?.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact Tab */}
                        {activeTab === 'contact' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Liên hệ hỗ trợ</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="card">
                                            <div className="p-6">
                                                <div className="flex items-center mb-4">
                                                    <MessageSquare className="w-6 h-6 text-blue-500 mr-3" />
                                                    <h3 className="text-lg font-semibold text-gray-900">Chat trực tiếp</h3>
                                                </div>
                                                <p className="text-gray-600 mb-4">
                                                    Nhận hỗ trợ ngay lập tức từ đội ngũ của chúng tôi
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-green-600 font-medium">
                                                        ● Đang trực tuyến
                                                    </span>
                                                    <button className="btn-primary">
                                                        Bắt đầu chat
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card">
                                            <div className="p-6">
                                                <div className="flex items-center mb-4">
                                                    <Mail className="w-6 h-6 text-orange-500 mr-3" />
                                                    <h3 className="text-lg font-semibold text-gray-900">Email hỗ trợ</h3>
                                                </div>
                                                <p className="text-gray-600 mb-4">
                                                    Gửi email chi tiết về vấn đề của bạn
                                                </p>
                                                <div className="space-y-2">
                                                    <div className="text-sm text-gray-600">
                                                        <strong>Email:</strong> support@smartcookingai.com
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        <strong>Thời gian phản hồi:</strong> Trong 24 giờ
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card">
                                            <div className="p-6">
                                                <div className="flex items-center mb-4">
                                                    <Phone className="w-6 h-6 text-green-500 mr-3" />
                                                    <h3 className="text-lg font-semibold text-gray-900">Hotline</h3>
                                                </div>
                                                <p className="text-gray-600 mb-4">
                                                    Gọi điện trực tiếp để được hỗ trợ nhanh chóng
                                                </p>
                                                <div className="space-y-2">
                                                    <div className="text-sm text-gray-600">
                                                        <strong>Số điện thoại:</strong> 1900 123 456
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        <strong>Giờ làm việc:</strong> 8:00 - 22:00 (T2-CN)
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Form */}
                                    <div className="card">
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                Gửi yêu cầu hỗ trợ
                                            </h3>

                                            <form className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Loại vấn đề
                                                    </label>
                                                    <select className="input-field" aria-label="Loại vấn đề" title="Loại vấn đề">
                                                        <option>Lỗi kỹ thuật</option>
                                                        <option>Tính năng AI</option>
                                                        <option>Tài khoản</option>
                                                        <option>Thanh toán</option>
                                                        <option>Khác</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Email của bạn
                                                    </label>
                                                    <input
                                                        type="email"
                                                        placeholder="email@example.com"
                                                        className="input-field"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Tiêu đề
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Mô tả ngắn về vấn đề"
                                                        className="input-field"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Mô tả chi tiết
                                                    </label>
                                                    <textarea
                                                        rows={5}
                                                        placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải..."
                                                        className="input-field resize-none"
                                                    ></textarea>
                                                </div>

                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="urgent"
                                                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                                    />
                                                    <label htmlFor="urgent" className="ml-2 text-sm text-gray-700">
                                                        Đây là vấn đề khẩn cấp
                                                    </label>
                                                </div>

                                                <button type="submit" className="w-full btn-primary">
                                                    Gửi yêu cầu hỗ trợ
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mt-12 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Liên kết hữu ích
                        </h2>
                        <p className="text-gray-600">
                            Các tài nguyên và liên kết giúp bạn sử dụng Smart Cooking AI hiệu quả hơn
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/terms" className="flex items-center justify-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-center">
                            <div>
                                <FileText className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                                <span className="text-sm font-medium text-gray-900">Điều khoản</span>
                            </div>
                        </Link>

                        <Link href="/privacy" className="flex items-center justify-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-center">
                            <div>
                                <Shield className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                                <span className="text-sm font-medium text-gray-900">Bảo mật</span>
                            </div>
                        </Link>

                        <Link href="/community" className="flex items-center justify-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-center">
                            <div>
                                <Users className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                                <span className="text-sm font-medium text-gray-900">Cộng đồng</span>
                            </div>
                        </Link>

                        <Link href="/blog" className="flex items-center justify-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-center">
                            <div>
                                <Globe className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                                <span className="text-sm font-medium text-gray-900">Blog</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Smart Cooking AI - Homepage với Beautiful UI/UX & Business Logic
import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import {
    ChefHat,
    Sparkles,
    Users,
    BookOpen,
    Star,
    Play,
    ArrowRight,
    Mic,
    Camera,
    Heart,
    Clock,
    TrendingUp,
    Award,
    Globe,
    Shield
} from 'lucide-react';
import { SafeStats } from '../src/components/ClientOnly';
import GoogleOAuthButton from '../src/components/common/GoogleOAuthButtonNew';

// Utility function để format số một cách consistent (tránh hydration mismatch)
const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
};

// Animation Hook với Intersection Observer
const useScrollAnimation = () => {
    const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleElements(prev => new Set([...prev, entry.target.id]));
                    }
                });
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        // Observe all elements with animation-target class
        const targets = document.querySelectorAll('.animation-target');
        targets.forEach(target => observer.observe(target));

        return () => observer.disconnect();
    }, []);

    return visibleElements;
};

// Floating Elements Component
const FloatingElements: React.FC = () => (
    <div className="floating-elements">
        <div className="floating-element text-orange-300" style={{ left: '10%', top: '20%' }}>
            <ChefHat size={40} className="animate-float" />
        </div>
        <div className="floating-element text-pink-300" style={{ left: '80%', top: '15%' }}>
            <Sparkles size={35} className="animate-float" style={{ animationDelay: '1s' }} />
        </div>
        <div className="floating-element text-purple-300" style={{ left: '15%', top: '70%' }}>
            <Heart size={30} className="animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="floating-element text-green-300" style={{ left: '85%', top: '75%' }}>
            <Star size={32} className="animate-float" style={{ animationDelay: '3s' }} />
        </div>
    </div>
);

interface Recipe {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    cookingTime: number;
    difficulty: "MEDIUM" | "EASY" | "HARD";
    rating: number;
}

const HomePage: NextPage = () => {
    const visibleElements = useScrollAnimation();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Static data - trong thực tế sẽ fetch từ API
    const featuredRecipes: Recipe[] = [
        {
            id: 1,
            title: "Phở Bò Truyền Thống 🍜",
            description: "Món phở bò đậm đà hương vị Việt Nam với nước dùng được ninh từ xương bò trong 12 tiếng",
            imageUrl: "/images/pho-bo.jpg",
            cookingTime: 180,
            difficulty: "MEDIUM",
            rating: 4.8
        },
        {
            id: 2,
            title: "Bánh Mì Việt Nam 🥖",
            description: "Bánh mì giòn tan với nhân thịt thơm ngon và rau củ tươi mát đặc trưng Sài Gòn",
            imageUrl: "/images/banh-mi.jpg",
            cookingTime: 30,
            difficulty: "EASY",
            rating: 4.6
        },
        {
            id: 3,
            title: "Cơm Tấm Sài Gòn 🍚",
            description: "Cơm tấm thơm dẻo với sườn nướng và đồ chua đặc trưng miền Nam",
            imageUrl: "/images/com-tam.jpg",
            cookingTime: 45,
            difficulty: "MEDIUM",
            rating: 4.7
        }
    ];

    const stats = {
        totalRecipes: 1500,
        totalUsers: 25000,
        totalLessons: 120,
        avgRating: 4.7
    };

    // Parallax mouse effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="page-container">
            {/* Header/Navigation */}
            <nav className="navbar">
                <div className="container-modern">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-2">
                            <ChefHat className="h-8 w-8 text-orange-500" />
                            <span className="text-2xl font-bold gradient-text">Smart Cooking AI</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-6">
                            <Link href="/" className="nav-link-active">Trang chủ</Link>
                            <Link href="/recipes" className="nav-link">Công thức</Link>
                            <Link href="/ai-chat" className="nav-link">AI Chat</Link>
                            <Link href="/simple-ai-test" className="nav-link">AI Test</Link>
                            <Link href="/learning" className="nav-link">Học tập</Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <GoogleOAuthButton />
                            <button className="btn-primary">Bắt đầu</button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section với Advanced Animations */}
            <section id="hero" className="hero-section animation-target">
                <FloatingElements />

                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div
                        className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"
                        style={{
                            top: '20%',
                            left: '10%',
                            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
                        }}
                    />
                    <div
                        className="absolute w-64 h-64 bg-yellow-300/20 rounded-full blur-2xl animate-pulse"
                        style={{
                            top: '60%',
                            right: '15%',
                            transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px)`,
                        }}
                    />
                </div>

                <div className="hero-content">
                    <div className={`transition-all duration-1000 transform ${visibleElements.has('hero')
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-10 opacity-0'
                        }`}>
                        <h1 className="hero-title">
                            Nấu Ăn Thông Minh với AI 🍳
                        </h1>
                        <p className="hero-subtitle">
                            Khám phá hàng ngàn công thức, học từ AI, và trở thành chef chuyên nghiệp với trợ lý nấu ăn thông minh của chúng tôi!
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                            <Link href="/ai-chat" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Trò chuyện với AI
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="/simple-ai-test" className="btn-glass text-lg px-8 py-4 flex items-center gap-2">
                                <Play className="w-5 h-5" />
                                Test AI Features
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section id="stats" className="py-16 animation-target">
                <div className="container-modern">
                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 transform ${visibleElements.has('stats')
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-10 opacity-0'
                        }`}>
                        <div className="stats-card">
                            <div className="stats-number">
                                <SafeStats value={stats.totalRecipes} />
                            </div>
                            <div className="stats-label">Công thức</div>
                        </div>
                        <div className="stats-card">
                            <div className="stats-number">
                                <SafeStats value={stats.totalUsers} />
                            </div>
                            <div className="stats-label">Người dùng</div>
                        </div>
                        <div className="stats-card">
                            <div className="stats-number">{stats.totalLessons}+</div>
                            <div className="stats-label">Bài học</div>
                        </div>
                        <div className="stats-card">
                            <div className="stats-number">{stats.avgRating}/5</div>
                            <div className="stats-label">Đánh giá</div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Features Section */}
            <section id="features" className="py-20 animation-target">
                <div className="container-modern">
                    <div className={`text-center mb-16 transition-all duration-1000 transform ${visibleElements.has('features')
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-10 opacity-0'
                        }`}>
                        <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
                            Tính Năng Nổi Bật 🌟
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Khám phá những tính năng AI tiên tiến giúp bạn nấu ăn như một chef chuyên nghiệp
                        </p>
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-200 transform ${visibleElements.has('features')
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-10 opacity-0'
                        }`}>

                        <div className="feature-card">
                            <div className="feature-icon">🤖</div>
                            <h3 className="feature-title">AI Chat Thông Minh</h3>
                            <p className="feature-description">
                                Trò chuyện với AI để được tư vấn công thức, kỹ thuật nấu ăn và mẹo hay từ các chef chuyên nghiệp
                            </p>
                            <Link href="/ai-chat" className="btn-outline mt-4 inline-flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Thử ngay
                            </Link>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🎤</div>
                            <h3 className="feature-title">Trợ Lý Giọng Nói</h3>
                            <p className="feature-description">
                                Điều khiển bằng giọng nói, hỏi đáp với AI và nhận hướng dẫn nấu ăn step-by-step trong khi nấu
                            </p>
                            <Link href="/voice-assistant" className="btn-outline mt-4 inline-flex items-center gap-2">
                                <Mic className="w-4 h-4" />
                                Dùng thử
                            </Link>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">📸</div>
                            <h3 className="feature-title">Nhận Dạng Món Ăn</h3>
                            <p className="feature-description">
                                Chụp ảnh món ăn để AI nhận dạng và gợi ý công thức, nguyên liệu cũng như cách chế biến
                            </p>
                            <Link href="/food-recognition" className="btn-outline mt-4 inline-flex items-center gap-2">
                                <Camera className="w-4 h-4" />
                                Scan ngay
                            </Link>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">📚</div>
                            <h3 className="feature-title">Lộ Trình Học Tập</h3>
                            <p className="feature-description">
                                AI tạo lộ trình học nấu ăn cá nhân hóa từ cơ bản đến nâng cao theo sở thích và khả năng
                            </p>
                            <Link href="/learning" className="btn-outline mt-4 inline-flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Bắt đầu học
                            </Link>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🌍</div>
                            <h3 className="feature-title">Ẩm Thực Vùng Miền</h3>
                            <p className="feature-description">
                                Khám phá đặc sản và món ăn truyền thống từ khắp Việt Nam và thế giới với AI guide
                            </p>
                            <Link href="/regional-cuisine" className="btn-outline mt-4 inline-flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                Khám phá
                            </Link>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3 className="feature-title">Phân Tích Dinh Dưỡng</h3>
                            <p className="feature-description">
                                AI tính toán calo, vitamin và đưa ra gợi ý dinh dưỡng cân bằng cho từng bữa ăn
                            </p>
                            <Link href="/nutrition" className="btn-outline mt-4 inline-flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Phân tích
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="cta" className="py-20 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white animation-target">
                <div className="container-modern text-center">
                    <div className={`transition-all duration-1000 transform ${visibleElements.has('cta')
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-10 opacity-0'
                        }`}>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Sẵn Sàng Trở Thành Chef AI? 👨‍🍳
                        </h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Tham gia cùng hàng nghìn người dùng đã tin tượng Smart Cooking AI để nâng cao kỹ năng nấu ăn của họ
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/simple-ai-test" className="btn-glass text-lg px-8 py-4 inline-flex items-center gap-2">
                                <Play className="w-5 h-5" />
                                Test AI Ngay
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="/ai-chat" className="btn-primary bg-white text-orange-500 hover:bg-gray-100 text-lg px-8 py-4 inline-flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Chat với AI
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container-modern">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="footer-section">
                            <div className="flex items-center space-x-2 mb-4">
                                <ChefHat className="h-8 w-8 text-orange-500" />
                                <span className="text-2xl font-bold text-white">Smart Cooking AI</span>
                            </div>
                            <p className="text-gray-300 mb-4">
                                Nền tảng nấu ăn thông minh với AI, giúp bạn trở thành chef chuyên nghiệp.
                            </p>
                            <div className="flex space-x-4">
                                <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">📱</span>
                                <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">📧</span>
                                <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">🌐</span>
                            </div>
                        </div>

                        <div className="footer-section">
                            <h3 className="footer-title">Tính năng</h3>
                            <ul className="space-y-2">
                                <li><Link href="/ai-chat" className="footer-link">AI Chat</Link></li>
                                <li><Link href="/voice-assistant" className="footer-link">Trợ lý giọng nói</Link></li>
                                <li><Link href="/food-recognition" className="footer-link">Nhận dạng món ăn</Link></li>
                                <li><Link href="/learning" className="footer-link">Lộ trình học</Link></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h3 className="footer-title">Công thức</h3>
                            <ul className="space-y-2">
                                <li><Link href="/recipes/vietnamese" className="footer-link">Món Việt</Link></li>
                                <li><Link href="/recipes/asian" className="footer-link">Món Á</Link></li>
                                <li><Link href="/recipes/western" className="footer-link">Món Tây</Link></li>
                                <li><Link href="/recipes/dessert" className="footer-link">Tráng miệng</Link></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h3 className="footer-title">Hỗ trợ</h3>
                            <ul className="space-y-2">
                                <li><Link href="/help" className="footer-link">Trợ giúp</Link></li>
                                <li><Link href="/contact" className="footer-link">Liên hệ</Link></li>
                                <li><Link href="/privacy" className="footer-link">Chính sách</Link></li>
                                <li><Link href="/terms" className="footer-link">Điều khoản</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                        <p className="text-gray-400">
                            © 2024 Smart Cooking AI. Được phát triển với ❤️ tại Việt Nam.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;

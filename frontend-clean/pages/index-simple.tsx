import React, { useState, useEffect } from 'react';
import { ChefHat, Sparkles, Mic, Camera, ArrowRight, Star, Users, BookOpen } from 'lucide-react';
import HeaderSimple from '../src/components/layout/HeaderSimple';

// Simple animation hook
function useScrollAnimation() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return isVisible;
}

export default function HomePage() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isLoaded, setIsLoaded] = useState(false);

    // Initialize animation
    useScrollAnimation();

    useEffect(() => {
        setIsLoaded(true);

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const features = [
        {
            icon: <Sparkles className="h-8 w-8 text-blue-500" />,
            title: "AI Recipe Generation",
            description: "Tạo công thức từ nguyên liệu có sẵn",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: <Camera className="h-8 w-8 text-green-500" />,
            title: "Food Recognition",
            description: "Nhận dạng món ăn qua hình ảnh",
            color: "from-green-500 to-green-600"
        },
        {
            icon: <Mic className="h-8 w-8 text-purple-500" />,
            title: "Voice Assistant",
            description: "Trợ lý giọng nói thông minh",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: <BookOpen className="h-8 w-8 text-orange-500" />,
            title: "Learning Path",
            description: "Lộ trình học nấu ăn cá nhân hóa",
            color: "from-orange-500 to-orange-600"
        }
    ];

    const stats = [
        { number: "10K+", label: "Công thức", icon: <ChefHat className="h-6 w-6" /> },
        { number: "50K+", label: "Người dùng", icon: <Users className="h-6 w-6" /> },
        { number: "4.9", label: "Đánh giá", icon: <Star className="h-6 w-6" /> },
        { number: "24/7", label: "AI Support", icon: <Sparkles className="h-6 w-6" /> }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
            <HeaderSimple />

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 px-4">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className="absolute w-96 h-96 bg-gradient-to-r from-orange-200/30 to-blue-200/30 rounded-full blur-3xl"
                        style={{
                            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
                            transition: 'transform 0.1s ease-out'
                        }}
                    />
                    <div
                        className="absolute right-0 top-1/2 w-80 h-80 bg-gradient-to-l from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"
                        style={{
                            transform: `translate(-${mousePosition.x * 0.01}px, -${mousePosition.y * 0.01}px)`,
                            transition: 'transform 0.1s ease-out'
                        }}
                    />
                </div>

                <div className="relative max-w-6xl mx-auto text-center">
                    <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="flex justify-center mb-6 animate-pulse">
                            <ChefHat className="h-16 w-16 text-orange-500" />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-red-500 to-purple-600 bg-clip-text text-transparent">
                            Smart Cooking AI
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                            🌟 Hệ thống nấu ăn thông minh tích hợp AI, Voice Assistant và nhận dạng món ăn
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                                <span>Bắt đầu nấu ăn</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button className="group bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-gray-200 hover:border-orange-300">
                                <span>Xem demo</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 animate-on-scroll">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            🚀 Tính năng nổi bật
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Khám phá các tính năng AI tiên tiến giúp bạn nấu ăn thông minh hơn
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 animate-on-scroll"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} p-4 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="text-center group animate-on-scroll"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex justify-center mb-2 text-orange-500 group-hover:scale-110 transition-transform duration-300">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-red-500">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">
                        🎯 Sẵn sàng trở thành Chef AI?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Tham gia cộng đồng Smart Cooking AI và khám phá thế giới nấu ăn thông minh
                    </p>
                    <button className="bg-white text-orange-500 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        Đăng ký ngay miễn phí
                    </button>
                </div>
            </section>
        </div>
    );
}

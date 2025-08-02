// Smart Cooking AI - Homepage với Animation Effects
import React, { useState, useEffect } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { Button, FoodButton, GradientButton } from '@/components/ui/Button';
import NumberDisplay from '@/components/common/NumberDisplay';

// Animation Hook
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
            { threshold: 0.1 }
        );

        // Observe all elements with animation-target class
        const targets = document.querySelectorAll('.animation-target');
        targets.forEach(target => observer.observe(target));

        return () => observer.disconnect();
    }, []);

    return visibleElements;
};t Cooking AI - Homepage
import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { Button, FoodButton, GradientButton } from '@/components/ui/Button';
import NumberDisplay from '@/components/common/NumberDisplay';

interface Recipe {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    cookingTime: number;
    difficulty: "MEDIUM" | "EASY" | "HARD";
    rating: number;
}

interface HomePageProps {
    featuredRecipes: Recipe[];
    stats: {
        totalRecipes: number;
        totalUsers: number;
        totalLessons: number;
        avgRating: number;
    };
}

const HomePage: NextPage<HomePageProps> = ({ featuredRecipes, stats }) => {
    const visibleElements = useScrollAnimation();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Parallax mouse effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            <Header />

            {/* Hero Section với Advanced Animations */}
            <section
                id="hero"
                className="animation-target relative bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white overflow-hidden"
            >
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div
                        className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"
                        style={{
                            top: '20%',
                            left: '10%',
                            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
                            animation: 'float 6s ease-in-out infinite'
                        }}
                    />
                    <div
                        className="absolute w-64 h-64 bg-yellow-300/20 rounded-full blur-2xl animate-pulse"
                        style={{
                            top: '60%',
                            right: '15%',
                            transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px)`,
                            animationDelay: '2s'
                        }}
                    />
                    <div
                        className="absolute w-80 h-80 bg-blue-400/15 rounded-full blur-3xl"
                        style={{
                            top: '40%',
                            left: '70%',
                            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
                            animation: 'float 8s ease-in-out infinite reverse'
                        }}
                    />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className={`text-center transition-all duration-1000 transform ${visibleElements.has('hero')
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                        }`}>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-text-shimmer bg-gradient-to-r from-white via-yellow-200 to-white bg-[length:200%_100%] bg-clip-text text-transparent">
                            Nấu Ăn Thông Minh với AI 🤖
                        </h1>
                        <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 transform ${visibleElements.has('hero')
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-10 opacity-0'
                            }`}>
                            Khám phá thế giới ẩm thực với trợ lý AI thông minh.
                            Tạo công thức, học nấu ăn và trở thành chef chuyên nghiệp.
                        </p>
                        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 transform ${visibleElements.has('hero')
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-10 opacity-0'
                            }`}>
                            <button className="group relative px-8 py-4 bg-white text-orange-500 font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                <span className="relative z-10 flex items-center justify-center">
                                    ✨ Thử Trợ Lý AI
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute inset-0 bg-white group-hover:bg-transparent transition-colors duration-300" />
                                <span className="absolute inset-0 group-hover:text-white transition-colors duration-300 flex items-center justify-center font-bold">
                                    ✨ Thử Trợ Lý AI
                                </span>
                            </button>
                            <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-orange-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm">
                                📚 Xem Công Thức
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section với Counter Animation */}
            <section
                id="stats"
                className="animation-target py-16 bg-white relative overflow-hidden"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, orange 2px, transparent 2px),
                                        radial-gradient(circle at 75% 75%, pink 2px, transparent 2px)`,
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 text-center transition-all duration-1000 transform ${visibleElements.has('stats')
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                        }`}>
                        <div className="group p-6 rounded-2xl hover:bg-gradient-to-br hover:from-orange-50 hover:to-pink-50 transition-all duration-500 hover:scale-105 hover:shadow-lg">
                            <div className="relative">
                                <NumberDisplay
                                    value={stats.totalRecipes}
                                    className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-20 blur-lg transition-all duration-500" />
                            </div>
                            <div className="text-gray-600 mt-2 font-medium group-hover:text-gray-800 transition-colors duration-300">
                                Công Thức
                            </div>
                        </div>

                        <div className="group p-6 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-500 hover:scale-105 hover:shadow-lg">
                            <div className="relative">
                                <NumberDisplay
                                    value={stats.totalUsers}
                                    className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 blur-lg transition-all duration-500" />
                            </div>
                            <div className="text-gray-600 mt-2 font-medium group-hover:text-gray-800 transition-colors duration-300">
                                Người Dùng
                            </div>
                        </div>

                        <div className="group p-6 rounded-2xl hover:bg-gradient-to-br hover:from-green-50 hover:to-teal-50 transition-all duration-500 hover:scale-105 hover:shadow-lg">
                            <div className="relative">
                                <NumberDisplay
                                    value={stats.totalLessons}
                                    className="text-3xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-full opacity-0 group-hover:opacity-20 blur-lg transition-all duration-500" />
                            </div>
                            <div className="text-gray-600 mt-2 font-medium group-hover:text-gray-800 transition-colors duration-300">
                                Bài Học
                            </div>
                        </div>

                        <div className="group p-6 rounded-2xl hover:bg-gradient-to-br hover:from-yellow-50 hover:to-orange-50 transition-all duration-500 hover:scale-105 hover:shadow-lg">
                            <div className="relative">
                                <NumberDisplay
                                    value={parseFloat(stats.avgRating.toFixed(1))}
                                    suffix=" ⭐"
                                    className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-20 blur-lg transition-all duration-500" />
                            </div>
                            <div className="text-gray-600 mt-2 font-medium group-hover:text-gray-800 transition-colors duration-300">
                                Đánh Giá
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Recipes với Stagger Animation */}
            <section
                id="recipes"
                className="animation-target py-16 bg-gradient-to-br from-gray-50 to-white relative"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`text-center mb-12 transition-all duration-1000 transform ${visibleElements.has('recipes')
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                        }`}>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                            🍲 Công Thức Nổi Bật
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Khám phá những công thức được yêu thích nhất từ cộng đồng Smart Cooking AI
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredRecipes.map((recipe, index) => (
                            <div
                                key={recipe.id}
                                className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${visibleElements.has('recipes')
                                        ? 'translate-y-0 opacity-100'
                                        : 'translate-y-10 opacity-0'
                                    }`}
                                style={{
                                    transitionDelay: visibleElements.has('recipes') ? `${index * 200}ms` : '0ms'
                                }}
                            >
                                {/* Image Container với Hover Effect */}
                                <div className="relative aspect-video bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20 group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-6xl group-hover:scale-125 transition-transform duration-500 group-hover:rotate-12">
                                            🍜
                                        </span>
                                    </div>
                                    {/* Floating Particles */}
                                    <div className="absolute top-4 left-4 w-2 h-2 bg-white/50 rounded-full animate-ping" />
                                    <div className="absolute top-8 right-6 w-1 h-1 bg-yellow-300/70 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                                    <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-pink-300/60 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                                </div>

                                <div className="p-6 relative">
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-600 transition-colors duration-300">
                                        {recipe.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
                                        {recipe.description}
                                    </p>

                                    <div className="flex justify-between items-center text-sm mb-4">
                                        <span className={`px-3 py-1 rounded-full font-medium transition-all duration-300 group-hover:scale-105 ${recipe.difficulty === 'EASY'
                                                ? 'bg-green-100 text-green-600 group-hover:bg-green-200' :
                                                recipe.difficulty === 'MEDIUM'
                                                    ? 'bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200' :
                                                    'bg-red-100 text-red-600 group-hover:bg-red-200'
                                            }`}>
                                            {recipe.difficulty}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-500 flex items-center group-hover:text-gray-700 transition-colors duration-300">
                                                <span className="group-hover:animate-spin">⏱️</span>
                                                <span className="ml-1">{recipe.cookingTime} phút</span>
                                            </span>
                                            <div className="flex items-center group-hover:scale-110 transition-transform duration-300">
                                                <span className="text-yellow-500 group-hover:animate-pulse">⭐</span>
                                                <span className="ml-1 font-medium">{recipe.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium py-3 px-4 rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 hover:shadow-lg hover:scale-105 group-hover:shadow-orange-200">
                                        <span className="flex items-center justify-center">
                                            <span className="group-hover:mr-2 transition-all duration-300">🍳</span>
                                            <span>Xem Công Thức</span>
                                            <span className="ml-0 group-hover:ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300">→</span>
                                        </span>
                                    </button>

                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400/0 to-pink-400/0 group-hover:from-orange-400/10 group-hover:to-pink-400/10 transition-all duration-500 pointer-events-none" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section với Interactive Cards */}
            <section
                id="features"
                className="animation-target py-16 bg-white relative overflow-hidden"
            >
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
                    <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-yellow-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-green-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`text-center mb-12 transition-all duration-1000 transform ${visibleElements.has('features')
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                        }`}>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            🚀 Tính Năng Nổi Bật
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "🤖",
                                title: "AI Thông Minh",
                                description: "Trợ lý AI tạo công thức từ nguyên liệu có sẵn",
                                gradient: "from-blue-500 to-purple-600",
                                delay: 0
                            },
                            {
                                icon: "🎤",
                                title: "Voice Assistant",
                                description: "Hướng dẫn nấu ăn bằng giọng nói thông minh",
                                gradient: "from-green-500 to-teal-600",
                                delay: 200
                            },
                            {
                                icon: "📸",
                                title: "Nhận Dạng Món Ăn",
                                description: "Chụp ảnh để nhận dạng và học công thức",
                                gradient: "from-pink-500 to-red-600",
                                delay: 400
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className={`group relative text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 hover:scale-105 hover:-translate-y-4 ${visibleElements.has('features')
                                        ? 'translate-y-0 opacity-100'
                                        : 'translate-y-10 opacity-0'
                                    }`}
                                style={{
                                    transitionDelay: visibleElements.has('features') ? `${feature.delay}ms` : '0ms'
                                }}
                            >
                                {/* Background Glow */}
                                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                {/* Icon Container */}
                                <div className="relative mb-6">
                                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                                        {feature.icon}
                                    </div>
                                    {/* Animated Ring */}
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-30 animate-ping group-hover:animate-pulse transition-opacity duration-300`} />
                                </div>

                                <h3 className={`text-xl font-semibold mb-4 group-hover:bg-gradient-to-r group-hover:${feature.gradient} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}>
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Hover Button */}
                                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                    <button className={`px-6 py-2 bg-gradient-to-r ${feature.gradient} text-white rounded-full font-medium hover:shadow-lg transition-all duration-300`}>
                                        Khám Phá →
                                    </button>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" />
                                <div className="absolute bottom-4 left-4 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-70 group-hover:animate-bounce transition-opacity duration-300" style={{ animationDelay: '0.5s' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section với Magnetic Effect */}
            <section
                id="cta"
                className="animation-target py-16 relative overflow-hidden"
            >
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-gradient-x" />

                {/* Floating Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float-slow" />
                    <div className="absolute top-20 right-20 w-16 h-16 bg-yellow-300/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
                    <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-300/15 rounded-full animate-float-slow" style={{ animationDelay: '4s' }} />
                    <div className="absolute bottom-10 right-10 w-12 h-12 bg-blue-300/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
                </div>

                <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white transition-all duration-1000 transform ${visibleElements.has('cta')
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-10 opacity-0'
                    }`}>
                    <h2 className="text-3xl font-bold mb-4 animate-text-shimmer bg-gradient-to-r from-white via-yellow-200 to-white bg-[length:200%_100%] bg-clip-text text-transparent">
                        🎯 Sẵn sàng bắt đầu hành trình nấu ăn?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Tham gia cộng đồng Smart Cooking AI ngay hôm nay và khám phá thế giới ẩm thực không giới hạn.
                    </p>

                    {/* Magnetic Button */}
                    <div className="inline-block">
                        <button
                            className="group relative px-12 py-4 bg-white text-gray-800 font-bold text-lg rounded-full overflow-hidden hover:scale-110 transition-all duration-500 hover:shadow-2xl hover:shadow-white/25"
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left - rect.width / 2;
                                const y = e.clientY - rect.top - rect.height / 2;
                                e.currentTarget.style.transform = `scale(1.1) translate(${x * 0.1}px, ${y * 0.1}px)`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1) translate(0px, 0px)';
                            }}
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                🚀 Bắt Đầu Ngay - Miễn Phí
                            </span>
                            {/* Animated Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                            {/* Ripple Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </button>
                    </div>

                    {/* Floating Action Buttons */}
                    <div className="mt-8 flex justify-center space-x-4">
                        <div className="animate-bounce" style={{ animationDelay: '0.5s' }}>
                            <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-300 hover:scale-110">
                                📱
                            </button>
                        </div>
                        <div className="animate-bounce" style={{ animationDelay: '1s' }}>
                            <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-300 hover:scale-110">
                                💬
                            </button>
                        </div>
                        <div className="animate-bounce" style={{ animationDelay: '1.5s' }}>
                            <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-300 hover:scale-110">
                                🎯
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">🍳 Smart Cooking AI</h3>
                        <p className="text-gray-400 mb-8">
                            Nền tảng nấu ăn thông minh được hỗ trợ bởi AI - Biến mọi người thành chef chuyên nghiệp
                        </p>
                        <div className="flex justify-center space-x-6">
                            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                                Về Chúng Tôi
                            </Link>
                            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                                Liên Hệ
                            </Link>
                            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                                Chính Sách
                            </Link>
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500">
                            © 2025 Smart Cooking AI. Tất cả quyền được bảo lưu.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    // Mock data - trong thực tế sẽ fetch từ API/Database
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

    return {
        props: {
            featuredRecipes,
            stats,
        },
    };
};

export default HomePage;

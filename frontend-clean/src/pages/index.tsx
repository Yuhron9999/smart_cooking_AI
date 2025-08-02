// Smart Cooking AI - Homepage
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
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-orange-400 to-pink-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">
                            Nấu Ăn Thông Minh với AI 🤖
                        </h2>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Khám phá thế giới ẩm thực với trợ lý AI thông minh.
                            Tạo công thức, học nấu ăn và trở thành chef chuyên nghiệp.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <GradientButton size="lg">
                                ✨ Thử Trợ Lý AI
                            </GradientButton>
                            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-orange-500">
                                📚 Xem Công Thức
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="p-6">
                            <NumberDisplay
                                value={stats.totalRecipes}
                                className="text-3xl font-bold text-orange-500"
                            />
                            <div className="text-gray-600 mt-2">Công Thức</div>
                        </div>
                        <div className="p-6">
                            <NumberDisplay
                                value={stats.totalUsers}
                                className="text-3xl font-bold text-orange-500"
                            />
                            <div className="text-gray-600 mt-2">Người Dùng</div>
                        </div>
                        <div className="p-6">
                            <NumberDisplay
                                value={stats.totalLessons}
                                className="text-3xl font-bold text-orange-500"
                            />
                            <div className="text-gray-600 mt-2">Bài Học</div>
                        </div>
                        <div className="p-6">
                            <NumberDisplay
                                value={parseFloat(stats.avgRating.toFixed(1))}
                                suffix=" ⭐"
                                className="text-3xl font-bold text-orange-500"
                            />
                            <div className="text-gray-600 mt-2">Đánh Giá</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Recipes */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            🍲 Công Thức Nổi Bật
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Khám phá những công thức được yêu thích nhất từ cộng đồng Smart Cooking AI
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredRecipes.map((recipe) => (
                            <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                                <div className="aspect-video bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                                    <span className="text-gray-500 text-4xl">🍜</span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className={`px-3 py-1 rounded-full font-medium ${recipe.difficulty === 'EASY' ? 'bg-green-100 text-green-600' :
                                            recipe.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-red-100 text-red-600'
                                            }`}>
                                            {recipe.difficulty}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-500">⏱️ {recipe.cookingTime} phút</span>
                                            <div className="flex items-center">
                                                <span className="text-yellow-500">⭐</span>
                                                <span className="ml-1 font-medium">{recipe.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <FoodButton size="sm" className="w-full">
                                            🍳 Xem Công Thức
                                        </FoodButton>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            🚀 Tính Năng Nổi Bật
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="text-4xl mb-4">🤖</div>
                            <h3 className="text-xl font-semibold mb-2">AI Thông Minh</h3>
                            <p className="text-gray-600">Trợ lý AI tạo công thức từ nguyên liệu có sẵn</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="text-4xl mb-4">🎤</div>
                            <h3 className="text-xl font-semibold mb-2">Voice Assistant</h3>
                            <p className="text-gray-600">Hướng dẫn nấu ăn bằng giọng nói thông minh</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="text-4xl mb-4">📸</div>
                            <h3 className="text-xl font-semibold mb-2">Nhận Dạng Món Ăn</h3>
                            <p className="text-gray-600">Chụp ảnh để nhận dạng và học công thức</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-green-400 to-blue-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        🎯 Sẵn sàng bắt đầu hành trình nấu ăn?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Tham gia cộng đồng Smart Cooking AI ngay hôm nay và khám phá thế giới ẩm thực không giới hạn.
                    </p>
                    <GradientButton size="xl">
                        🚀 Bắt Đầu Ngay - Miễn Phí
                    </GradientButton>
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

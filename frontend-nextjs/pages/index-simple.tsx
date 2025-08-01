import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import {
    ChefHat,
    Sparkles,
    BookOpen,
    Star,
    Play,
    ArrowRight,
    Clock,
    Users
} from 'lucide-react';

// Simple interfaces
interface Recipe {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    cookingTime: number;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    rating: number;
    servings: number;
    calories: number;
}

interface Stats {
    totalRecipes: number;
    totalUsers: number;
    totalLessons: number;
    avgRating: number;
}

interface HomePageProps {
    featuredRecipes: Recipe[];
    stats: Stats;
}

const HomePage: React.FC<HomePageProps> = ({ featuredRecipes, stats }) => {
    const features = [
        {
            icon: '🤖',
            title: 'AI Thông Minh',
            description: 'Trợ lý AI giúp tạo công thức, phân tích nguyên liệu và gợi ý món ăn phù hợp'
        },
        {
            icon: '📚',
            title: 'Học Nấu Ăn',
            description: 'Khóa học từ cơ bản đến nâng cao với video HD và hướng dẫn chi tiết'
        },
        {
            icon: '🎤',
            title: 'Điều Khiển Giọng Nói',
            description: 'Nấu ăn rảnh tay với trợ lý giọng nói thông minh, hỗ trợ tiếng Việt'
        },
        {
            icon: '🌍',
            title: 'Ẩm Thực Vùng Miền',
            description: 'Khám phá đặc sản 3 miền Bắc - Trung - Nam và các món quốc tế'
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center p-2 bg-white rounded-full shadow-lg mb-6">
                                <ChefHat className="h-12 w-12 text-orange-500" />
                            </div>

                            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                                    Smart Cooking
                                </span>
                                <br />
                                <span className="text-gray-900">với AI</span>
                            </h1>

                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                Trải nghiệm nấu ăn thông minh với sự hỗ trợ của AI.
                                Khám phá hàng ngàn công thức, học từ chuyên gia và tạo ra những món ăn tuyệt vời.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-shadow">
                                <Sparkles className="inline h-5 w-5 mr-2" />
                                Bắt Đầu Với AI
                            </button>

                            <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors">
                                <Play className="inline h-5 w-5 mr-2" />
                                Xem Demo
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            <div className="bg-white/70 backdrop-blur-md rounded-lg p-6">
                                <div className="text-3xl font-bold text-orange-600 mb-2">
                                    {stats.totalRecipes.toLocaleString()}+
                                </div>
                                <div className="text-gray-600">Công thức</div>
                            </div>

                            <div className="bg-white/70 backdrop-blur-md rounded-lg p-6">
                                <div className="text-3xl font-bold text-pink-600 mb-2">
                                    {stats.totalUsers.toLocaleString()}+
                                </div>
                                <div className="text-gray-600">Người dùng</div>
                            </div>

                            <div className="bg-white/70 backdrop-blur-md rounded-lg p-6">
                                <div className="text-3xl font-bold text-purple-600 mb-2">
                                    {stats.totalLessons}+
                                </div>
                                <div className="text-gray-600">Bài học</div>
                            </div>

                            <div className="bg-white/70 backdrop-blur-md rounded-lg p-6">
                                <div className="flex items-center justify-center mb-2">
                                    <span className="text-3xl font-bold text-yellow-600">{stats.avgRating}</span>
                                    <Star className="h-6 w-6 text-yellow-500 ml-1 fill-current" />
                                </div>
                                <div className="text-gray-600">Đánh giá</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Tính năng nổi bật
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Smart Cooking AI mang đến những công nghệ tiên tiến nhất để hỗ trợ bạn trong việc nấu ăn
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Recipes Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Công thức nổi bật
                            </h2>
                            <p className="text-xl text-gray-600">
                                Những món ăn được yêu thích nhất tuần này
                            </p>
                        </div>

                        <Link href="/recipes" className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            Xem tất cả
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredRecipes.map((recipe) => (
                            <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-48 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500">Hình ảnh món ăn</span>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {recipe.title}
                                    </h3>

                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                        {recipe.description}
                                    </p>

                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1" />
                                            {recipe.cookingTime} phút
                                        </div>

                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 mr-1" />
                                            {recipe.servings} người
                                        </div>

                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                                            {recipe.rating}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${recipe.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                                                recipe.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {recipe.difficulty === 'EASY' ? 'Dễ' :
                                                recipe.difficulty === 'MEDIUM' ? 'Trung bình' : 'Khó'}
                                        </span>

                                        <span className="text-sm text-gray-500">
                                            {recipe.calories} cal
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        Sẵn sàng bắt đầu hành trình nấu ăn?
                    </h2>

                    <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                        Tham gia cộng đồng hàng ngàn người yêu nấu ăn và khám phá thế giới ẩm thực cùng AI
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
                            <ChefHat className="inline h-5 w-5 mr-2" />
                            Đăng ký miễn phí
                        </button>

                        <button className="border border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors">
                            <BookOpen className="inline h-5 w-5 mr-2" />
                            Tìm hiểu thêm
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const featuredRecipes: Recipe[] = [
        {
            id: 1,
            title: 'Phở Bò Hà Nội',
            description: 'Món phở truyền thống với nước dùng đậm đà, thịt bò tươi ngon',
            imageUrl: '/images/pho-bo.jpg',
            cookingTime: 120,
            difficulty: 'MEDIUM',
            rating: 4.8,
            servings: 4,
            calories: 350
        },
        {
            id: 2,
            title: 'Bánh Mì Việt Nam',
            description: 'Bánh mì giòn rụm với nhân đa dạng, đặc trưng ẩm thực đường phố',
            imageUrl: '/images/banh-mi.jpg',
            cookingTime: 30,
            difficulty: 'EASY',
            rating: 4.6,
            servings: 2,
            calories: 280
        },
        {
            id: 3,
            title: 'Cơm Tấm Sài Gòn',
            description: 'Cơm tấm sườn nướng với đầy đủ rau sống và nước mắm pha',
            imageUrl: '/images/com-tam.jpg',
            cookingTime: 45,
            difficulty: 'MEDIUM',
            rating: 4.7,
            servings: 2,
            calories: 420
        }
    ];

    const stats: Stats = {
        totalRecipes: 15420,
        totalUsers: 8650,
        totalLessons: 156,
        avgRating: 4.8
    };

    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'vi', ['common'])),
            featuredRecipes,
            stats
        },
        revalidate: 3600,
    };
};

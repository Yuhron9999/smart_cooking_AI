// Pages - Home Page với thiết kế đẹp mắt
import React from 'react';
import { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, RecipeCard } from '@/components/ui/Card';
import {
    ChefHat,
    Sparkles,
    BookOpen,
    Mic,
    Users,
    Star,
    TrendingUp,
    Award,
    Clock,
    Play,
    ArrowRight,
    Heart,
    Globe
} from 'lucide-react';

interface HomePageProps {
    featuredRecipes: any[];
    stats: {
        totalRecipes: number;
        totalUsers: number;
        totalLessons: number;
        avgRating: number;
    };
}

const HomePage: NextPage<HomePageProps> = ({ featuredRecipes, stats }) => {
    const { t } = useTranslation('common');

    const features = [
        {
            icon: Sparkles,
            title: 'AI Thông Minh',
            description: 'Trợ lý AI giúp tạo công thức, phân tích nguyên liệu và gợi ý món ăn phù hợp',
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-50'
        },
        {
            icon: BookOpen,
            title: 'Học Nấu Ăn',
            description: 'Khóa học từ cơ bản đến nâng cao với video HD và hướng dẫn chi tiết',
            color: 'from-green-500 to-blue-500',
            bgColor: 'bg-green-50'
        },
        {
            icon: Mic,
            title: 'Điều Khiển Giọng Nói',
            description: 'Nấu ăn rảnh tay với trợ lý giọng nói thông minh, hỗ trợ tiếng Việt',
            color: 'from-red-500 to-orange-500',
            bgColor: 'bg-red-50'
        },
        {
            icon: Globe,
            title: 'Ẩm Thực Vùng Miền',
            description: 'Khám phá đặc sản 3 miền Bắc - Trung - Nam và các món quốc tế',
            color: 'from-yellow-500 to-red-500',
            bgColor: 'bg-yellow-50'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-20 lg:py-32">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants} className="mb-8">
                            <div className="inline-flex items-center justify-center p-2 bg-white rounded-full shadow-lg mb-6">
                                <div className="relative">
                                    <ChefHat className="h-12 w-12 text-orange-500" />
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full animate-pulse flex items-center justify-center">
                                        <Sparkles className="h-3 w-3 text-white" />
                                    </div>
                                </div>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                                    Smart Cooking
                                </span>
                                <br />
                                <span className="text-gray-900">với AI</span>
                            </h1>

                            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
                                Trải nghiệm nấu ăn thông minh với sự hỗ trợ của AI.
                                Khám phá hàng ngàn công thức, học từ chuyên gia và tạo ra những món ăn tuyệt vời.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Button
                                size="xl"
                                variant="gradient"
                                className="transform hover:scale-105 transition-transform"
                                leftIcon={<Sparkles className="h-5 w-5" />}
                            >
                                Bắt Đầu Với AI
                            </Button>

                            <Button
                                size="xl"
                                variant="outline"
                                className="transform hover:scale-105 transition-transform"
                                leftIcon={<Play className="h-5 w-5" />}
                            >
                                Xem Demo
                            </Button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            variants={itemVariants}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
                        >
                            <div className="bg-white/70 backdrop-blur-md rounded-lg p-6 border border-white/20">
                                <div className="text-3xl font-bold text-orange-600 mb-2">
                                    {stats.totalRecipes.toLocaleString()}+
                                </div>
                                <div className="text-gray-600">Công thức</div>
                            </div>

                            <div className="bg-white/70 backdrop-blur-md rounded-lg p-6 border border-white/20">
                                <div className="text-3xl font-bold text-pink-600 mb-2">
                                    {stats.totalUsers.toLocaleString()}+
                                </div>
                                <div className="text-gray-600">Người dùng</div>
                            </div>

                            <div className="bg-white/70 backdrop-blur-md rounded-lg p-6 border border-white/20">
                                <div className="text-3xl font-bold text-purple-600 mb-2">
                                    {stats.totalLessons}+
                                </div>
                                <div className="text-gray-600">Bài học</div>
                            </div>

                            <div className="bg-white/70 backdrop-blur-md rounded-lg p-6 border border-white/20">
                                <div className="flex items-center justify-center mb-2">
                                    <span className="text-3xl font-bold text-yellow-600">{stats.avgRating}</span>
                                    <Star className="h-6 w-6 text-yellow-500 ml-1" fill="currentColor" />
                                </div>
                                <div className="text-gray-600">Đánh giá</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="text-center mb-16"
                    >
                        <motion.h2
                            variants={itemVariants}
                            className="text-4xl font-bold text-gray-900 mb-4"
                        >
                            Tính năng nổi bật
                        </motion.h2>
                        <motion.p
                            variants={itemVariants}
                            className="text-xl text-gray-600 max-w-3xl mx-auto"
                        >
                            Smart Cooking AI mang đến những công nghệ tiên tiến nhất để hỗ trợ bạn trong việc nấu ăn
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div key={index} variants={itemVariants}>
                                    <Card
                                        variant="default"
                                        className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer transform hover:-translate-y-2"
                                    >
                                        <CardContent className="p-6 text-center">
                                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform`}>
                                                <Icon className={`h-8 w-8 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                                {feature.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Featured Recipes Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants} className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                    Công thức nổi bật
                                </h2>
                                <p className="text-xl text-gray-600">
                                    Những món ăn được yêu thích nhất tuần này
                                </p>
                            </div>

                            <Link href="/recipes">
                                <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                                    Xem tất cả
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {featuredRecipes.map((recipe, index) => (
                                <motion.div key={recipe.id} variants={itemVariants}>
                                    <RecipeCard
                                        recipe={recipe}
                                        onView={(id) => console.log('View recipe:', id)}
                                        onFavorite={(id) => console.log('Favorite recipe:', id)}
                                        className="transform hover:scale-105 transition-transform"
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        <motion.h2
                            variants={itemVariants}
                            className="text-4xl lg:text-5xl font-bold text-white mb-6"
                        >
                            Sẵn sàng bắt đầu hành trình nấu ăn?
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="text-xl text-white/90 max-w-2xl mx-auto mb-8"
                        >
                            Tham gia cộng đồng hàng ngàn người yêu nấu ăn và khám phá thế giới ẩm thực cùng AI
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="xl"
                                variant="secondary"
                                className="bg-white text-gray-900 hover:bg-gray-100 transform hover:scale-105 transition-transform"
                                leftIcon={<ChefHat className="h-5 w-5" />}
                            >
                                Đăng ký miễn phí
                            </Button>

                            <Button
                                size="xl"
                                variant="ghost"
                                className="text-white border-white hover:bg-white/10 transform hover:scale-105 transition-transform"
                                leftIcon={<BookOpen className="h-5 w-5" />}
                            >
                                Tìm hiểu thêm
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    // Mock data - trong thực tế sẽ fetch từ API
    const featuredRecipes = [
        {
            id: 1,
            title: 'Phở Bò Hà Nội',
            description: 'Món phở truyền thống với nước dùng đậm đà, thịt bò tươi ngon',
            imageUrl: '/images/pho-bo.jpg',
            cookingTime: 120,
            difficulty: 'MEDIUM' as const,
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
            difficulty: 'EASY' as const,
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
            difficulty: 'MEDIUM' as const,
            rating: 4.7,
            servings: 2,
            calories: 420
        }
    ];

    const stats = {
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
    };
};

export default HomePage;

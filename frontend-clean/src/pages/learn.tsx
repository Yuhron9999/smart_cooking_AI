// Pages - Learning Path Page
import React, { useState } from 'react';
import { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { BookOpen, Clock, Users, Star, Trophy, Play, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';

interface LearningPath {
    id: number;
    title: string;
    description: string;
    image: string;
    duration: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    rating: number;
    students: number;
    lessons: number;
    progress?: number;
    isEnrolled?: boolean;
    category: string;
}

interface LearnPageProps {
    learningPaths: LearningPath[];
    categories: string[];
}

const LearnPage: NextPage<LearnPageProps> = ({ learningPaths, categories }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');

    // Filter learning paths
    const filteredPaths = learningPaths.filter(path => {
        const matchesCategory = selectedCategory === 'all' || path.category === selectedCategory;
        const matchesLevel = selectedLevel === 'all' || path.level === selectedLevel;

        return matchesCategory && matchesLevel;
    });

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'beginner': return 'text-green-600 bg-green-100';
            case 'intermediate': return 'text-yellow-600 bg-yellow-100';
            case 'advanced': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getLevelText = (level: string) => {
        switch (level) {
            case 'beginner': return 'Cơ bản';
            case 'intermediate': return 'Trung cấp';
            case 'advanced': return 'Nâng cao';
            default: return level;
        }
    };

    const getCategoryText = (category: string) => {
        switch (category) {
            case 'vietnamese': return 'Món Việt';
            case 'italian': return 'Món Ý';
            case 'baking': return 'Làm bánh';
            case 'techniques': return 'Kỹ thuật';
            case 'healthy': return 'Ăn lành';
            default: return category;
        }
    };

    return (
        <>
            <Head>
                <title>Học nấu ăn - Smart Cooking AI</title>
                <meta name="description" content="Học nấu ăn từ cơ bản đến nâng cao với lộ trình cá nhân hóa từ Smart Cooking AI" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Header />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            📚 Học nấu ăn
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Nâng cao kỹ năng nấu ăn với các lộ trình học được thiết kế bởi AI và các đầu bếp chuyên nghiệp
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Category Filter */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                aria-label="Chọn danh mục khóa học"
                            >
                                <option value="all">Tất cả danh mục</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {getCategoryText(category)}
                                    </option>
                                ))}
                            </select>

                            {/* Level Filter */}
                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                aria-label="Chọn trình độ"
                            >
                                <option value="all">Tất cả trình độ</option>
                                <option value="beginner">Cơ bản</option>
                                <option value="intermediate">Trung cấp</option>
                                <option value="advanced">Nâng cao</option>
                            </select>
                        </div>
                    </div>

                    {/* Learning Paths Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPaths.map((path) => (
                            <div
                                key={path.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="relative">
                                    <div className="aspect-w-16 aspect-h-10">
                                        <img
                                            src={path.image}
                                            alt={path.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(path.level)}`}>
                                            {getLevelText(path.level)}
                                        </span>
                                    </div>
                                    {path.isEnrolled && (
                                        <div className="absolute top-2 left-2">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                                                Đã đăng ký
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                                        {path.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {path.description}
                                    </p>

                                    {/* Progress Bar (if enrolled) */}
                                    {path.isEnrolled && path.progress !== undefined && (
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>Tiến độ</span>
                                                <span>{path.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${path.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <div className="flex items-center space-x-4">
                                            <span className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {path.duration}
                                            </span>
                                            <span className="flex items-center">
                                                <BookOpen className="h-4 w-4 mr-1" />
                                                {path.lessons} bài
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                            <span>{path.rating.toFixed(1)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <span className="flex items-center">
                                            <Users className="h-4 w-4 mr-1" />
                                            {path.students.toLocaleString()} học viên
                                        </span>
                                    </div>

                                    <div className="flex space-x-2">
                                        {path.isEnrolled ? (
                                            <Link
                                                href={`/learn/${path.id}/continue`}
                                                className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-center flex items-center justify-center"
                                            >
                                                <Play className="h-4 w-4 mr-2" />
                                                Tiếp tục học
                                            </Link>
                                        ) : (
                                            <Link
                                                href={`/learn/${path.id}`}
                                                className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-center"
                                            >
                                                Tham gia khóa học
                                            </Link>
                                        )}
                                        <Link
                                            href={`/learn/${path.id}/preview`}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Xem trước
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredPaths.length === 0 && (
                        <div className="text-center py-12">
                            <BookOpen className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                Không tìm thấy khóa học phù hợp
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Thử điều chỉnh bộ lọc để tìm khóa học phù hợp với bạn
                            </p>
                            <button
                                onClick={() => {
                                    setSelectedCategory('all');
                                    setSelectedLevel('all');
                                }}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    )}

                    {/* Call to Action */}
                    <div className="mt-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg p-8 text-center text-white">
                        <Trophy className="h-16 w-16 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Bắt đầu hành trình nấu ăn của bạn</h2>
                        <p className="text-orange-100 mb-6">
                            Tham gia cộng đồng hơn 10,000 người yêu thích nấu ăn và nâng cao kỹ năng của bạn ngay hôm nay
                        </p>
                        <Link
                            href="/learn/recommended"
                            className="inline-flex items-center px-6 py-3 bg-white text-orange-500 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Nhận gợi ý khóa học
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    // Mock learning paths data
    const learningPaths: LearningPath[] = [
        {
            id: 1,
            title: "Nấu ăn Việt Nam cơ bản",
            description: "Học cách nấu những món ăn Việt Nam truyền thống từ cơ bản đến thành thạo",
            image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",
            duration: "4 tuần",
            level: 'beginner',
            rating: 4.8,
            students: 2500,
            lessons: 12,
            progress: 65,
            isEnrolled: true,
            category: 'vietnamese'
        },
        {
            id: 2,
            title: "Làm bánh cơ bản",
            description: "Khám phá thế giới làm bánh từ bánh mì đến bánh ngọt với kỹ thuật chuyên nghiệp",
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
            duration: "6 tuần",
            level: 'beginner',
            rating: 4.9,
            students: 1800,
            lessons: 18,
            category: 'baking'
        },
        {
            id: 3,
            title: "Kỹ thuật dao và chuẩn bị nguyên liệu",
            description: "Nắm vững các kỹ thuật cắt, thái, và chuẩn bị nguyên liệu như một đầu bếp chuyên nghiệp",
            image: "https://images.unsplash.com/photo-1556909114-4e1728e25fa9?w=400",
            duration: "3 tuần",
            level: 'intermediate',
            rating: 4.7,
            students: 3200,
            lessons: 9,
            category: 'techniques'
        },
        {
            id: 4,
            title: "Pasta và món Ý",
            description: "Tạo ra những món pasta tuyệt vời và khám phá ẩm thực Ý từ cơ bản đến nâng cao",
            image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
            duration: "5 tuần",
            level: 'intermediate',
            rating: 4.6,
            students: 1950,
            lessons: 15,
            category: 'italian'
        },
        {
            id: 5,
            title: "Ăn lành mạnh và dinh dưỡng",
            description: "Học cách nấu những món ăn lành mạnh, giàu dinh dưỡng cho cả gia đình",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
            duration: "4 tuần",
            level: 'beginner',
            rating: 4.5,
            students: 2100,
            lessons: 14,
            progress: 25,
            isEnrolled: true,
            category: 'healthy'
        },
        {
            id: 6,
            title: "Kỹ thuật nấu ăn nâng cao",
            description: "Nâng cao kỹ năng với các kỹ thuật nấu ăn chuyên nghiệp và sáng tạo món ăn",
            image: "https://images.unsplash.com/photo-1556909114-4e1728e25fa9?w=400",
            duration: "8 tuần",
            level: 'advanced',
            rating: 4.9,
            students: 850,
            lessons: 24,
            category: 'techniques'
        }
    ];

    const categories = ['vietnamese', 'italian', 'baking', 'techniques', 'healthy'];

    return {
        props: {
            learningPaths,
            categories
        }
    };
};

export default LearnPage;

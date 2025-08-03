import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Header from '@/components/layout/Header_fixed';
import {
    BookOpen,
    Play,
    CheckCircle,
    Clock,
    Star,
    ChefHat,
    Utensils,
    Users,
    Lock,
    PlayCircle,
    Pause,
    RotateCcw
} from 'lucide-react';

interface Lesson {
    id: string;
    title: string;
    description: string;
    duration: number; // minutes
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    completed: boolean;
    locked: boolean;
    videoUrl?: string;
    ingredients: string[];
    techniques: string[];
    tips: string[];
    imageUrl: string;
}

interface LearningPath {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    totalLessons: number;
    completedLessons: number;
    estimatedHours: number;
    rating: number;
    students: number;
    instructor: {
        name: string;
        avatar: string;
        expertise: string;
    };
    lessons: Lesson[];
    progress: number;
    imageUrl: string;
    tags: string[];
}

export default function LearningPathPage() {
    const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
    const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

    const categories = ['all', 'Món Việt', 'Món Âu', 'Món Á', 'Bánh ngọt', 'Kỹ thuật cơ bản'];
    const difficulties = ['all', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

    useEffect(() => {
        // Mock data for learning paths
        const mockPaths: LearningPath[] = [
            {
                id: '1',
                title: 'Nấu ăn cơ bản cho người mới',
                description: 'Học những kỹ năng nấu ăn cơ bản nhất từ cách cắt rau, ướp gia vị đến các món đơn giản',
                category: 'Kỹ thuật cơ bản',
                difficulty: 'BEGINNER',
                totalLessons: 12,
                completedLessons: 3,
                estimatedHours: 8,
                rating: 4.8,
                students: 1234,
                instructor: {
                    name: 'Chef Minh Anh',
                    avatar: '/images/chef-1.jpg',
                    expertise: 'Chuyên gia ẩm thực Việt'
                },
                progress: 25,
                imageUrl: '/images/cooking-basics.jpg',
                tags: ['Cơ bản', 'Người mới', 'Step-by-step'],
                lessons: [
                    {
                        id: '1-1',
                        title: 'Kỹ thuật cắt rau cơ bản',
                        description: 'Học cách cắt rau an toàn và hiệu quả',
                        duration: 30,
                        difficulty: 'BEGINNER',
                        completed: true,
                        locked: false,
                        ingredients: ['Cà rốt', 'Hành tây', 'Tỏi', 'Ớt'],
                        techniques: ['Cắt julienne', 'Cắt dice', 'Thái lát'],
                        tips: ['Giữ dao luôn sắc', 'Cắt theo hướng thớ rau'],
                        imageUrl: '/images/cutting-vegetables.jpg'
                    },
                    {
                        id: '1-2',
                        title: 'Cách ướp gia vị',
                        description: 'Học nghệ thuật ướp gia vị để tạo hương vị',
                        duration: 25,
                        difficulty: 'BEGINNER',
                        completed: true,
                        locked: false,
                        ingredients: ['Thịt heo', 'Nước mắm', 'Đường', 'Tiêu'],
                        techniques: ['Ướp khô', 'Ướp ướt', 'Massage thịt'],
                        tips: ['Ướp trước 30 phút', 'Dùng đúng tỷ lệ'],
                        imageUrl: '/images/marinating.jpg'
                    },
                    {
                        id: '1-3',
                        title: 'Nấu cơm ngon',
                        description: 'Bí quyết nấu cơm dẻo thơm',
                        duration: 20,
                        difficulty: 'BEGINNER',
                        completed: true,
                        locked: false,
                        ingredients: ['Gạo tám', 'Nước'],
                        techniques: ['Vo gạo', 'Đong nước', 'Điều chỉnh lửa'],
                        tips: ['Vo gạo 3 lần', 'Tỷ lệ nước 1:1.2'],
                        imageUrl: '/images/cooking-rice.jpg'
                    }
                ]
            },
            {
                id: '2',
                title: 'Làm chủ món Việt truyền thống',
                description: 'Khám phá và thành thạo các món ăn truyền thống Việt Nam',
                category: 'Món Việt',
                difficulty: 'INTERMEDIATE',
                totalLessons: 15,
                completedLessons: 0,
                estimatedHours: 12,
                rating: 4.9,
                students: 856,
                instructor: {
                    name: 'Chef Thanh Hương',
                    avatar: '/images/chef-2.jpg',
                    expertise: 'Master Chef Việt Nam'
                },
                progress: 0,
                imageUrl: '/images/vietnamese-cuisine.jpg',
                tags: ['Truyền thống', 'Văn hóa', 'Đặc sản'],
                lessons: []
            },
            {
                id: '3',
                title: 'Bánh ngọt Pháp cơ bản',
                description: 'Học làm các loại bánh ngọt Pháp từ cơ bản đến nâng cao',
                category: 'Bánh ngọt',
                difficulty: 'ADVANCED',
                totalLessons: 20,
                completedLessons: 0,
                estimatedHours: 15,
                rating: 4.7,
                students: 432,
                instructor: {
                    name: 'Chef Pierre Dubois',
                    avatar: '/images/chef-3.jpg',
                    expertise: 'Pastry Chef từ Paris'
                },
                progress: 0,
                imageUrl: '/images/french-pastry.jpg',
                tags: ['Bánh ngọt', 'Kỹ thuật cao', 'Pháp'],
                lessons: []
            }
        ];

        setLearningPaths(mockPaths);
        if (mockPaths.length > 0) {
            setSelectedPath(mockPaths[0]);
        }
    }, []);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'BEGINNER': return 'text-green-600 bg-green-100';
            case 'INTERMEDIATE': return 'text-yellow-600 bg-yellow-100';
            case 'ADVANCED': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getDifficultyText = (difficulty: string) => {
        switch (difficulty) {
            case 'BEGINNER': return 'Cơ bản';
            case 'INTERMEDIATE': return 'Trung bình';
            case 'ADVANCED': return 'Nâng cao';
            default: return 'Không xác định';
        }
    };

    const filteredPaths = learningPaths.filter(path => {
        const categoryMatch = filterCategory === 'all' || path.category === filterCategory;
        const difficultyMatch = filterDifficulty === 'all' || path.difficulty === filterDifficulty;
        return categoryMatch && difficultyMatch;
    });

    const startLesson = (lesson: Lesson) => {
        if (!lesson.locked) {
            setCurrentLesson(lesson);
            setIsPlaying(true);
        }
    };

    const completeLesson = (lessonId: string) => {
        if (selectedPath) {
            const updatedLessons = selectedPath.lessons.map(lesson =>
                lesson.id === lessonId ? { ...lesson, completed: true } : lesson
            );

            const completedCount = updatedLessons.filter(l => l.completed).length;
            const progress = (completedCount / selectedPath.totalLessons) * 100;

            setSelectedPath({
                ...selectedPath,
                lessons: updatedLessons,
                completedLessons: completedCount,
                progress
            });
        }
    };

    return (
        <>
            <Head>
                <title>Learning Path - Smart Cooking AI</title>
                <meta name="description" content="Lộ trình học nấu ăn có hệ thống - Smart Cooking AI" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Header />

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <BookOpen className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Learning Path 📚
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Lộ trình học nấu ăn có hệ thống từ cơ bản đến nâng cao
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar - Course List */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Lộ trình học tập</h3>

                                {/* Filters */}
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                                        <select
                                            value={filterCategory}
                                            onChange={(e) => setFilterCategory(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                            title="Chọn danh mục"
                                        >
                                            {categories.map(category => (
                                                <option key={category} value={category}>
                                                    {category === 'all' ? 'Tất cả' : category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Độ khó</label>
                                        <select
                                            value={filterDifficulty}
                                            onChange={(e) => setFilterDifficulty(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                            title="Chọn độ khó"
                                        >
                                            {difficulties.map(difficulty => (
                                                <option key={difficulty} value={difficulty}>
                                                    {difficulty === 'all' ? 'Tất cả' : getDifficultyText(difficulty)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Course List */}
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {filteredPaths.map((path) => (
                                        <div
                                            key={path.id}
                                            onClick={() => setSelectedPath(path)}
                                            className={`p-4 rounded-lg cursor-pointer transition-all ${selectedPath?.id === path.id
                                                ? 'bg-blue-100 border-2 border-blue-500'
                                                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                                }`}
                                        >
                                            <h4 className="font-semibold text-gray-900 text-sm mb-2">{path.title}</h4>
                                            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                                <span className={`px-2 py-1 rounded ${getDifficultyColor(path.difficulty)}`}>
                                                    {getDifficultyText(path.difficulty)}
                                                </span>
                                                <span className="flex items-center">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {path.estimatedHours}h
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {path.completedLessons}/{path.totalLessons} bài học
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-3">
                            {selectedPath ? (
                                <div className="space-y-6">
                                    {/* Course Header */}
                                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                                            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                                            <div className="absolute bottom-6 left-6 text-white">
                                                <h2 className="text-2xl font-bold mb-2">{selectedPath.title}</h2>
                                                <p className="text-blue-100 mb-4">{selectedPath.description}</p>
                                                <div className="flex items-center space-x-4 text-sm">
                                                    <div className="flex items-center">
                                                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                                        <span>{selectedPath.rating}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Users className="h-4 w-4 mr-1" />
                                                        <span>{selectedPath.students} học viên</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="h-4 w-4 mr-1" />
                                                        <span>{selectedPath.estimatedHours} giờ</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            {/* Progress */}
                                            <div className="mb-6">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className="font-semibold text-gray-900">Tiến độ học tập</h3>
                                                    <span className="text-sm text-gray-600">
                                                        {selectedPath.completedLessons}/{selectedPath.totalLessons} bài học
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300"
                                                    ></div>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {Math.round(selectedPath.progress)}% hoàn thành
                                                </p>
                                            </div>

                                            {/* Instructor */}
                                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <ChefHat className="h-6 w-6 text-gray-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{selectedPath.instructor.name}</h4>
                                                    <p className="text-sm text-gray-600">{selectedPath.instructor.expertise}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lessons List */}
                                    <div className="bg-white rounded-2xl shadow-lg p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Danh sách bài học</h3>

                                        <div className="space-y-4">
                                            {selectedPath.lessons.map((lesson, index) => (
                                                <div
                                                    key={lesson.id}
                                                    className={`p-4 border rounded-lg transition-all ${lesson.completed
                                                        ? 'border-green-200 bg-green-50'
                                                        : lesson.locked
                                                            ? 'border-gray-200 bg-gray-50 opacity-60'
                                                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            {/* Lesson Status Icon */}
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${lesson.completed
                                                                ? 'bg-green-500 text-white'
                                                                : lesson.locked
                                                                    ? 'bg-gray-400 text-white'
                                                                    : 'bg-blue-500 text-white'
                                                                }`}>
                                                                {lesson.completed ? (
                                                                    <CheckCircle className="h-5 w-5" />
                                                                ) : lesson.locked ? (
                                                                    <Lock className="h-5 w-5" />
                                                                ) : (
                                                                    <span className="text-sm font-bold">{index + 1}</span>
                                                                )}
                                                            </div>

                                                            {/* Lesson Info */}
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-gray-900 mb-1">{lesson.title}</h4>
                                                                <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>

                                                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                                    <div className="flex items-center">
                                                                        <Clock className="h-3 w-3 mr-1" />
                                                                        <span>{lesson.duration} phút</span>
                                                                    </div>
                                                                    <span className={`px-2 py-1 rounded ${getDifficultyColor(lesson.difficulty)}`}>
                                                                        {getDifficultyText(lesson.difficulty)}
                                                                    </span>
                                                                    <div className="flex items-center">
                                                                        <Utensils className="h-3 w-3 mr-1" />
                                                                        <span>{lesson.ingredients.length} nguyên liệu</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action Button */}
                                                        <div className="flex items-center space-x-2">
                                                            {lesson.completed ? (
                                                                <button
                                                                    onClick={() => startLesson(lesson)}
                                                                    className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-2"
                                                                >
                                                                    <RotateCcw className="h-4 w-4" />
                                                                    <span>Xem lại</span>
                                                                </button>
                                                            ) : lesson.locked ? (
                                                                <button
                                                                    disabled
                                                                    className="bg-gray-200 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed flex items-center space-x-2"
                                                                >
                                                                    <Lock className="h-4 w-4" />
                                                                    <span>Khóa</span>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => startLesson(lesson)}
                                                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                                                                >
                                                                    <PlayCircle className="h-4 w-4" />
                                                                    <span>Bắt đầu</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Lesson Details (expanded when current lesson) */}
                                                    {currentLesson?.id === lesson.id && (
                                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                <div>
                                                                    <h5 className="font-medium text-gray-900 mb-2">Nguyên liệu:</h5>
                                                                    <ul className="text-sm text-gray-600 space-y-1">
                                                                        {lesson.ingredients.map((ingredient, i) => (
                                                                            <li key={i}>• {ingredient}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>

                                                                <div>
                                                                    <h5 className="font-medium text-gray-900 mb-2">Kỹ thuật:</h5>
                                                                    <ul className="text-sm text-gray-600 space-y-1">
                                                                        {lesson.techniques.map((technique, i) => (
                                                                            <li key={i}>• {technique}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>

                                                                <div>
                                                                    <h5 className="font-medium text-gray-900 mb-2">Mẹo vặt:</h5>
                                                                    <ul className="text-sm text-gray-600 space-y-1">
                                                                        {lesson.tips.map((tip, i) => (
                                                                            <li key={i}>💡 {tip}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>

                                                            <div className="mt-4 flex justify-between items-center">
                                                                <div className="flex items-center space-x-2">
                                                                    <button
                                                                        onClick={() => setIsPlaying(!isPlaying)}
                                                                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                                                                    >
                                                                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                                                    </button>
                                                                    <span className="text-sm text-gray-600">
                                                                        {isPlaying ? 'Đang phát' : 'Tạm dừng'}
                                                                    </span>
                                                                </div>

                                                                {!lesson.completed && (
                                                                    <button
                                                                        onClick={() => completeLesson(lesson.id)}
                                                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                                                                    >
                                                                        <CheckCircle className="h-4 w-4" />
                                                                        <span>Hoàn thành bài học</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Chọn một lộ trình học tập
                                    </h3>
                                    <p className="text-gray-600">
                                        Chọn một lộ trình từ danh sách bên trái để bắt đầu học
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const session = await getSession(context);

    return {
        props: {
            session,
        },
    };
};

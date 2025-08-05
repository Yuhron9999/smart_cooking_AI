// import React, { useState } from 'react';
// import Head from 'next/head';
// import { GetServerSideProps } from 'next';
// import { getSession } from 'next-auth/react';
// import Header from '@/components/layout/Header';
// import {
//     BookOpen,
//     Clock,
//     Users,
//     Award,
//     Play,
//     CheckCircle,
//     Lock,
//     Star,
//     ChefHat,
//     Utensils,
//     Trophy,
//     Target,
//     ArrowRight
// } from 'lucide-react';

// interface Lesson {
//     id: string;
//     title: string;
//     description: string;
//     duration: string;
//     difficulty: 'Dễ' | 'Trung bình' | 'Khó';
//     isCompleted: boolean;
//     isLocked: boolean;
//     videoUrl?: string;
//     ingredients?: string[];
//     skills: string[];
// }

// interface LearningPath {
//     id: string;
//     title: string;
//     description: string;
//     level: 'Beginner' | 'Intermediate' | 'Advanced';
//     totalLessons: number;
//     completedLessons: number;
//     estimatedHours: number;
//     rating: number;
//     students: number;
//     lessons: Lesson[];
//     badge?: string;
// }

// import './learning-path.css';

// export default function LearningPathPage() {
//     const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
//     const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

//     const learningPaths: LearningPath[] = [
//         {
//             id: '1',
//             title: 'Nấu ăn cơ bản cho người mới',
//             description: 'Học các kỹ năng nấu ăn cơ bản từ việc cắt rau đến nấu cơm',
//             level: 'Beginner',
//             totalLessons: 12,
//             completedLessons: 3,
//             estimatedHours: 15,
//             rating: 4.8,
//             students: 2549,
//             badge: '🥉 Bronze Chef',
//             lessons: [
//                 {
//                     id: '1-1',
//                     title: 'An toàn trong bếp',
//                     description: 'Học các quy tắc an toàn cơ bản khi nấu ăn',
//                     duration: '15 phút',
//                     difficulty: 'Dễ',
//                     isCompleted: true,
//                     isLocked: false,
//                     skills: ['An toàn bếp', 'Vệ sinh thực phẩm']
//                 },
//                 {
//                     id: '1-2',
//                     title: 'Cách cầm dao và cắt rau cơ bản',
//                     description: 'Kỹ thuật cầm dao đúng cách và các kiểu cắt rau phổ biến',
//                     duration: '25 phút',
//                     difficulty: 'Dễ',
//                     isCompleted: true,
//                     isLocked: false,
//                     ingredients: ['Cà rót', 'Hành tây', 'Cà chua'],
//                     skills: ['Kỹ thuật dao', 'Cắt rau']
//                 },
//                 {
//                     id: '1-3',
//                     title: 'Nấu cơm ngon',
//                     description: 'Bí quyết nấu cơm tám dẻo, không bị khê',
//                     duration: '30 phút',
//                     difficulty: 'Dễ',
//                     isCompleted: true,
//                     isLocked: false,
//                     ingredients: ['Gạo tám', 'Nước'],
//                     skills: ['Nấu cơm', 'Kiểm soát nhiệt độ']
//                 },
//                 {
//                     id: '1-4',
//                     title: 'Xào rau cơ bản',
//                     description: 'Học cách xào rau giữ được màu xanh và giòn',
//                     duration: '20 phút',
//                     difficulty: 'Trung bình',
//                     isCompleted: false,
//                     isLocked: false,
//                     ingredients: ['Cải xanh', 'Tỏi', 'Dầu ăn'],
//                     skills: ['Xào', 'Kiểm soát lửa']
//                 },
//                 {
//                     id: '1-5',
//                     title: 'Chiên trứng hoàn hảo',
//                     description: 'Các cách chiên trứng: ốp la, bác, cuộn',
//                     duration: '18 phút',
//                     difficulty: 'Trung bình',
//                     isCompleted: false,
//                     isLocked: true,
//                     ingredients: ['Trứng gà', 'Dầu ăn', 'Muối'],
//                     skills: ['Chiên', 'Kiểm soát nhiệt']
//                 }
//             ]
//         },
//         {
//             id: '2',
//             title: 'Món Việt truyền thống',
//             description: 'Học nấu các món ăn truyền thống Việt Nam đặc sắc',
//             level: 'Intermediate',
//             totalLessons: 16,
//             completedLessons: 0,
//             estimatedHours: 25,
//             rating: 4.9,
//             students: 1876,
//             badge: '🥈 Silver Chef',
//             lessons: [
//                 {
//                     id: '2-1',
//                     title: 'Phở Bò Hà Nội',
//                     description: 'Học cách nấu nước dùng phở trong, thơm và đậm đà',
//                     duration: '3 giờ',
//                     difficulty: 'Khó',
//                     isCompleted: false,
//                     isLocked: false,
//                     ingredients: ['Xương bò', 'Thịt bò', 'Bánh phở', 'Gia vị'],
//                     skills: ['Ninh nước dùng', 'Ướp thịt', 'Trình bày']
//                 },
//                 {
//                     id: '2-2',
//                     title: 'Bún Chả Hà Nội',
//                     description: 'Món bún chả thơm lừng với chả nướng và nước mắm chua ngọt',
//                     duration: '45 phút',
//                     difficulty: 'Trung bình',
//                     isCompleted: false,
//                     isLocked: true,
//                     ingredients: ['Thịt heo', 'Bún tươi', 'Rau sống'],
//                     skills: ['Nướng', 'Pha nước mắm', 'Trình bày']
//                 }
//             ]
//         },
//         {
//             id: '3',
//             title: 'Kỹ thuật Chef chuyên nghiệp',
//             description: 'Những kỹ thuật nấu ăn nâng cao của các chef chuyên nghiệp',
//             level: 'Advanced',
//             totalLessons: 20,
//             completedLessons: 0,
//             estimatedHours: 40,
//             rating: 4.7,
//             students: 856,
//             badge: '🥇 Gold Chef',
//             lessons: [
//                 {
//                     id: '3-1',
//                     title: 'Sous Vide - Nấu chân không',
//                     description: 'Kỹ thuật nấu chân không để giữ nguyên dinh dưỡng',
//                     duration: '2 giờ',
//                     difficulty: 'Khó',
//                     isCompleted: false,
//                     isLocked: false,
//                     skills: ['Sous vide', 'Kiểm soát nhiệt độ chính xác']
//                 }
//             ]
//         }
//     ];

//     const userStats = {
//         totalHoursLearned: 45,
//         coursesCompleted: 2,
//         currentLevel: 'Bronze Chef',
//         nextLevelProgress: 65,
//         badges: ['🥉 Bronze Chef', '🏆 Fast Learner', '⭐ Perfect Student']
//     };

//     const getDifficultyColor = (difficulty: string) => {
//         switch (difficulty) {
//             case 'Dễ': return 'text-green-600 bg-green-100';
//             case 'Trung bình': return 'text-yellow-600 bg-yellow-100';
//             case 'Khó': return 'text-red-600 bg-red-100';
//             default: return 'text-gray-600 bg-gray-100';
//         }
//     };

//     const getLevelColor = (level: string) => {
//         switch (level) {
//             case 'Beginner': return 'from-green-500 to-green-600';
//             case 'Intermediate': return 'from-yellow-500 to-orange-500';
//             case 'Advanced': return 'from-red-500 to-purple-600';
//             default: return 'from-gray-500 to-gray-600';
//         }
//     };

//     return (
//         <>
//             <Head>
//                 <title>Learning Path - Smart Cooking AI</title>
//                 <meta name="description" content="Lộ trình học nấu ăn từ cơ bản đến nâng cao - Smart Cooking AI" />
//             </Head>

//             <div className="min-h-screen bg-gray-50">
//                 <Header />

//                 <div className="max-w-7xl mx-auto px-4 py-8">
//                     {/* Header */}
//                     <div className="text-center mb-8">
//                         <div className="flex justify-center mb-4">
//                             <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//                                 <BookOpen className="h-8 w-8 text-white" />
//                             </div>
//                         </div>
//                         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                             Learning Path 📚
//                         </h1>
//                         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//                             Học nấu ăn từ cơ bản đến nâng cao với lộ trình cá nhân hóa
//                         </p>
//                     </div>

//                     {/* User Stats */}
//                     <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
//                         <div className="flex items-center justify-between mb-4">
//                             <h2 className="text-xl font-bold text-gray-900">Tiến độ học tập</h2>
//                             <div className="flex items-center space-x-2 text-orange-600">
//                                 <Trophy className="h-5 w-5" />
//                                 <span className="font-medium">{userStats.currentLevel}</span>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//                             <div className="text-center">
//                                 <div className="text-2xl font-bold text-blue-600 mb-1">{userStats.totalHoursLearned}h</div>
//                                 <div className="text-sm text-gray-600">Tổng thời gian học</div>
//                             </div>
//                             <div className="text-center">
//                                 <div className="text-2xl font-bold text-green-600 mb-1">{userStats.coursesCompleted}</div>
//                                 <div className="text-sm text-gray-600">Khóa học hoàn thành</div>
//                             </div>
//                             <div className="text-center">
//                                 <div className="text-2xl font-bold text-purple-600 mb-1">{userStats.badges.length}</div>
//                                 <div className="text-sm text-gray-600">Huy hiệu đạt được</div>
//                             </div>
//                             <div className="text-center">
//                                 <div className="text-2xl font-bold text-orange-600 mb-1">{userStats.nextLevelProgress}%</div>
//                                 <div className="text-sm text-gray-600">Đến level tiếp theo</div>
//                             </div>
//                         </div>

//                         {/* Progress Bar */}
//                         <div className="mb-4">
//                             <div className="flex justify-between text-sm text-gray-600 mb-2">
//                                 <span>Tiến độ đến Silver Chef</span>
//                                 <span>{userStats.nextLevelProgress}%</span>
//                             </div>
//                             <div className="w-full bg-gray-200 rounded-full h-2">
//                                 <div
//                                     className={`bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300 progress-bar`}
//                                     title="Tiến độ đến Silver Chef"
//                                     role="progressbar"
//                                     aria-valuenow={Number(userStats.nextLevelProgress)}
//                                     aria-valuemin={0}
//                                     aria-valuemax={100}
//                                     data-progress={userStats.nextLevelProgress}
//                                 ></div>
//                             </div>
//                         </div>

//                         {/* Badges */}
//                         <div>
//                             <p className="text-sm font-medium text-gray-700 mb-2">Huy hiệu đã đạt được:</p>
//                             <div className="flex flex-wrap gap-2">
//                                 {userStats.badges.map((badge, index) => (
//                                     <span
//                                         key={index}
//                                         className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"
//                                     >
//                                         {badge}
//                                     </span>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Learning Paths */}
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                         {learningPaths.map((path) => (
//                             <div
//                                 key={path.id}
//                                 className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300"
//                                 onClick={() => setSelectedPath(path)}
//                             >
//                                 {/* Path Header */}
//                                 <div className={`h-32 bg-gradient-to-br ${getLevelColor(path.level)} p-6 text-white relative overflow-hidden`}>
//                                     <div className="absolute top-2 right-2">
//                                         <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
//                                             {path.level}
//                                         </span>
//                                     </div>
//                                     <div className="absolute bottom-4 left-6">
//                                         <h3 className="text-xl font-bold mb-1">{path.title}</h3>
//                                         <p className="text-sm opacity-90">{path.badge}</p>
//                                     </div>
//                                     <ChefHat className="absolute -bottom-4 -right-4 h-20 w-20 opacity-20" />
//                                 </div>

//                                 {/* Path Content */}
//                                 <div className="p-6">
//                                     <p className="text-gray-600 mb-4 line-clamp-2">{path.description}</p>

//                                     {/* Stats */}
//                                     <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
//                                         <div className="flex items-center space-x-2 text-gray-600">
//                                             <BookOpen className="h-4 w-4" />
//                                             <span>{path.totalLessons} bài học</span>
//                                         </div>
//                                         <div className="flex items-center space-x-2 text-gray-600">
//                                             <Clock className="h-4 w-4" />
//                                             <span>{path.estimatedHours}h</span>
//                                         </div>
//                                         <div className="flex items-center space-x-2 text-gray-600">
//                                             <Star className="h-4 w-4 text-yellow-500" />
//                                             <span>{path.rating}</span>
//                                         </div>
//                                         <div className="flex items-center space-x-2 text-gray-600">
//                                             <Users className="h-4 w-4" />
//                                             <span>{path.students.toLocaleString()}</span>
//                                         </div>
//                                     </div>

//                                     {/* Progress */}
//                                     <div className="mb-4">
//                                         <div className="flex justify-between text-sm text-gray-600 mb-2">
//                                             <span>Tiến độ</span>
//                                             <span>{path.completedLessons}/{path.totalLessons}</span>
//                                             <div
//                                                 className={`bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full progress-bar`}
//                                                 role="progressbar"
//                                                 aria-label={`Tiến độ học: ${path.completedLessons}/${path.totalLessons} bài học hoàn thành`}
//                                                 aria-valuenow={Math.round((path.completedLessons / path.totalLessons) * 100)}
//                                                 aria-valuemin={0}
//                                                 aria-valuemax={100}
//                                                 data-progress={Math.round((path.completedLessons / path.totalLessons) * 100)}
//                                             ></div>
//                                         </div>
//                                     </div>

//                                     {/* Action Button */}
//                                     <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2">
//                                         {path.completedLessons > 0 ? (
//                                             <>
//                                                 <Play className="h-4 w-4" />
//                                                 <span>Tiếp tục học</span>
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <BookOpen className="h-4 w-4" />
//                                                 <span>Bắt đầu học</span>
//                                             </>
//                                         )}
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Selected Path Details Modal */}
//                     {selectedPath && (
//                         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                             <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//                                 {/* Modal Header */}
//                                 <div className={`bg-gradient-to-r ${getLevelColor(selectedPath.level)} p-6 text-white`}>
//                                     <div className="flex justify-between items-start mb-4">
//                                         <div>
//                                             <h2 className="text-2xl font-bold mb-1">{selectedPath.title}</h2>
//                                             <p className="opacity-90">{selectedPath.description}</p>
//                                         </div>
//                                         <button
//                                             onClick={() => setSelectedPath(null)}
//                                             className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
//                                             title="Đóng chi tiết khóa học"
//                                             aria-label="Đóng chi tiết khóa học"
//                                         >
//                                             <ArrowRight className="h-5 w-5 rotate-45" />
//                                         </button>
//                                     </div>

//                                     <div className="flex items-center space-x-6 text-sm">
//                                         <span className="flex items-center space-x-1">
//                                             <BookOpen className="h-4 w-4" />
//                                             <span>{selectedPath.totalLessons} bài học</span>
//                                         </span>
//                                         <span className="flex items-center space-x-1">
//                                             <Clock className="h-4 w-4" />
//                                             <span>{selectedPath.estimatedHours} giờ</span>
//                                         </span>
//                                         <span className="flex items-center space-x-1">
//                                             <Award className="h-4 w-4" />
//                                             <span>{selectedPath.badge}</span>
//                                         </span>
//                                     </div>
//                                 </div>

//                                 {/* Lessons List */}
//                                 <div className="p-6">
//                                     <h3 className="text-xl font-bold text-gray-900 mb-4">Danh sách bài học</h3>

//                                     <div className="space-y-4">
//                                         {selectedPath.lessons.map((lesson, index) => (
//                                             <div
//                                                 key={lesson.id}
//                                                 className={`border rounded-lg p-4 transition-all duration-300 ${lesson.isLocked
//                                                         ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
//                                                         : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
//                                                     }`}
//                                                 onClick={() => !lesson.isLocked && setSelectedLesson(lesson)}
//                                             >
//                                                 <div className="flex items-start space-x-4">
//                                                     {/* Lesson Number & Status */}
//                                                     <div className="flex-shrink-0">
//                                                         {lesson.isCompleted ? (
//                                                             <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
//                                                                 <CheckCircle className="h-5 w-5 text-white" />
//                                                             </div>
//                                                         ) : lesson.isLocked ? (
//                                                             <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//                                                                 <Lock className="h-5 w-5 text-gray-500" />
//                                                             </div>
//                                                         ) : (
//                                                             <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
//                                                                 {index + 1}
//                                                             </div>
//                                                         )}
//                                                     </div>

//                                                     {/* Lesson Content */}
//                                                     <div className="flex-1">
//                                                         <div className="flex items-start justify-between mb-2">
//                                                             <h4 className={`font-semibold ${lesson.isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
//                                                                 {lesson.title}
//                                                             </h4>
//                                                             <div className="flex items-center space-x-2">
//                                                                 <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(lesson.difficulty)}`}>
//                                                                     {lesson.difficulty}
//                                                                 </span>
//                                                                 <span className="text-sm text-gray-500">{lesson.duration}</span>
//                                                             </div>
//                                                         </div>

//                                                         <p className={`text-sm mb-3 ${lesson.isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
//                                                             {lesson.description}
//                                                         </p>

//                                                         {/* Skills & Ingredients */}
//                                                         <div className="flex flex-wrap gap-2">
//                                                             {lesson.ingredients && lesson.ingredients.map((ingredient, idx) => (
//                                                                 <span
//                                                                     key={idx}
//                                                                     className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs"
//                                                                 >
//                                                                     🥕 {ingredient}
//                                                                 </span>
//                                                             ))}
//                                                             {lesson.skills.map((skill, idx) => (
//                                                                 <span
//                                                                     key={idx}
//                                                                     className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
//                                                                 >
//                                                                     ⚡ {skill}
//                                                                 </span>
//                                                             ))}
//                                                         </div>

//                                                         {!lesson.isLocked && !lesson.isCompleted && (
//                                                             <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
//                                                                 <Play className="h-3 w-3" />
//                                                                 <span>Bắt đầu học</span>
//                                                             </button>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// }

// export const getServerSideProps: GetServerSideProps = async (context: any) => {
//     const session = await getSession(context);

//     return {
//         props: {
//             session,
//         },
//     };
// };

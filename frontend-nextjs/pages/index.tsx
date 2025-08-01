import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { formatStatNumber } from '@/utils/format';
import {
  ChefHat,
  Sparkles,
  BookOpen,
  Star,
  Play,
  ArrowRight,
  Clock,
  Users,
  Mic,
  Brain,
  Globe,
  TrendingUp,
  Award,
  CheckCircle,
  Heart,
  Share2
} from 'lucide-react';// Simple interfaces
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
      icon: <Brain className="h-8 w-8" />,
      title: 'AI Thông Minh',
      description: 'Trợ lý AI giúp tạo công thức, phân tích nguyên liệu và gợi ý món ăn phù hợp với khẩu vị cá nhân',
      gradient: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Học Nấu Ăn',
      description: 'Khóa học từ cơ bản đến nâng cao với video HD và hướng dẫn chi tiết từ các chef chuyên nghiệp',
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: <Mic className="h-8 w-8" />,
      title: 'Điều Khiển Giọng Nói',
      description: 'Nấu ăn rảnh tay với trợ lý giọng nói thông minh, hỗ trợ tiếng Việt và đa ngôn ngữ',
      gradient: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Ẩm Thực Vùng Miền',
      description: 'Khám phá đặc sản 3 miền Bắc - Trung - Nam và các món quốc tế với văn hóa ẩm thực độc đáo',
      gradient: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 pt-20 lg:pt-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-10 right-10 w-20 h-20 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-10 left-20 w-20 h-20 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            {/* Logo & Branding */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-lg mb-6 group hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <ChefHat className="h-12 w-12 text-orange-500 group-hover:text-pink-500 transition-colors duration-300" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white animate-pulse" />
                  </div>
                </div>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
                  Smart Cooking
                </span>
                <br />
                <span className="text-gray-900">với AI</span>
              </h1>

              <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
                Trải nghiệm nấu ăn thông minh với sự hỗ trợ của AI.
                Khám phá hàng ngàn công thức, học từ chuyên gia và tạo ra những món ăn tuyệt vời.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="group bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
                <Sparkles className="h-5 w-5 mr-2 group-hover:animate-spin" />
                Bắt Đầu Với AI
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="group border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center hover:border-gray-400">
                <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Xem Demo
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { value: stats.totalRecipes, label: 'Công thức', color: 'text-orange-600', icon: BookOpen },
                { value: stats.totalUsers, label: 'Người dùng', color: 'text-pink-600', icon: Users },
                { value: stats.totalLessons, label: 'Bài học', color: 'text-purple-600', icon: Award },
                { value: stats.avgRating, label: 'Đánh giá', color: 'text-yellow-600', icon: Star, isRating: true }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center justify-center mb-3">
                      <Icon className={`h-6 w-6 ${stat.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                      {stat.isRating ? stat.value : formatStatNumber(stat.value)}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-orange-50 rounded-full mb-4">
              <TrendingUp className="h-6 w-6 text-orange-500" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Smart Cooking AI mang đến những công nghệ tiên tiến nhất để hỗ trợ bạn trong việc nấu ăn và khám phá thế giới ẩm thực
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`group relative bg-white rounded-2xl p-8 border ${feature.borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}>
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700">
                  {feature.description}
                </p>

                {/* Learn More Link */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-sm font-medium text-orange-600 hover:text-orange-700">
                    Tìm hiểu thêm
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Features */}
          <div className="mt-20">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Tại sao chọn Smart Cooking AI?
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    Chúng tôi không chỉ cung cấp công thức nấu ăn, mà còn là người bạn đồng hành trong hành trình khám phá ẩm thực của bạn.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      'AI cá nhân hóa theo sở thích',
                      'Hướng dẫn từng bước chi tiết',
                      'Cộng đồng đầu bếp chuyên nghiệp',
                      'Cập nhật xu hướng ẩm thực mới'
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="h-12 w-12 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">99.9%</h4>
                    <p className="text-gray-600">Độ hài lòng người dùng</p>
                  </div>
                </div>
              </div>
            </div>
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

      {/* Footer */}
      <Footer />
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

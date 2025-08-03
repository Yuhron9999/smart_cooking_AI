import React from 'react';
import Head from 'next/head';
import Header from '@/components/layout/Header_fixed';
import { ChefHat, Clock, Users, Star } from 'lucide-react';

const Recipes: React.FC = () => {
  const sampleRecipes = [
    {
      id: 1,
      title: 'Phở Bò Hà Nội',
      image: '/images/pho-bo.jpg',
      cookingTime: 120,
      servings: 4,
      difficulty: 'Medium',
      rating: 4.8,
      description: 'Món phở bò truyền thống Hà Nội với nước dùng thanh trong, thơm ngon.'
    },
    {
      id: 2,
      title: 'Bánh Xèo Miền Nam',
      image: '/images/banh-xeo.jpg',
      cookingTime: 45,
      servings: 2,
      difficulty: 'Easy',
      rating: 4.6,
      description: 'Bánh xèo giòn tan với nhân tôm thịt, ăn kèm rau sống.'
    },
    {
      id: 3,
      title: 'Bún Chả Hà Nội',
      image: '/images/bun-cha.jpg',
      cookingTime: 60,
      servings: 3,
      difficulty: 'Medium',
      rating: 4.9,
      description: 'Bún chả thơm lừng với chả nướng than hoa, nước mắm chua ngọt.'
    },
  ];

  return (
    <>
      <Head>
        <title>Công Thức Nấu Ăn - Smart Cooking AI</title>
        <meta name="description" content="Khám phá hàng ngàn công thức nấu ăn từ truyền thống đến hiện đại" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🍲 Công Thức Nấu Ăn
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Khám phá hàng ngàn công thức từ món truyền thống Việt Nam đến ẩm thực quốc tế,
                được tạo ra bởi AI và đầu bếp chuyên nghiệp.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <ChefHat className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">1,500</div>
                <div className="text-sm text-gray-600">Công Thức</div>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">30 phút</div>
                <div className="text-sm text-gray-600">Thời gian TB</div>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">25,000</div>
                <div className="text-sm text-gray-600">Người dùng</div>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">4.7</div>
                <div className="text-sm text-gray-600">Đánh giá</div>
              </div>
            </div>

            {/* Recipe Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleRecipes.map((recipe) => (
                <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-r from-orange-200 to-pink-200 flex items-center justify-center">
                    <ChefHat className="h-16 w-16 text-orange-500" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {recipe.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {recipe.cookingTime} phút
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {recipe.servings} người
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        {recipe.rating}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${recipe.difficulty === 'Easy'
                        ? 'bg-green-100 text-green-800'
                        : recipe.difficulty === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {recipe.difficulty}
                      </span>

                      <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                        Xem Chi Tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 font-medium">
                Xem Thêm Công Thức
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Recipes;

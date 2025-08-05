import React from 'react';
import Head from 'next/head';
import { ChefHat, Star, Clock, Users } from 'lucide-react';

export default function CSSTest() {
    return (
        <div className="page-container">
            <Head>
                <title>CSS Test - Smart Cooking AI</title>
            </Head>

            {/* Header */}
            <nav className="navbar bg-white border-b">
                <div className="container-modern">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-2">
                            <ChefHat className="w-6 h-6 text-orange-500" />
                            <span className="text-xl font-bold gradient-text">Smart Cooking AI</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container-modern py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold gradient-text mb-4">
                        CSS Test Page
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Kiểm tra các CSS classes và animations hoạt động
                    </p>
                </div>

                {/* Feature Cards Test */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="feature-card group">
                        <div className="feature-icon text-orange-500 group-hover:scale-110">
                            <ChefHat className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="feature-title group-hover:text-orange-600">Công thức AI</h3>
                        <p className="feature-description">
                            Tạo công thức từ nguyên liệu có sẵn
                        </p>
                    </div>

                    <div className="feature-card group">
                        <div className="feature-icon text-pink-500 group-hover:scale-110">
                            <Star className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="feature-title group-hover:text-pink-600">Đánh giá</h3>
                        <p className="feature-description">
                            Hệ thống đánh giá thông minh
                        </p>
                    </div>

                    <div className="feature-card group">
                        <div className="feature-icon text-blue-500 group-hover:scale-110">
                            <Clock className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="feature-title group-hover:text-blue-600">Tiết kiệm thời gian</h3>
                        <p className="feature-description">
                            Nấu ăn nhanh và hiệu quả
                        </p>
                    </div>

                    <div className="feature-card group">
                        <div className="feature-icon text-green-500 group-hover:scale-110">
                            <Users className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="feature-title group-hover:text-green-600">Cộng đồng</h3>
                        <p className="feature-description">
                            Chia sẻ với cộng đồng yêu nấu ăn
                        </p>
                    </div>
                </div>

                {/* Button Tests */}
                <div className="flex flex-wrap gap-4 justify-center mb-12">
                    <button className="btn-primary">
                        <ChefHat className="w-4 h-4 mr-2" />
                        Primary Button
                    </button>
                    <button className="btn-outline">
                        Secondary Button
                    </button>
                    <button className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300">
                        Gradient Button
                    </button>
                </div>

                {/* Card Tests */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <div className="card p-6">
                        <h3 className="text-xl font-bold mb-4">Standard Card</h3>
                        <p className="text-gray-600 mb-4">
                            Đây là một card tiêu chuẩn với shadow và border radius.
                        </p>
                        <button className="btn-primary w-full">Action Button</button>
                    </div>

                    <div className="recipe-card group p-6">
                        <h3 className="recipe-title group-hover:text-orange-600">Recipe Card</h3>
                        <p className="text-gray-600 mb-4">
                            Recipe card với group hover effects.
                        </p>
                        <div className="recipe-meta">
                            <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                30 phút
                            </span>
                            <span className="flex items-center">
                                <Star className="w-4 h-4 mr-1" />
                                4.8
                            </span>
                        </div>
                    </div>
                </div>

                {/* Animation Tests */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold mb-6">Animation Tests</h2>
                    <div className="flex justify-center space-x-8">
                        <div className="w-16 h-16 bg-orange-500 rounded-full animate-bounce-gentle"></div>
                        <div className="w-16 h-16 bg-pink-500 rounded-full animate-pulse"></div>
                        <div className="w-16 h-16 bg-blue-500 rounded-full animate-spin-slow"></div>
                        <div className="w-16 h-16 bg-green-500 rounded-full animate-ping-slow"></div>
                    </div>
                </div>

                {/* Input Tests */}
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-center">Form Tests</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Standard input"
                            className="input-field"
                        />
                        <input
                            type="email"
                            placeholder="Email input"
                            className="input-field border-red-300"
                        />
                        <textarea
                            placeholder="Textarea"
                            className="input-field resize-none"
                            rows={3}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

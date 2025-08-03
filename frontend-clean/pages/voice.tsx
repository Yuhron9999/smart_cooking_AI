import React from 'react';
import Head from 'next/head';
import { useSession, signIn } from 'next-auth/react';
import Header from '@/components/layout/Header_fixed';
import { Mic } from 'lucide-react';

const VoicePage: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <Head>
          <title>Voice Chef - Smart Cooking AI</title>
        </Head>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <Mic className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Đăng nhập để sử dụng Voice Chef
              </h1>
              <p className="text-gray-600 mb-6">
                Đăng nhập để sử dụng trợ lý giọng nói thông minh
              </p>
              <button
                onClick={() => signIn('google')}
                className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Đăng nhập với Google
              </button>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Voice Chef - Smart Cooking AI</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <Mic className="h-8 w-8 text-orange-500 mr-3" />
            Voice Chef - Trợ lý giọng nói
          </h1>

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="max-w-md mx-auto">
              <Mic className="h-24 w-24 text-orange-500 mx-auto mb-6" />
              <h2 className="text-xl font-semibold mb-4">
                Nói để tương tác với AI
              </h2>
              <p className="text-gray-600 mb-6">
                Nhấn và giữ để ghi âm câu hỏi của bạn
              </p>

              <button
                className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
                title="Nhấn và giữ để ghi âm câu hỏi của bạn"
              >
                <Mic className="h-6 w-6 mx-auto" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default VoicePage;

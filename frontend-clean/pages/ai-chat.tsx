import React from 'react';
import Head from 'next/head';
import Header from '@/components/layout/Header_fixed';
import { MessageCircle } from 'lucide-react';
import { getSession } from 'next-auth/react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

export default function AIChatPage() {
    return (
        <>
            <Head>
                <title>Trò chuyện AI - Smart Cooking AI</title>
                <meta name="description" content="Trò chuyện với AI về nấu ăn và món ngon" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Header />

                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <MessageCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                Trò chuyện AI
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Tính năng này đang được phát triển. Vui lòng quay lại sau!
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: false,
            },
        };
    }

    return {
        props: {
            session,
        },
    };
};

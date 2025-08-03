// Pages - App configuration với NextJS + NextAuth
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import '../src/styles/globals.css';
import '../src/styles/variables.css'; // Import custom CSS variables

const inter = Inter({ subsets: ['latin'] });

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>Smart Cooking AI - Nấu ăn thông minh với AI</title>
        <meta name="description" content="Hệ thống nấu ăn thông minh tích hợp AI, Voice Assistant và nhận dạng món ăn" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SessionProvider session={session}>
        <div className={inter.className}>
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </>
  );
}

export default appWithTranslation(MyApp);

import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import '../src/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function App({
    Component,
    pageProps: { session, ...pageProps }
}: AppProps) {
    return (
        <div className={inter.className}>
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </div>
    );
}

import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
import '../styles/globals.css'
import Head from 'next/head'
import AuthWrapper from '../components/AuthWrapper'

interface CustomAppProps extends AppProps {
    pageProps: {
        session?: Session;
        [key: string]: any;
    };
}

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: CustomAppProps) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="icon" href="/icons/icon.svg" />
                <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
                <title>Smart Cooking AI - Nấu ăn thông minh với AI</title>
            </Head>
            <AuthWrapper>
                <SessionProvider session={session}>
                    <Component {...pageProps} />
                </SessionProvider>
            </AuthWrapper>
        </>
    )
}

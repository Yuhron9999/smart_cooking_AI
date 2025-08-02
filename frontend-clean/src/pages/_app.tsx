// Pages - App configuration với NextJS
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import '../styles/globals.css';

interface MyAppProps extends AppProps {
    pageProps: {
        session?: Session;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    };
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: MyAppProps) {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    );
}

export default MyApp;

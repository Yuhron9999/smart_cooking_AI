import { NextPage } from 'next';
import { useEffect, useState } from 'react';

interface ClientOnlyPageProps {
    children: React.ReactNode;
}

/**
 * HOC để tạo client-only pages tránh hydration mismatch hoàn toàn
 */
export function withClientOnly<P extends object>(
    Component: NextPage<P>
) {
    const ClientOnlyPage: NextPage<P> = (props) => {
        const [hasMounted, setHasMounted] = useState(false);

        useEffect(() => {
            setHasMounted(true);
        }, []);

        if (!hasMounted) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
                </div>
            );
        }

        return <Component {...props} />;
    };

    // Copy static methods
    if (Component.getInitialProps) {
        ClientOnlyPage.getInitialProps = Component.getInitialProps;
    }

    return ClientOnlyPage;
}

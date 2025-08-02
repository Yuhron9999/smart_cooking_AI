import { useSession } from 'next-auth/react';
import HydrationSafe from '@/components/common/HydrationSafe';

interface AuthWrapperProps {
    children: (session: any, isLoading: boolean) => React.ReactNode;
    fallback?: React.ReactNode;
}

export default function AuthWrapper({ children, fallback }: AuthWrapperProps) {
    const { data: session, status } = useSession();

    const defaultFallback = (
        <div className="animate-pulse bg-gray-200 rounded h-8 w-20"></div>
    );

    return (
        <HydrationSafe fallback={fallback || defaultFallback}>
            {children(session, status === 'loading')}
            </HydrationSafe>
        );
    }

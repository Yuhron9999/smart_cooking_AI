import { useEffect, useState } from 'react';

interface ClientOnlyProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * Component chỉ render trên client để tránh hydration mismatch
 * Sử dụng cho content có thể khác nhau giữa server và client
 */
export const ClientOnly: React.FC<ClientOnlyProps> = ({
    children,
    fallback = null
}) => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

/**
 * Hook để kiểm tra component đã mount trên client chưa
 */
export const useIsClient = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return isClient;
};

/**
 * Utility function để format số một cách consistent
 * Tránh hydration mismatch khi sử dụng toLocaleString()
 */
export const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
};

/**
 * Component wrapper cho stats để tránh hydration issues
 */
interface SafeStatsProps {
    value: number;
    suffix?: string;
    className?: string;
}

export const SafeStats: React.FC<SafeStatsProps> = ({
    value,
    suffix = '+',
    className = ''
}) => {
    return (
        <ClientOnly fallback={<span className={className}>Loading...</span>}>
            <span className={className}>
                {formatNumber(value)}{suffix}
            </span>
        </ClientOnly>
    );
};

export default ClientOnly;

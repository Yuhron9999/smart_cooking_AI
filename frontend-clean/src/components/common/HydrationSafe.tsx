import { useEffect, useState } from 'react';

interface HydrationSafeProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * Component đảm bảo không xảy ra hydration mismatch
 * Chỉ render children sau khi component đã mount ở client
 */
export default function HydrationSafe({ children, fallback = null }: HydrationSafeProps) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

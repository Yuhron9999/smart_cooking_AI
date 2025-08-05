import { useEffect, useState } from 'react';

interface AuthWrapperProps {
    children: React.ReactNode;
}

/**
 * Wrapper để tránh lỗi SSR với authentication
 */
export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Chỉ render sau khi component đã mount trên client
    if (!isMounted) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export default AuthWrapper;

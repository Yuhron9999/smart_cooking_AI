// Components - NoSSR wrapper để tránh hydration issues
import React, { useState, useEffect } from 'react';

interface NoSSRProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const NoSSR: React.FC<NoSSRProps> = ({ children, fallback = null }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return isClient ? <>{children}</> : <>{fallback}</>;
};

export default NoSSR;

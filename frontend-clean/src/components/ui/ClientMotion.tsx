// Components - Motion wrapper để tránh hydration mismatch
'use client';

import React, { useState, useEffect } from 'react';
import { motion, MotionProps } from 'framer-motion';

interface ClientMotionProps extends MotionProps {
    children: React.ReactNode;
    component?: keyof typeof motion;
}

const ClientMotion: React.FC<ClientMotionProps> = ({
    children,
    component = 'div',
    ...props
}) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        // Return static version for SSR
        const Component = component as any;
        return <Component {...props}>{children}</Component>;
    }

    // Return motion version for client
    const MotionComponent = motion[component] as any;
    return <MotionComponent {...props}>{children}</MotionComponent>;
};

export default ClientMotion;

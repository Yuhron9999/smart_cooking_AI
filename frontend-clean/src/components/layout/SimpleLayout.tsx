// Simplified Layout wrapper for authentication
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import Header from './Header';
import { motion } from 'framer-motion';

interface SimpleLayoutProps {
    children: React.ReactNode;
    session?: Session | null;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children, session }) => {
    return (
        <SessionProvider session={session}>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <motion.main
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1"
                >
                    {children}
                </motion.main>
            </div>
        </SessionProvider>
    );
};

export default SimpleLayout;

import React from 'react';
import Head from 'next/head';
import MainNavbar from './MainNavbar';
import NotificationSystem from '../NotificationSystem';

interface EnhancedLayoutProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    pageIcon?: React.ComponentType<any>;
    pageTitle: string;
    pageSubtitle?: string;
    showBackButton?: boolean;
    backButtonHref?: string;
    actions?: React.ReactNode;
    className?: string;
    navbarTheme?: 'default' | 'gradient' | 'dark' | 'glass';
}

const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({
    children,
    title,
    description,
    pageIcon,
    pageTitle,
    pageSubtitle,
    showBackButton = true,
    backButtonHref = '/dashboard',
    actions,
    className = '',
    navbarTheme = 'glass'
}) => {
    return (
        <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${className}`}>
            <Head>
                <title>{title}</title>
                {description && <meta name="description" content={description} />}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainNavbar
                pageIcon={pageIcon}
                pageTitle={pageTitle}
                pageSubtitle={pageSubtitle}
                showBackButton={showBackButton}
                backButtonHref={backButtonHref}
                actions={actions}
                theme={navbarTheme}
            />

            <main className="relative">
                {children}
            </main>

            <NotificationSystem />
        </div>
    );
};

export default EnhancedLayout;

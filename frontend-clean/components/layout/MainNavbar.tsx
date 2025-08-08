import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface MainNavbarProps {
    pageIcon?: React.ComponentType<any>;
    pageTitle: string;
    pageSubtitle?: string;
    showBackButton?: boolean;
    backButtonHref?: string;
    actions?: React.ReactNode;
    theme?: 'default' | 'gradient' | 'dark' | 'glass';
}

const MainNavbar: React.FC<MainNavbarProps> = ({
    pageIcon: PageIcon,
    pageTitle,
    pageSubtitle,
    showBackButton = true,
    backButtonHref = '/dashboard',
    actions,
    theme = 'default'
}) => {
    // Determine navbar classes based on theme
    const navbarClasses = {
        default: 'bg-white shadow-sm',
        gradient: 'bg-gradient-to-r from-orange-600 to-pink-600 text-white',
        dark: 'bg-gray-900 text-white',
        glass: 'bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm'
    };

    const navbarClass = navbarClasses[theme];

    return (
        <nav className={`sticky top-0 z-50 ${navbarClass}`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-4">
                    <div className="flex items-center">
                        {showBackButton && (
                            <Link href={backButtonHref} className="flex items-center mr-4 text-current hover:text-orange-500 transition-colors">
                                <ArrowLeft className="h-5 w-5 mr-1" />
                                <span className="text-sm font-medium">Quay lại</span>
                            </Link>
                        )}
                        
                        {PageIcon && (
                            <span className="flex-shrink-0 mr-3">
                                <PageIcon className="h-6 w-6 text-orange-500" />
                            </span>
                        )}
                        
                        <div>
                            <h1 className="text-lg font-medium">{pageTitle}</h1>
                            {pageSubtitle && <p className="text-sm opacity-80">{pageSubtitle}</p>}
                        </div>
                    </div>
                    
                    {actions && (
                        <div className="ml-auto flex items-center">
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default MainNavbar;

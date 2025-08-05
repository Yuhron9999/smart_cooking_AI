import React from 'react';

interface LoadingStateProps {
    message?: string;
    showDetails?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
    message = "Đang tải...",
    showDetails = false
}) => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <div className="absolute inset-0 rounded-full h-12 w-12 border-t-2 border-orange-200 animate-pulse mx-auto"></div>
                </div>
                <p className="text-gray-600 mb-2">{message}</p>
                {showDetails && (
                    <p className="text-xs text-gray-400">
                        Nếu tải quá lâu, hãy refresh trang
                    </p>
                )}
            </div>
        </div>
    );
};

export default LoadingState;

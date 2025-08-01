// UI Components - Loading Component với animation đẹp
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const loadingVariants = cva(
    "inline-flex items-center justify-center",
    {
        variants: {
            variant: {
                default: "text-blue-600",
                primary: "text-orange-500",
                secondary: "text-gray-500",
                success: "text-green-500",
                warning: "text-yellow-500",
                danger: "text-red-500"
            },
            size: {
                sm: "w-4 h-4",
                default: "w-6 h-6",
                lg: "w-8 h-8",
                xl: "w-12 h-12"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
);

export interface LoadingSpinnerProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
    text?: string;
    overlay?: boolean;
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
    ({ className, variant, size, text, overlay = false, ...props }, ref) => {
        const spinner = (
            <div
                className={cn(loadingVariants({ variant, size, className }))}
                {...props}
                ref={ref}
            >
                <svg
                    className="animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
                {text && <span className="ml-2 text-sm font-medium">{text}</span>}
            </div>
        );

        if (overlay) {
            return (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 shadow-xl">
                        {spinner}
                    </div>
                </div>
            );
        }

        return spinner;
    }
);
LoadingSpinner.displayName = "LoadingSpinner";

// Skeleton Loading Component
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "animate-pulse rounded-md bg-gray-200",
                    className
                )}
                {...props}
            />
        );
    }
);
Skeleton.displayName = "Skeleton";

// Recipe Card Skeleton
const RecipeCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between items-center pt-2">
                    <div className="flex space-x-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                </div>
            </div>
        </div>
    );
};

// Content Loading with multiple recipe cards
interface ContentLoadingProps {
    type?: 'recipes' | 'grid' | 'list';
    count?: number;
}

const ContentLoading: React.FC<ContentLoadingProps> = ({
    type = 'recipes',
    count = 6
}) => {
    if (type === 'recipes') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: count }).map((_, index) => (
                    <RecipeCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (type === 'list') {
        return (
            <div className="space-y-4">
                {Array.from({ length: count }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
                        <Skeleton className="h-16 w-16 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg border p-4">
                    <Skeleton className="h-32 w-full mb-4" />
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
    );
};

// Cooking Animation - Specific cho Smart Cooking AI
const CookingAnimation = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="relative w-24 h-24 mb-4">
                {/* Pot */}
                <div className="absolute bottom-0 w-20 h-16 bg-gray-700 rounded-b-xl mx-auto left-2"></div>

                {/* Steam */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-8 bg-gray-300 rounded-full opacity-70 animate-bounce"></div>
                    <div className="w-1 h-6 bg-gray-300 rounded-full ml-3 opacity-50 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-4 bg-gray-300 rounded-full ml-1 opacity-30 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>

                {/* Lid */}
                <div className="absolute bottom-12 w-20 h-4 bg-gray-600 rounded-xl mx-auto left-2"></div>
            </div>

            <div className="text-orange-600 text-lg font-medium mb-2">Đang nấu...</div>
            <div className="text-gray-500 text-sm text-center max-w-xs">
                AI đang phân tích và tạo ra công thức nấu ăn hoàn hảo cho bạn
            </div>
        </div>
    );
};

// AI Thinking Animation
const AIThinkingAnimation = () => {
    return (
        <div className="flex items-center space-x-2 text-purple-600">
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm font-medium">AI đang suy nghĩ...</span>
        </div>
    );
};

export {
    LoadingSpinner,
    Skeleton,
    RecipeCardSkeleton,
    ContentLoading,
    CookingAnimation,
    AIThinkingAnimation,
    loadingVariants
};

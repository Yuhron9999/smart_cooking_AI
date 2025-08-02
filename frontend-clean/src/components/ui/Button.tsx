// UI Components - Smart Cooking AI Button Component
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'danger' | 'gradient' | 'food';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    className = '',
    children,
    disabled,
    ...props
}) => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500 shadow-sm hover:shadow-md",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 shadow-sm",
        outline: "border-2 border-orange-500 text-orange-500 bg-transparent hover:bg-orange-50 focus:ring-orange-500",
        ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
        success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 shadow-sm hover:shadow-md",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 shadow-sm hover:shadow-md",
        danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm hover:shadow-md",
        gradient: "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 focus:ring-orange-500 shadow-lg hover:shadow-xl transform hover:scale-105",
        food: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 focus:ring-orange-500 shadow-lg hover:shadow-xl transform hover:scale-105"
    };

    const sizeClasses = {
        sm: "h-8 px-3 text-sm gap-1.5",
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-6 text-base gap-2.5",
        xl: "h-14 px-8 text-lg gap-3"
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
        <button
            className={combinedClasses}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin h-4 w-4"
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
                        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}

            {!loading && leftIcon && (
                <span className="flex-shrink-0">
                    {leftIcon}
                </span>
            )}

            <span className={loading ? "opacity-0" : ""}>
                {children}
            </span>

            {!loading && rightIcon && (
                <span className="flex-shrink-0">
                    {rightIcon}
                </span>
            )}
        </button>
    );
};

// Specialized button variants for Smart Cooking AI
export const FoodButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
    <Button variant="food" {...props} />
);

export const GradientButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
    <Button variant="gradient" {...props} />
);

export default Button;

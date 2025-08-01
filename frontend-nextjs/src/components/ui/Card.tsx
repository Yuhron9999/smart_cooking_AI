// UI Components - Card Component với thiết kế đẹp cho Smart Cooking AI
import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
    "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200",
    {
        variants: {
            variant: {
                default: "border-gray-200 bg-white hover:shadow-md",
                elevated: "border-gray-200 bg-white shadow-lg hover:shadow-xl",
                outlined: "border-2 border-gray-300 bg-white hover:border-gray-400",
                gradient: "bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200",
                food: "bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 border-orange-200 hover:shadow-lg",
                recipe: "bg-gradient-to-br from-green-50 to-blue-50 border-green-200 hover:shadow-md",
                ai: "bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 hover:shadow-md",
                glass: "bg-white/70 backdrop-blur-md border-white/20 shadow-xl"
            },
            padding: {
                none: "p-0",
                sm: "p-3",
                default: "p-4",
                lg: "p-6",
                xl: "p-8"
            },
            interactive: {
                true: "cursor-pointer hover:scale-105 active:scale-95",
                false: ""
            }
        },
        defaultVariants: {
            variant: "default",
            padding: "default",
            interactive: false
        }
    }
);

export interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
    asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, padding, interactive, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(cardVariants({ variant, padding, interactive, className }))}
            {...props}
        />
    )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

// Recipe Card Component - Chuyên biệt cho món ăn
interface RecipeCardProps extends CardProps {
    recipe: {
        id: number;
        title: string;
        description?: string;
        imageUrl?: string;
        cookingTime: number;
        difficulty: 'EASY' | 'MEDIUM' | 'HARD';
        rating?: number;
        servings?: number;
        calories?: number;
    };
    onView?: (id: number) => void;
    onFavorite?: (id: number) => void;
    isFavorite?: boolean;
}

const RecipeCard = React.forwardRef<HTMLDivElement, RecipeCardProps>(
    ({ recipe, onView, onFavorite, isFavorite, className, ...props }, ref) => {
        const difficultyColors = {
            EASY: 'text-green-600 bg-green-100',
            MEDIUM: 'text-yellow-600 bg-yellow-100',
            HARD: 'text-red-600 bg-red-100'
        };

        return (
            <Card
                ref={ref}
                variant="food"
                interactive={true}
                className={cn("overflow-hidden group", className)}
                onClick={() => onView?.(recipe.id)}
                {...props}
            >
                {recipe.imageUrl && (
                    <div className="aspect-video relative overflow-hidden">
                        <img
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2">
                            <button
                                type="button"
                                title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                                aria-label={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFavorite?.(recipe.id);
                                }}
                                className={cn(
                                    "p-2 rounded-full transition-colors",
                                    isFavorite
                                        ? "bg-red-500 text-white"
                                        : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
                                )}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-orange-600 transition-colors">
                            {recipe.title}
                        </CardTitle>
                        {recipe.rating && (
                            <div className="flex items-center text-sm text-yellow-600 ml-2">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {recipe.rating.toFixed(1)}
                            </div>
                        )}
                    </div>

                    {recipe.description && (
                        <CardDescription className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {recipe.description}
                        </CardDescription>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {recipe.cookingTime}p
                            </span>

                            {recipe.servings && (
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {recipe.servings} người
                                </span>
                            )}

                            {recipe.calories && (
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    {recipe.calories} kcal
                                </span>
                            )}
                        </div>

                        <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            difficultyColors[recipe.difficulty]
                        )}>
                            {recipe.difficulty === 'EASY' ? 'Dễ' : recipe.difficulty === 'MEDIUM' ? 'Trung bình' : 'Khó'}
                        </span>
                    </div>
                </CardContent>
            </Card>
        );
    }
);
RecipeCard.displayName = "RecipeCard";

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
    RecipeCard,
    cardVariants
};

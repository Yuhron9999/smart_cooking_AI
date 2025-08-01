// UI Components - Modal Component với animation đẹp
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const dialogContentVariants = cva(
    "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
    {
        variants: {
            size: {
                sm: "max-w-sm",
                default: "max-w-lg",
                lg: "max-w-2xl",
                xl: "max-w-4xl",
                full: "max-w-[95vw] max-h-[95vh]"
            }
        },
        defaultVariants: {
            size: "default"
        }
    }
);

export interface DialogContentProps
    extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> { }

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    DialogContentProps
>(({ className, children, size, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(dialogContentVariants({ size }), className)}
            {...props}
        >
            {children}
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col space-y-1.5 text-center sm:text-left",
            className
        )}
        {...props}
    />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
            className
        )}
        {...props}
    />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// Enhanced Modal Component cho Smart Cooking AI
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    size?: "sm" | "default" | "lg" | "xl" | "full";
    showCloseButton?: boolean;
    footer?: React.ReactNode;
    className?: string;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
    ({
        isOpen,
        onClose,
        title,
        description,
        children,
        size = "default",
        showCloseButton = true,
        footer,
        className
    }, ref) => {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent size={size} className={className} ref={ref}>
                    {(title || description) && (
                        <DialogHeader>
                            {title && <DialogTitle>{title}</DialogTitle>}
                            {description && <DialogDescription>{description}</DialogDescription>}
                        </DialogHeader>
                    )}

                    <div className="py-4">{children}</div>

                    {footer && (
                        <DialogFooter>
                            {footer}
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        );
    }
);
Modal.displayName = "Modal";

// Recipe Detail Modal
interface RecipeDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipe?: {
        id: number;
        title: string;
        description?: string;
        imageUrl?: string;
        ingredients: string[];
        instructions: string[];
        cookingTime: number;
        prepTime?: number;
        difficulty: 'EASY' | 'MEDIUM' | 'HARD';
        servings?: number;
        calories?: number;
        rating?: number;
    };
}

const RecipeDetailModal = React.forwardRef<HTMLDivElement, RecipeDetailModalProps>(
    ({ isOpen, onClose, recipe }, ref) => {
        if (!recipe) return null;

        const difficultyLabels = {
            EASY: 'Dễ',
            MEDIUM: 'Trung bình',
            HARD: 'Khó'
        };

        return (
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="lg"
                className="max-h-[90vh] overflow-auto"
                ref={ref}
            >
                <div className="space-y-6">
                    {/* Header Image */}
                    {recipe.imageUrl && (
                        <div className="aspect-video w-full overflow-hidden rounded-lg">
                            <img
                                src={recipe.imageUrl}
                                alt={recipe.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Title & Meta */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {recipe.title}
                        </h2>
                        {recipe.description && (
                            <p className="text-gray-600 mb-4">{recipe.description}</p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Nấu: {recipe.cookingTime} phút
                            </span>

                            {recipe.prepTime && (
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Chuẩn bị: {recipe.prepTime} phút
                                </span>
                            )}

                            {recipe.servings && (
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {recipe.servings} người
                                </span>
                            )}

                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                {difficultyLabels[recipe.difficulty]}
                            </span>

                            {recipe.rating && (
                                <span className="flex items-center text-yellow-600">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    {recipe.rating.toFixed(1)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-900">Nguyên liệu</h3>
                        <ul className="space-y-2">
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span className="text-gray-700">{ingredient}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Instructions */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-900">Cách làm</h3>
                        <ol className="space-y-4">
                            {recipe.instructions.map((instruction, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white text-sm font-bold rounded-full mr-4 flex-shrink-0 mt-0.5">
                                        {index + 1}
                                    </span>
                                    <span className="text-gray-700 leading-relaxed">{instruction}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </Modal>
        );
    }
);
RecipeDetailModal.displayName = "RecipeDetailModal";

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    Modal,
    RecipeDetailModal
};

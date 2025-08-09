// ============================================================================
// SMART COOKING AI - UNIFIED COMPONENTS INDEX
// ============================================================================
// Centralized export để dễ maintain và import
// Sử dụng: import { ComponentName } from '../src/components'

// === LAYOUT COMPONENTS ===
export { default as EnhancedLayout } from './layout/EnhancedLayout';
export { default as Layout } from './layout/Layout';
export { default as MainNavbar } from './layout/MainNavbar';
export { default as Header } from './layout/Header';
export { default as Footer } from './layout/Footer';
export { default as Navigation } from './layout/Navigation';
export { default as Sidebar } from './layout/Sidebar';
export { default as SimpleLayout } from './layout/SimpleLayout';

// === AUTH COMPONENTS ===
export { default as AuthWrapper } from './auth/AuthWrapper';

// === COMMON COMPONENTS ===
export { default as ClientOnly } from './common/ClientOnly';
export { default as LanguageSwitcher } from './common/LanguageSwitcher';
export { default as GoogleOAuthButton } from './common/GoogleOAuthButton';
export { default as GoogleOAuthButtonNew } from './common/GoogleOAuthButtonNew';
export { default as HydrationSafe } from './common/HydrationSafe';
export { default as NoSSR } from './common/NoSSR';
export { default as AuthErrorBoundary } from './common/AuthErrorBoundary';
export { default as NumberDisplay } from './common/NumberDisplay';

// === UI COMPONENTS (Named Exports) ===
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './ui/Card';
export { default as Button } from './ui/Button';
export { default as ClientMotion } from './ui/ClientMotion';

// === DASHBOARD COMPONENTS ===
export { default as UserDashboard } from './dashboard/UserDashboard';

// === AI COMPONENTS ===
export { default as AiInteractionHistory } from './ai/AiInteractionHistory';
export { default as AiRecipeGenerator } from './ai/AiRecipeGenerator';

// === RECIPE COMPONENTS ===
export { default as RecipeCard } from './recipe/RecipeCard';
export { default as RecipeCardFixed } from './recipe/RecipeCardFixed';

// === USER COMPONENTS ===
export { default as UserPreferencesPage } from './user/UserPreferencesPage';

// === DYNAMIC USER DATA MANAGEMENT COMPONENTS ===
export { default as DynamicUserDashboard } from './dynamic/DynamicUserDashboard';
export { default as DynamicRecipeCreator } from './dynamic/DynamicRecipeCreator';

// === STANDALONE COMPONENTS ===
export { default as NotificationSystem } from './NotificationSystem';
export { default as LoadingState } from './LoadingState';

// ============================================================================
// SAFE COMPONENT REGISTRY - Chỉ export những component thực sự tồn tại
// ============================================================================

// Verified Layout Components
export const LayoutComponents = {
  EnhancedLayout: () => import('./layout/EnhancedLayout'),
  Layout: () => import('./layout/Layout'),
  MainNavbar: () => import('./layout/MainNavbar'),
  Header: () => import('./layout/Header'),
  Footer: () => import('./layout/Footer'),
  Navigation: () => import('./layout/Navigation'),
  Sidebar: () => import('./layout/Sidebar'),
  SimpleLayout: () => import('./layout/SimpleLayout'),
};

// Verified UI Components  
export const UIComponents = {
  Button: () => import('./ui/Button'),
  Card: () => import('./ui/Card'),
  ClientMotion: () => import('./ui/ClientMotion'),
};

// Verified AI Components
export const AIComponents = {
  AiInteractionHistory: () => import('./ai/AiInteractionHistory'),
  AiRecipeGenerator: () => import('./ai/AiRecipeGenerator'),
};

// ============================================================================
// USAGE EXAMPLES:
// 
// // Cách 1: Named imports (Recommended)
// import { EnhancedLayout, Button, UserDashboard } from '../src/components'
//
// // Cách 2: Card components với named exports
// import { Card, CardHeader, CardContent } from '../src/components'
//
// // Cách 3: Dynamic imports cho code splitting
// const EnhancedLayout = React.lazy(LayoutComponents.EnhancedLayout)
// ============================================================================

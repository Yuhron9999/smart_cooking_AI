# 🎨 Smart Cooking AI - UI/UX Complete Reference Guide

## 📋 Tổng quan Hệ thống Frontend

**Framework**: Next.js 15.4.5 + React 18 + TypeScript  
**Styling**: Tailwind CSS với custom design system  
**Icons**: Lucide React (1000+ icons)  
**Status**: ✅ HOÀN THÀNH - 13 trang chính với UI/UX chuyên nghiệp

---

## 🚀 Danh sách Trang đã Hoàn thành

### 1. 🏠 **Homepage** (`pages/index.tsx`)

- **Trạng thái**: ✅ Hoàn thành
- **Tính năng**:
  - Hero section với gradient background
  - Feature showcase với animations
  - Statistics display
  - CTA buttons với hover effects
  - Responsive design
- **Components chính**:
  ```tsx
  - Hero section với ChefHat icon
  - Features grid (4 tính năng chính)
  - Statistics cards
  - Navigation header
  ```

### 2. 🍳 **Recipes Page** (`pages/recipes.tsx`)

- **Trạng thái**: ✅ Hoàn thành (Rebuild mới nhất)
- **Tính năng**:
  - Advanced search & filters
  - Recipe cards với rating system
  - Category filtering
  - Sort options (newest, popular, rating)
  - Create recipe modal
  - Responsive grid layout
- **Components chính**:
  ```tsx
  - SearchBar với real-time filtering
  - CategoryFilter với chips UI
  - RecipeCard component
  - CreateRecipeModal
  - SortDropdown
  - Pagination
  ```

### 3. 🤖 **AI Chat** (`pages/ai-chat.tsx`)

- **Trạng thái**: ✅ Hoàn thành (Rebuild mới nhất)
- **Tính năng**:
  - Real-time chat interface
  - Message bubbles với animations
  - Typing indicators
  - Quick suggestions
  - Voice input toggle
  - Chat history
- **Components chính**:
  ```tsx
  - ChatMessage component
  - MessageInput với voice toggle
  - QuickSuggestions
  - TypingIndicator
  - VoiceRecorder
  ```

### 4. 🎤 **Voice Assistant** (`pages/voice.tsx`)

- **Trạng thái**: ✅ Hoàn thành (Rebuild mới nhất)
- **Tính năng**:
  - Voice recording với waveform animation
  - Speech-to-text display
  - Voice commands list
  - Recording status indicators
  - Audio playback controls
- **Components chính**:
  ```tsx
  - VoiceRecorder với animation
  - WaveformVisualizer
  - CommandsList
  - RecordingStatus
  - AudioControls
  ```

### 5. 👤 **Profile Page** (`pages/profile.tsx`)

- **Trạng thái**: ✅ Hoàn thành (Existing - 789 lines)
- **Tính năng**: Comprehensive user profile management
- **Note**: File đã tồn tại với implementation đầy đủ

### 6. ⚙️ **Settings Page** (`pages/settings.tsx`)

- **Trạng thái**: ✅ Hoàn thành (Existing - 902 lines)
- **Tính năng**: Complete settings management system
- **Note**: File đã tồn tại với implementation đầy đủ

### 7. ❤️ **Favorites Page** (`pages/favorites.tsx`)

- **Trạng thái**: ✅ Hoàn thành (Existing - 860 lines)
- **Tính năng**: Comprehensive favorites management
- **Note**: File đã tồn tại với implementation đầy đủ

### 8. 📊 **Dashboard** (`pages/dashboard.tsx`)

- **Trạng thái**: ✅ Hoàn thành (Existing)
- **Tính năng**: Main dashboard với analytics
- **Note**: File đã tồn tại với implementation đầy đủ

### 9. ❓ **Help Center** (`pages/help.tsx`)

- **Trạng thái**: ✅ Hoàn thành (Mới tạo)
- **Tính năng**:
  - FAQ system với search
  - Category-based help sections
  - Video tutorials
  - Contact support form
  - Popular articles
- **Components chính**:
  ```tsx
  -SearchBar -
    CategoryTabs -
    FAQAccordion -
    VideoTutorials -
    ContactForm -
    PopularArticles;
  ```

### 10. 📞 **Contact Page** (`pages/contact.tsx`)

- **Trạng thái**: ✅ Hoàn thành (Mới tạo)
- **Tính năng**:
  - Contact form với validation
  - Multiple contact methods
  - Team member profiles
  - Company information
  - Social media links
- **Components chính**:
  ```tsx
  - ContactForm với validation
  - ContactMethods cards
  - TeamMembers grid
  - CompanyInfo
  - SocialLinks
  ```

### 11. 🏢 **About Page** (`pages/about.tsx`)

- **Trạng thái**: ✅ Hoàn thành (Mới tạo)
- **Tính năng**:
  - 4-tab system (Story, Team, Values, Timeline)
  - Company statistics
  - Team member profiles với achievements
  - Mission & Vision statements
  - Development timeline
- **Components chính**:
  ```tsx
  -TabNavigation -
    StorySection -
    TeamGrid -
    ValuesCards -
    TimelineComponent -
    StatisticsDisplay;
  ```

### 12. 🔐 **Authentication** (`pages/auth.tsx`)

- **Trạng thái**: ✅ Hoàn thành (Mới tạo)
- **Tính năng**:
  - Login/Register/Forgot Password
  - Form validation comprehensive
  - Google OAuth integration
  - Password visibility toggles
  - Success states
  - Split layout design
- **Components chính**:
  ```tsx
  -TabNavigation -
    LoginForm -
    RegisterForm -
    ForgotPasswordForm -
    FormValidation -
    GoogleAuthButton -
    SuccessState;
  ```

### 13. 🔔 **Notifications** (`pages/notifications.tsx`)

- **Trạng thái**: ✅ Hoàn thành (Mới tạo)
- **Tính năng**:
  - 8 notification types
  - Advanced filtering system
  - Notification settings panel
  - Batch operations
  - Real-time updates
- **Components chính**:
  ```tsx
  -NotificationList -
    FilterTabs -
    NotificationCard -
    SettingsPanel -
    BatchOperations;
  ```

### 14. 🧪 **CSS Test Page** (`pages/css-test.tsx`)

- **Trạng thái**: ✅ Hoàn thành (Test utility)
- **Mục đích**: Kiểm tra tất cả CSS classes và animations
- **Tính năng**:
  - Feature cards với group hover effects
  - Button variations test
  - Card components test
  - Animation demonstrations
  - Form input styles test
- **URL**: `http://localhost:3002/css-test`
- **Note**: Dùng để debug CSS issues và verify design system

---

## 🎨 Design System & Components

### Color Palette

```css
/* Primary Colors */
--orange-500: #f97316 --pink-600: #db2777 --blue-600: #2563eb
  --green-500: #10b981 /* Neutrals */ --gray-50: #f9fafb --gray-100: #f3f4f6
  --gray-900: #111827;
```

### Typography

```css
/* Headings */
.text-4xl: 36px (Hero titles)
.text-3xl: 30px (Page titles)
.text-2xl: 24px (Section titles)
.text-xl: 20px (Card titles)

/* Body Text */
.text-base: 16px (Normal text)
.text-sm: 14px (Captions)
.text-xs: 12px (Labels)
```

### Component Classes

#### Buttons

```css
/* Primary Button */
.btn-primary {
  @apply bg-orange-500 text-white px-6 py-3 rounded-lg font-medium
         hover:bg-orange-600 transition-colors flex items-center;
}

/* Secondary Button */
.btn-outline {
  @apply border-2 border-orange-500 text-orange-500 px-6 py-3 rounded-lg
         font-medium hover:bg-orange-50 transition-colors flex items-center;
}
```

#### Cards

```css
.card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200
         hover:shadow-md transition-shadow;
}
```

#### Input Fields

```css
.input-field {
  @apply w-full px-4 py-3 border border-gray-300 rounded-lg
         focus:ring-2 focus:ring-orange-500 focus:border-orange-500
         transition-colors;
}
```

### Animation Classes

```css
/* Hover Animations */
.hover-scale {
  @apply transform hover:scale-105 transition-transform duration-200;
}

/* Fade In */
.fade-in {
  @apply opacity-0 animate-fadeIn;
}

/* Gradient Text */
.gradient-text {
  @apply bg-gradient-to-r from-orange-500 to-pink-600
         bg-clip-text text-transparent;
}
```

---

## 🔧 Common Patterns & Best Practices

### 1. **Page Structure Template**

```tsx
export default function PageName() {
  const [state, setState] = useState();

  return (
    <div className="page-container">
      <Head>
        <title>Page Title - Smart Cooking AI</title>
      </Head>

      {/* Navigation */}
      <nav className="navbar">{/* Navigation content */}</nav>

      {/* Main Content */}
      <main className="container-modern py-8">{/* Page content */}</main>
    </div>
  );
}
```

### 2. **Form Validation Pattern**

```tsx
const [errors, setErrors] = useState<any>({});

const validateForm = (): boolean => {
  const newErrors: any = {};

  if (!formData.field) {
    newErrors.field = "Vui lòng nhập thông tin";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  // Submit logic
};
```

### 3. **Loading States**

```tsx
const [isLoading, setIsLoading] = useState(false);

// In button
<button disabled={isLoading} className="btn-primary">
  {isLoading ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      Đang xử lý...
    </>
  ) : (
    "Submit"
  )}
</button>;
```

### 4. **Modal Pattern**

```tsx
const [isModalOpen, setIsModalOpen] = useState(false);

{
  isModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        {/* Modal content */}
      </div>
    </div>
  );
}
```

### 5. **Error Handling UI**

```tsx
{
  errors.field && (
    <p className="mt-1 text-sm text-red-600 flex items-center">
      <AlertCircle className="w-4 h-4 mr-1" />
      {errors.field}
    </p>
  );
}
```

---

## 📱 Responsive Design Breakpoints

```css
/* Mobile First Approach */
.responsive-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4;
}

/* Breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

---

## 🎯 Features Implementation Status

### ✅ Completed Features

- [x] Complete page navigation system
- [x] Form validation & error handling
- [x] Loading states & animations
- [x] Modal systems
- [x] Responsive design across all pages
- [x] Professional UI/UX patterns
- [x] Icon integration (Lucide React)
- [x] Authentication flows
- [x] Search & filtering systems
- [x] Card-based layouts
- [x] Notification systems

### 🚀 Ready for Integration

- [ ] Backend API connections
- [ ] Real authentication (Google OAuth)
- [ ] Database integration
- [ ] File upload functionality
- [ ] Real-time features (WebSocket)
- [ ] PWA capabilities
- [ ] Performance optimization

---

## 🔄 How to Recreate Pages

### Method 1: Copy Existing Pattern

1. Take any existing page as template
2. Modify content and functionality
3. Keep design system consistent
4. Use same component patterns

### Method 2: From Scratch Guidelines

```tsx
// 1. Import dependencies
import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Icon1, Icon2 } from "lucide-react";

// 2. Define interfaces
interface FormData {
  field1: string;
  field2: string;
}

// 3. Component structure
export default function PageName() {
  // State management
  const [data, setData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(false);

  // Event handlers
  const handleSubmit = async (e: React.FormEvent) => {
    // Handle logic
  };

  // Render
  return (
    <div className="page-container">
      <Head>
        <title>Page Title - Smart Cooking AI</title>
      </Head>

      {/* Content */}
    </div>
  );
}
```

---

## 🎨 UI/UX Guidelines Summary

### 1. **Consistency**

- Use established color palette
- Follow component patterns
- Maintain spacing system
- Keep icon style consistent

### 2. **User Experience**

- Clear navigation paths
- Immediate feedback on actions
- Loading states for async operations
- Error messages with context
- Success confirmations

### 3. **Accessibility**

- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

### 4. **Performance**

- Lazy loading for heavy components
- Optimized images
- Efficient state management
- Minimal re-renders

---

## 📝 Notes for Future Development

### When Adding New Pages:

1. **Follow established patterns** từ file này
2. **Use consistent naming** conventions
3. **Implement responsive design** từ đầu
4. **Add proper TypeScript** typing
5. **Include error handling** and loading states
6. **Test across breakpoints**

### When Modifying Existing Pages:

1. **Check this reference** trước khi thay đổi
2. **Maintain design consistency**
3. **Update this document** nếu có thay đổi lớn
4. **Test thoroughly** after changes

### Emergency Recreation:

Nếu cần tái tạo lại toàn bộ hoặc một phần:

1. **Sử dụng file này** làm blueprint
2. **Copy component patterns** từ existing pages
3. **Maintain design system** consistency
4. **Reference color palette** và typography
5. **Follow responsive patterns**

---

## 🚀 Deployment Checklist

- [x] All 13 pages completed
- [x] Responsive design tested
- [x] Component consistency verified
- [x] TypeScript errors resolved
- [x] Navigation working properly
- [x] CSS/Tailwind errors resolved
- [x] Animations and transitions working
- [ ] Backend API integration
- [ ] Production build optimization
- [ ] SEO optimization
- [ ] Performance testing

---

## 🐛 Troubleshooting Common Issues

### CSS/Tailwind Errors

**Problem**: `@apply should not be used with the 'group' utility`

```
Syntax error: @apply should not be used with the 'group' utility
```

**Solution**: Separate `group` from `@apply` and use regular CSS classes:

```css
/* ❌ Wrong */
.feature-card {
  @apply card text-center group cursor-pointer;
}

/* ✅ Correct */
.feature-card {
  @apply card text-center cursor-pointer;
}
```

**Note**: Use `group` class directly in HTML instead:

```tsx
<div className="feature-card group">
  <div className="group-hover:scale-110">Content</div>
</div>
```

### React/Next.js Syntax Errors

**Problem**: JSX code after `export default` statement

```
Error: Expression expected
× Unterminated regexp literal
```

**Cause**: Code structure như sau sẽ gây lỗi:

```tsx
const HomePage = () => {
  return <div>Content</div>;
};

export default HomePage;

// ❌ JSX code here causes syntax error
<div>More content</div>;
```

**Solution**: Đảm bảo `export default` là dòng cuối cùng:

```tsx
const HomePage = () => {
  return <div>{/* All content inside return statement */}</div>;
};

export const getServerSideProps = async () => {
  // Server-side props here
};

export default HomePage; // Must be the last line
```

### React Hydration Errors

**Problem**: "Text content did not match. Server: X Client: Y"

```
Hydration failed because the initial UI does not match what was rendered on the server
```

**Common Causes**:

- `toLocaleString()` format differences
- Date/time formatting
- Browser API access during SSR
- Random values or user-specific data

**Solutions**:

1. **Use ClientOnly wrapper**:

```tsx
import { ClientOnly } from "../components/ClientOnly";

<ClientOnly fallback="Loading...">
  {stats.totalUsers.toLocaleString()}+
</ClientOnly>;
```

2. **Safe number formatting**:

```tsx
import { SafeStats } from "../components/ClientOnly";

<SafeStats value={stats.totalRecipes} />;
```

3. **Move browser APIs to useEffect**:

```tsx
// ❌ Wrong
const [theme, setTheme] = useState(localStorage.getItem("theme"));

// ✅ Correct
const [theme, setTheme] = useState("light");
useEffect(() => {
  setTheme(localStorage.getItem("theme") || "light");
}, []);
```

**Files created for hydration fix**:

- `components/ClientOnly.tsx` - Safe wrapper component
- `utils/hydrationFix.ts` - Utility functions
- `HYDRATION_TROUBLESHOOTING.md` - Complete guide

### Next.js Cache Issues

**Problem**: EPERM errors or cache corruption

```
Error: EPERM: operation not permitted, open '.next/trace'
```

**Solutions**:

1. Delete `.next` folder: `Remove-Item -Recurse -Force .next`
2. Use different port: `npx next dev --port 3002`
3. Clear npm cache: `npm cache clean --force`

### Development Server

**Working Commands**:

```bash
# PowerShell
cd c:\SmartCookingAI_2\frontend-clean; npx next dev --port 3002

# Alternative
cd c:\SmartCookingAI_2\frontend-clean
npx next dev --port 3002
```

---

**📅 Cập nhật cuối**: August 5, 2025  
**👨‍💻 Tác giả**: GitHub Copilot  
**🎯 Mục đích**: Reference guide cho UI/UX Smart Cooking AI frontend

_File này phục vụ như một bản thiết kế tổng thể và hướng dẫn tái tạo cho toàn bộ hệ thống frontend Smart Cooking AI. Sử dụng nó như một tài liệu tham khảo chính khi cần phát triển, sửa đổi, hoặc tái tạo lại bất kỳ phần nào của ứng dụng._

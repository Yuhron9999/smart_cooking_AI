# 🎨 Smart Cooking AI - UI/UX Design Guidelines

## 📋 Tổng quan Thiết kế

Smart Cooking AI sử dụng **Design System hiện đại** với focus vào **trải nghiệm người dùng tuyệt vời** và **thẩm mỹ chuyên nghiệp**.

---

## 🎯 Design Principles

### 1. **Modern & Clean**

- Sử dụng **white space** hiệu quả
- Typography sạch sẽ, dễ đọc
- Layout minimalist nhưng đầy đủ thông tin

### 2. **Brand Identity**

- **Primary Colors**: Orange → Pink → Purple gradient
- **Secondary Colors**: Green (healthy), Blue (trust), Yellow (rating)
- **Neutral Colors**: Gray scale cho text và background

### 3. **User Experience First**

- **Mobile-first responsive design**
- **Accessibility compliance** (WCAG 2.1)
- **Fast loading** với optimized components
- **Intuitive navigation** và clear CTAs

### 4. **Visual Hierarchy**

- **Typography scale**: H1 (4xl-6xl) → H2 (3xl-4xl) → H3 (xl-2xl)
- **Color contrast**: Đảm bảo tỷ lệ 4.5:1 cho text
- **Spacing system**: 4px base với scale 1-2-3-4-6-8-12-16-20-24-32

---

## 🎨 Color Palette

### **Brand Colors**

```css
--brand-orange: #f97316; /* Orange-500 */
--brand-pink: #ec4899; /* Pink-500 */
--brand-purple: #8b5cf6; /* Purple-500 */
--brand-gradient: linear-gradient(
  135deg,
  var(--brand-orange) 0%,
  var(--brand-pink) 50%,
  var(--brand-purple) 100%
);
```

### **Semantic Colors**

```css
--success-green: #10b981; /* Emerald-500 */
--warning-yellow: #f59e0b; /* Amber-500 */
--error-red: #ef4444; /* Red-500 */
--info-blue: #3b82f6; /* Blue-500 */
```

### **Neutral Palette**

```css
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

---

## ✨ Component Patterns

### **Card Components**

```tsx
// Recipe Card Pattern
<div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
  <div className="relative overflow-hidden">
    <img className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
    <div className="absolute top-3 right-3">
      <Badge variant="difficulty" />
    </div>
  </div>
  <div className="p-6">
    <h3 className="text-xl font-semibold text-gray-900 mb-2" />
    <p className="text-gray-600 text-sm mb-4" />
    <div className="flex items-center justify-between">
      <MetaInfo />
      <Rating />
    </div>
  </div>
</div>
```

### **Button Hierarchy**

```tsx
// Primary CTA
<button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
  Primary Action
</button>

// Secondary Button
<button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
  Secondary Action
</button>

// Ghost Button
<button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
  Tertiary Action
</button>
```

### **Input Fields**

```tsx
<div className="relative">
  <input
    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
    placeholder="Search recipes..."
  />
  <SearchIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
</div>
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
.container {
  @apply px-4;                    /* Mobile: 16px padding */
  @apply sm:px-6;                 /* Small: 24px padding */
  @apply lg:px-8;                 /* Large: 32px padding */
  @apply max-w-7xl mx-auto;       /* Max width: 1280px */
}

/* Breakpoints */
sm: 640px   /* Tablet Portrait */
md: 768px   /* Tablet Landscape */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large Desktop */
2xl: 1536px /* Extra Large */
```

---

## 🎭 Animation Guidelines

### **Hover Effects**

```css
.hover-lift {
  @apply transform hover:scale-105 transition-all duration-200;
}

.hover-shadow {
  @apply hover:shadow-lg transition-shadow duration-300;
}

.hover-glow {
  @apply hover:shadow-2xl hover:shadow-orange-500/25 transition-all duration-300;
}
```

### **Loading States**

```tsx
// Skeleton Loader
<div className="animate-pulse">
  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

### **Micro-interactions**

```css
.button-press {
  @apply active:scale-95 transition-transform duration-75;
}

.fade-in {
  @apply opacity-0 animate-fade-in;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 🖼️ Visual Elements

### **Icons System**

- **Lucide React**: Primary icon library
- **Size Scale**: 16px (sm) → 20px (md) → 24px (lg) → 32px (xl)
- **Color Strategy**: Match text color hoặc brand colors cho accent

### **Images & Media**

```tsx
// Hero Images
<div className="aspect-video overflow-hidden rounded-xl">
  <img
    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
    src="/images/hero-cooking.jpg"
    alt="Smart Cooking AI"
  />
</div>

// Avatar Images
<div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-orange-500">
  <img className="w-full h-full object-cover" />
</div>
```

### **Badges & Status**

```tsx
// Status Badges
const badgeVariants = {
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
};
```

---

## 📐 Layout Patterns

### **Hero Section**

```tsx
<section className="relative bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-20 lg:py-32">
  <div className="absolute inset-0 bg-[url('/patterns/food-pattern.svg')] opacity-5"></div>
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center">{/* Hero Content */}</div>
  </div>
</section>
```

### **Feature Grids**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
  {/* Feature Cards */}
</div>
```

### **Content Sections**

```tsx
<section className="py-16 lg:py-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12 lg:mb-16">
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
        Section Title
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Section description
      </p>
    </div>
    {/* Section Content */}
  </div>
</section>
```

---

## 🎪 Food Industry Specific

### **Recipe Card Design**

- **Image Ratio**: 16:9 cho landscape, 4:3 cho card
- **Difficulty Badges**: Green (Easy), Yellow (Medium), Red (Hard)
- **Rating Display**: Yellow stars với số điểm
- **Time Format**: "30 phút" với clock icon
- **Servings**: "4 người" với users icon

### **Category Colors**

```css
.category-vietnamese {
  @apply bg-red-50 text-red-700 border-red-200;
}
.category-asian {
  @apply bg-orange-50 text-orange-700 border-orange-200;
}
.category-western {
  @apply bg-blue-50 text-blue-700 border-blue-200;
}
.category-dessert {
  @apply bg-pink-50 text-pink-700 border-pink-200;
}
.category-healthy {
  @apply bg-green-50 text-green-700 border-green-200;
}
```

### **AI Elements**

```tsx
// AI Chat Bubble
<div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-4 rounded-2xl rounded-bl-sm max-w-xs">
  <div className="flex items-start space-x-2">
    <Sparkles className="h-5 w-5 flex-shrink-0 mt-0.5" />
    <p className="text-sm">AI Assistant message...</p>
  </div>
</div>

// Voice Recording State
<div className="relative">
  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25"></div>
  <div className="relative bg-red-500 rounded-full p-4">
    <Mic className="h-6 w-6 text-white" />
  </div>
</div>
```

---

## 🚀 Performance Guidelines

### **Image Optimization**

- Sử dụng **Next.js Image** component
- **WebP format** với fallback
- **Lazy loading** mặc định
- **Responsive images** với srcSet

### **Animation Performance**

- Sử dụng **transform** và **opacity** thay vì layout properties
- **will-change** cho animations phức tạp
- **Reduced motion** support

### **Bundle Optimization**

- **Dynamic imports** cho heavy components
- **Code splitting** theo route
- **Tree shaking** libraries

---

## 🧪 Testing Checklist

### **Visual Testing**

- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Responsive design (Mobile, Tablet, Desktop)
- [ ] Dark mode support (if applicable)
- [ ] High DPI displays support

### **Accessibility Testing**

- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast ratios
- [ ] Focus management

### **Performance Testing**

- [ ] Lighthouse score > 90
- [ ] Core Web Vitals green
- [ ] Bundle size analysis
- [ ] Animation smoothness (60fps)

---

## 📚 Resources & Tools

### **Design Tools**

- **Figma**: UI design và prototyping
- **Tailwind CSS**: Utility-first CSS framework
- **Headless UI**: Accessible components
- **Lucide React**: Icon system

### **Development Tools**

- **Storybook**: Component documentation
- **Chromatic**: Visual testing
- **Bundle Analyzer**: Performance monitoring
- **ESLint**: Code quality

---

## 🎯 Business Logic Integration

### **User Journey Optimization**

1. **Landing**: Hero với clear value proposition
2. **Discovery**: Feature showcase và social proof
3. **Engagement**: Interactive demo hoặc trial
4. **Conversion**: Simple signup flow
5. **Retention**: Onboarding và progressive disclosure

### **KPI Tracking**

- **CTR**: Button click rates
- **Bounce Rate**: Page engagement
- **Conversion**: Signup completion
- **User Flow**: Navigation patterns

---

**💡 Lưu ý**: Tất cả components phải tuân theo guidelines này để đảm bảo tính nhất quán và chuyên nghiệp của toàn bộ ứng dụng Smart Cooking AI.

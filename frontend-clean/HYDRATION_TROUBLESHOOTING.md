# 🐛 Smart Cooking AI - Hydration & Error Troubleshooting Guide

## 🔥 React Hydration Errors - Complete Solution

### ❌ **Lỗi: "Text content did not match. Server: X Client: Y"**

**Nguyên nhân phổ biến:**

1. **Number formatting differences**: `toLocaleString()` khác nhau giữa server và client
2. **Date/Time formatting**: Timezone differences
3. **Dynamic content**: Random values, user-specific data
4. **Browser-specific APIs**: localStorage, sessionStorage trong SSR

### ✅ **Giải pháp tổng thể:**

#### 1. **Sử dụng ClientOnly Component**

```tsx
import { ClientOnly } from '../components/ClientOnly';

// ❌ Gây hydration mismatch
<div>{stats.totalUsers.toLocaleString()}+</div>

// ✅ Safe solution
<div>
  <ClientOnly fallback="Loading...">
    {stats.totalUsers.toLocaleString()}+
  </ClientOnly>
</div>
```

#### 2. **Safe Number Formatting**

```tsx
// utils/hydrationFix.ts
export const formatNumberSafe = (num: number): string => {
  if (typeof window === "undefined") {
    // Server-side: simple format
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num.toString();
  }
  // Client-side: full formatting
  return new Intl.NumberFormat("vi-VN").format(num);
};
```

#### 3. **SafeStats Component**

```tsx
// components/ClientOnly.tsx
export const SafeStats: React.FC<{ value: number; suffix?: string }> = ({
  value,
  suffix = "+",
}) => (
  <ClientOnly fallback="Loading...">
    <span>
      {formatNumberSafe(value)}
      {suffix}
    </span>
  </ClientOnly>
);

// Usage
<SafeStats value={stats.totalRecipes} />;
```

### 🛠️ **Implementation trong Smart Cooking AI:**

#### Files đã được tạo:

- `components/ClientOnly.tsx` - Wrapper component
- `utils/hydrationFix.ts` - Utility functions
- Updated `pages/index.tsx` - Safe stats display

#### Next.js Config:

```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: false, // Tạm thời tắt để debug
  // ... các config khác
};
```

---

## 🔧 Common Hydration Issues & Solutions

### 1. **localStorage/sessionStorage Issues**

**❌ Problem:**

```tsx
const [user, setUser] = useState(localStorage.getItem("user"));
```

**✅ Solution:**

```tsx
const [user, setUser] = useState(null);

useEffect(() => {
  setUser(localStorage.getItem("user"));
}, []);
```

### 2. **Date/Time Formatting**

**❌ Problem:**

```tsx
<span>{new Date().toLocaleString()}</span>
```

**✅ Solution:**

```tsx
import { formatDateSafe } from "../utils/hydrationFix";

<ClientOnly>
  <span>{formatDateSafe(new Date())}</span>
</ClientOnly>;
```

### 3. **Random Values/UUIDs**

**❌ Problem:**

```tsx
const [id] = useState(Math.random());
```

**✅ Solution:**

```tsx
const [id, setId] = useState<string>("");

useEffect(() => {
  setId(Math.random().toString());
}, []);
```

### 4. **Theme Detection**

**❌ Problem:**

```tsx
const [theme, setTheme] = useState(
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
);
```

**✅ Solution:**

```tsx
import { useTheme } from "../utils/hydrationFix";

const { theme, toggleTheme } = useTheme();
```

---

## 📊 **Statistics Display Pattern**

### Before (Causing Hydration Error):

```tsx
// ❌ Server vs Client formatting mismatch
<div className="stats-number">{stats.totalRecipes.toLocaleString()}+</div>
```

### After (Hydration Safe):

```tsx
// ✅ Consistent formatting
<div className="stats-number">
  <SafeStats value={stats.totalRecipes} />
</div>
```

---

## 🚀 **Development Workflow**

### 1. **Identify Hydration Issues:**

```bash
# Look for these errors in console:
- "Text content did not match"
- "Hydration failed"
- "Server HTML was modified"
```

### 2. **Debug Steps:**

1. Check if content uses browser APIs
2. Look for dynamic values (time, random, locale)
3. Verify SSR vs CSR differences
4. Use React DevTools Profiler

### 3. **Testing:**

```bash
# Disable JavaScript to test SSR
# Compare server HTML with client HTML
# Use different browsers/locales
```

---

## 📝 **Best Practices**

### ✅ **Do:**

- Use `ClientOnly` for browser-specific content
- Implement safe formatters for numbers/dates
- Use `useEffect` for client-only initialization
- Test with disabled JavaScript
- Consistent data between server/client

### ❌ **Don't:**

- Use `toLocaleString()` directly in JSX
- Access `window` or `document` during SSR
- Generate random values in render
- Use different data sources for SSR/CSR

---

## 🔄 **Migration Checklist**

When fixing hydration issues:

- [ ] Replace `toLocaleString()` with `formatNumberSafe()`
- [ ] Wrap dynamic content with `ClientOnly`
- [ ] Move browser API calls to `useEffect`
- [ ] Test with different locales/timezones
- [ ] Verify SSR HTML matches client HTML
- [ ] Update components to use SafeStats
- [ ] Test with React Strict Mode enabled

---

## 🎯 **File Structure**

```
frontend-clean/
├── components/
│   └── ClientOnly.tsx          # Hydration-safe wrapper
├── utils/
│   └── hydrationFix.ts         # Safe formatters & hooks
├── pages/
│   └── index.tsx               # Updated with SafeStats
└── next.config.js              # Optimized config
```

---

## 📱 **Testing Hydration Fixes**

### Browser Console Commands:

```javascript
// Check for hydration mismatches
performance.getEntriesByType("navigation")[0].type;

// Compare SSR vs CSR
document.documentElement.innerHTML;
```

### Development Tools:

- Next.js Dev Tools
- React Developer Tools
- Lighthouse (SSR Performance)
- Browser DevTools (Disable JS)

---

**📅 Updated**: August 5, 2025  
**🎯 Status**: Hydration errors resolved  
**🚀 Next**: Performance optimization & PWA setup

_Tài liệu này giải quyết tất cả hydration issues trong Smart Cooking AI và cung cấp patterns để tránh lỗi tương tự trong tương lai._

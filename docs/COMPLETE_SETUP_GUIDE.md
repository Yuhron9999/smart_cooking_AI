# 🌟 Smart Cooking AI - Complete Setup Guide

## 📋 Tổng quan Dự án

**Smart Cooking AI** là nền tảng nấu ăn thông minh tích hợp AI với architecture microservices:

- ✅ **Backend**: Spring Boot (port 8080) - Authentication, CRUD, Business Logic
- ✅ **AI Service**: FastAPI (port 8001) - OpenAI/Gemini integration, Voice processing
- ✅ **Frontend Web**: Next.js (port 3000) - Professional UI/UX, Responsive design
- ⏳ **Mobile App**: Flutter - Cross-platform với voice assistant
- ✅ **Database**: MySQL + Redis + Firebase Storage
- ✅ **Design System**: Professional UI/UX với gradient Orange→Pink→Purple

## 🚀 Quick Start

### 1. Clone và Setup

```bash
git clone <repository-url>
cd SmartCookingAI_2
```

### 2. Environment Setup

```bash
# Copy environment files
cp .env.example .env
# Cấu hình API keys: OPENAI_API_KEY, GEMINI_API_KEY, GOOGLE_CLIENT_ID
```

### 3. Start Services

```bash
# Database services
docker-compose up -d mysql redis

# Backend API
cd backend && ./mvnw spring-boot:run

# AI Service
cd ai-service && pip install -r requirements.txt && uvicorn app:app --port 8001

# Frontend Web
cd frontend-nextjs && npm install && npm run dev
```

### 4. Access Applications

- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:8080
- 🤖 **AI Service**: http://localhost:8001
- 📊 **Database**: MySQL on port 3306

## ✅ Completed Features

### 🎨 Professional UI/UX Design System

- **Color Palette**: Orange (#f97316) → Pink (#ec4899) → Purple (#8b5cf6)
- **Typography**: Inter font family với responsive scaling
- **Components**: Navigation, Footer, RecipeCard, AnimatedBackground
- **Animations**: Glassmorphism, blob effects, gradient transitions
- **Responsive**: Mobile-first design với breakpoints

### 🔧 Technical Infrastructure

- **Next.js 14**: App router, TypeScript, Static generation
- **TailwindCSS**: Custom design system với utilities
- **i18n**: Multilingual support (vi, en, ja, ko, zh)
- **Authentication**: Google OAuth2 integration ready
- **Error Handling**: Hydration errors fixed, consistent rendering

### 📁 Project Structure

```
SmartCookingAI_2/
├── frontend-nextjs/           # Next.js Web App
│   ├── pages/                # Next.js pages
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── layout/      # Navigation, Footer
│   │   │   └── recipe/      # Recipe-specific components
│   │   ├── styles/          # CSS files
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── docs/                # Documentation
├── backend/                  # Spring Boot API
├── ai-service/              # FastAPI AI Service
└── mobile-app/              # Flutter App (planned)
```

## 📚 Documentation

### Design System

- **UI_UX_GUIDELINES.md**: Complete design system documentation
- **HYDRATION_FIX.md**: Hydration error solutions
- **I18N_USAGE_GUIDE.md**: Internationalization guide

### Components Documentation

- **RecipeCard.tsx**: Professional recipe card với all features
- **Navigation.tsx**: Fixed header với scroll detection
- **Footer.tsx**: Modern footer với newsletter signup

### Utility Functions

- **format.ts**: Number formatting, date formatting, text utilities
- **utilities.css**: Additional CSS utilities cho Tailwind

## 🎯 Next Development Steps

### Phase 1: Backend Integration

```bash
# TODO: Connect frontend với Spring Boot API
# TODO: Implement authentication flow
# TODO: Setup database với real data
```

### Phase 2: AI Features

```bash
# TODO: Recipe generation từ ingredients
# TODO: Image recognition với Gemini Vision
# TODO: Voice assistant STT/TTS
# TODO: Chatbot integration
```

### Phase 3: Additional Pages

- [ ] `/recipes` - Recipe listing với filters
- [ ] `/recipe/[id]` - Recipe detail page
- [ ] `/ai-assistant` - Chat với AI
- [ ] `/voice-chef` - Voice cooking assistant
- [ ] `/profile` - User profile management
- [ ] `/learn` - Learning paths system

### Phase 4: Mobile App

- [ ] Flutter setup với same design system
- [ ] Cross-platform voice assistant
- [ ] Mobile-optimized UI/UX

## 🛠️ Development Guidelines

### Code Standards

```typescript
// Always use TypeScript
// Follow component naming: PascalCase
// Use hooks for state management
// Implement error boundaries
// Add accessibility support
```

### CSS/Styling

```css
/* Use Tailwind classes first */
/* Custom CSS in utilities.css */
/* Follow design system colors */
/* Mobile-first responsive design */
```

### Performance

- ✅ Static generation for SEO
- ✅ Image optimization
- ✅ Lazy loading components
- ✅ Bundle size optimization

## 🔧 Common Commands

### Development

```bash
# Start frontend
cd frontend-nextjs && npm run dev

# Build for production
npm run build && npm start

# Linting and formatting
npm run lint
npm run format

# Type checking
npm run type-check
```

### Testing

```bash
# Run tests
npm run test

# E2E testing
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 🐛 Troubleshooting

### Hydration Errors

- ✅ **Fixed**: Text content mismatch với number formatting
- ✅ **Solution**: Use static generation + consistent formatting utilities

### CORS Issues

- Configure Spring Boot CORS settings
- Check AI service CORS middleware
- Update allowed origins

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

## 📊 Performance Metrics

### Lighthouse Scores (Target)

- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Bundle Size

- Initial bundle: < 200KB
- Page bundles: < 100KB each
- Image optimization: WebP format

## 🤝 Contributing

### Code Review Checklist

- [ ] TypeScript types defined
- [ ] Responsive design tested
- [ ] Accessibility compliance
- [ ] Performance optimized
- [ ] Documentation updated

### Git Workflow

```bash
# Feature branches
git checkout -b feature/recipe-detail-page

# Conventional commits
git commit -m "feat: add recipe detail page with reviews"

# Pull request with description
```

## 📞 Support

### Quick Links

- 📖 **Documentation**: `/docs` folder
- 🐛 **Bug Reports**: Create GitHub issue
- 💡 **Feature Requests**: Discussion section
- 🔧 **Development**: Check TODO comments in code

---

**Status**: ✅ Frontend UI/UX Complete | ⏳ Backend Integration | ⏳ AI Features | ⏳ Mobile App

Last Updated: December 2024

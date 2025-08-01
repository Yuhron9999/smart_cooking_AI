# 🚀 Smart Cooking AI - GitHub Repository

## 📋 Repository Overview

This repository contains the complete **Smart Cooking AI** system with the following components:

### 🏗️ System Architecture

- **📱 Mobile App (Flutter)**: Cross-platform mobile application with Google OAuth authentication
- **🌐 Frontend Web (Next.js)**: Modern web interface with responsive design
- **⚡ Backend API (Spring Boot)**: RESTful API with comprehensive business logic
- **🤖 AI Service (FastAPI)**: AI integration with Gemini and OpenAI APIs
- **🗄️ Database**: MySQL with Redis caching and Firebase Storage

### ✨ Key Features Implemented

- ✅ **Google OAuth Authentication** - Working successfully
- ✅ **AI Recipe Generation** - Gemini/OpenAI integration
- ✅ **Voice Assistant** - STT/TTS capabilities
- ✅ **Food Image Recognition** - Gemini Vision API
- ✅ **Regional Food Suggestions** - Location-based recommendations
- ✅ **Multi-language Support** - Vietnamese, English, Japanese, Korean, Chinese
- ✅ **Comprehensive Error Handling** - User-friendly error management
- ✅ **Modern UI/UX** - Material Design and responsive layouts

### 🛠️ Technologies Used

#### Frontend & Mobile
- **Flutter** - Cross-platform mobile development
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Material Design** - Modern UI components

#### Backend & APIs
- **Spring Boot** - Java enterprise framework
- **FastAPI** - Python web framework for AI services
- **MySQL** - Primary database
- **Redis** - Caching layer
- **JWT** - Authentication tokens

#### AI & Machine Learning
- **Google Gemini AI** - Advanced AI capabilities
- **OpenAI GPT** - Natural language processing
- **Google Maps API** - Location services
- **Google Sign-In** - OAuth authentication

### 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Yuhron9999/smart_cooking_AI.git
   cd smart_cooking_AI
   ```

2. **Setup environment variables**:
   - Copy `.env.example` to `.env`
   - Add your API keys (Google, OpenAI, etc.)

3. **Run the services**:
   ```bash
   # Backend (Spring Boot)
   cd backend && ./mvnw spring-boot:run
   
   # AI Service (FastAPI)
   cd ai-service && python app_enhanced.py
   
   # Frontend Web (Next.js)
   cd frontend-nextjs && npm run dev
   
   # Mobile App (Flutter)
   cd mobile-app && flutter run -d chrome --web-port=3002
   ```

### 📚 Documentation

- **[Complete Setup Guide](./COMPLETE_SETUP_GUIDE.md)** - Full installation instructions
- **[Google OAuth Setup](./mobile-app/GOOGLE_OAUTH_SETUP.md)** - Authentication configuration
- **[AI Integration Guide](./AI_INTEGRATION_GUIDE.md)** - AI services setup
- **[API Documentation](./backend/README.md)** - Backend API reference

### 🎯 Current Status

- ✅ **Authentication System**: Google OAuth working perfectly
- ✅ **Mobile App**: Flutter web app with full functionality
- ✅ **Backend APIs**: Spring Boot services operational
- ✅ **AI Integration**: Gemini and OpenAI services connected
- ✅ **Error Handling**: Comprehensive error management system
- 🚧 **Deployment**: Production deployment in progress

### 🏆 Demo & Testing

The application is fully functional with:
- **Live Google OAuth** authentication
- **Working AI features** for recipe generation
- **Responsive UI** across devices
- **Comprehensive error handling** with user-friendly messages

### 👥 Contributing

This is a comprehensive full-stack application showcasing modern development practices with AI integration. Perfect for learning and demonstration purposes.

### 📞 Contact

For questions or collaboration, please create an issue in this repository.

---

**🎉 Smart Cooking AI - Where Technology Meets Culinary Creativity!**

*Last updated: August 1, 2025*

# 🌟 Smart Cooking AI - Hệ thống Nấu ăn Thông minh

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/Yuhron9999/smart_cooking_AI)](https://github.com/Yuhron9999/smart_cooking_AI/issues)
[![GitHub forks](https://img.shields.io/github/forks/Yuhron9999/smart_cooking_AI)](https://github.com/Yuhron9999/smart_cooking_AI/network)
[![GitHub stars](https://img.shields.io/github/stars/Yuhron9999/smart_cooking_AI)](https://github.com/Yuhron9999/smart_cooking_AI/stargazers)

## 📋 Tổng quan

**Smart Cooking AI** là một nền tảng nấu ăn thông minh tích hợp AI toàn diện, bao gồm:

- 🤖 **AI Recipe Generation** - Tạo công thức từ nguyên liệu có sẵn
- 🗣️ **Voice Assistant** - Trợ lý giọng nói thông minh 
- 📸 **Food Recognition** - Nhận dạng món ăn qua hình ảnh
- 🌍 **Multi-language Support** - Hỗ trợ đa ngôn ngữ (VI/EN/JA/KO/ZH)
- 📍 **Location-based Features** - Gợi ý món ăn theo vùng miền
- 📱 **Cross-platform** - Web, Mobile và Desktop

## 🏗️ Kiến trúc Hệ thống

```
Smart Cooking AI/
├── 🔧 backend/              # Spring Boot API (Port 8080)
├── 🤖 ai-service/           # FastAPI AI Service (Port 8001)  
├── 🌐 frontend-nextjs/      # Next.js Web App (Port 3000)
├── 📱 mobile-app/           # Flutter Mobile App
├── 📚 docs/                 # Documentation
├── 🛠️ scripts/             # Build & deployment scripts
└── 🐳 docker-compose.yml   # Container orchestration
```

## ✨ Tính năng chính

### 🎯 Core Features
- **Tạo công thức AI**: Gemini/OpenAI tích hợp
- **Voice Assistant**: STT/TTS processing
- **Image Recognition**: Phân tích món ăn qua ảnh
- **Multi-platform**: Web + Mobile + Desktop
- **Real-time Chat**: AI-powered cooking assistant

### 🌍 Localization & Regional
- **i18n Support**: Hoàn toàn đa ngôn ngữ
- **Regional Cuisine**: Gợi ý theo vùng miền Việt Nam
- **Location Services**: Tìm cửa hàng nguyên liệu gần nhất
- **Cultural Adaptation**: Phù hợp với từng địa phương

### 🔐 Security & Performance
- **Google OAuth2**: Xác thực an toàn
- **Role-based Access**: USER/CHEF/ADMIN
- **Redis Caching**: Tối ưu hiệu suất
- **Docker Support**: Easy deployment

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ & npm
- **Java** 17+ & Maven  
- **Python** 3.9+ & pip
- **Flutter** 3.0+ & Dart
- **Docker** & Docker Compose
- **MySQL** 8.0+
- **Redis** 6.0+

### 1. Clone & Setup
```bash
git clone https://github.com/Yuhron9999/smart_cooking_AI.git
cd smart_cooking_AI
```

### 2. Environment Configuration
```bash
# Copy environment templates
cp backend/.env.example backend/.env
cp ai-service/.env.example ai-service/.env
cp frontend-nextjs/.env.example frontend-nextjs/.env.local
cp mobile-app/.env.example mobile-app/.env

# Configure your API keys
# OPENAI_API_KEY=your_openai_key
# GEMINI_API_KEY=your_gemini_key  
# GOOGLE_API_KEY=your_google_key
```

### 3. Docker Quick Start (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Manual Setup
```bash
# Backend (Spring Boot)
cd backend
./mvnw spring-boot:run

# AI Service (FastAPI)  
cd ai-service
pip install -r requirements.txt
uvicorn app:app --reload --port 8001

# Frontend (Next.js)
cd frontend-nextjs
npm install && npm run dev

# Mobile (Flutter)
cd mobile-app
flutter pub get && flutter run
```

## 📚 Documentation

| Documentation | Description |
|---------------|-------------|
| [📖 Setup Guide](docs/COMPLETE_SETUP_GUIDE.md) | Hướng dẫn cài đặt chi tiết |
| [🔧 API Documentation](docs/API_INTEGRATION_GUIDE.md) | API endpoints & usage |
| [🤖 AI Integration](docs/AI_INTEGRATION_GUIDE.md) | AI services setup |
| [📱 Mobile Guide](docs/MOBILE_APP_DOCUMENTATION.md) | Flutter app development |
| [🌍 i18n Guide](docs/setup/) | Internationalization setup |
| [🐳 Docker Guide](docs/DOCKER_DEPLOYMENT.md) | Container deployment |

## 🛠️ Development

### Tech Stack
- **Backend**: Spring Boot, MySQL, Redis, JWT
- **AI Service**: FastAPI, OpenAI, Gemini, STT/TTS
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Mobile**: Flutter, Dart, Provider state management
- **DevOps**: Docker, GitHub Actions, Nginx

### Project Structure
```
├── backend/                 # Spring Boot REST API
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── target/             # Compiled classes
├── ai-service/             # FastAPI AI service
│   ├── app.py             # Main FastAPI application
│   ├── services/          # AI service modules
│   └── requirements.txt   # Python dependencies
├── frontend-nextjs/        # Next.js web application
│   ├── src/pages/         # Next.js pages
│   ├── src/components/    # React components
│   └── public/locales/    # i18n translation files
└── mobile-app/            # Flutter mobile app
    ├── lib/               # Dart source code
    ├── assets/            # App assets & translations
    └── android/ios/       # Platform-specific code
```

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [https://smartcooking.ai](https://smartcooking.ai) _(Coming Soon)_
- **Documentation**: [Wiki](https://github.com/Yuhron9999/smart_cooking_AI/wiki)
- **Issues**: [GitHub Issues](https://github.com/Yuhron9999/smart_cooking_AI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Yuhron9999/smart_cooking_AI/discussions)

## 👥 Team

- **Lead Developer**: [@Yuhron9999](https://github.com/Yuhron9999)
- **Contributors**: See [CONTRIBUTORS.md](CONTRIBUTORS.md)

## 📊 Project Status

- ✅ **Backend API**: Core functionality completed
- ✅ **AI Integration**: OpenAI & Gemini integrated  
- ✅ **Web Frontend**: Responsive UI with i18n
- 🔄 **Mobile App**: In development
- 🔄 **Voice Features**: Beta testing
- 📋 **Documentation**: Ongoing improvements

---

<p align="center">
  <strong>Made with ❤️ by the Smart Cooking AI Team</strong>
</p>

<p align="center">
  <a href="https://github.com/Yuhron9999/smart_cooking_AI">⭐ Star this project if you find it helpful!</a>
</p>
- Redis
- Python 3.8+ (cho ML models)

### Cài đặt

1. Clone repository:

```bash
git clone https://github.com/yourusername/SmartCookingAI_2.git
cd SmartCookingAI_2
```

2. Cài đặt dependencies cho backend:

```bash
cd backend
npm install
```

3. Cài đặt dependencies cho frontend:

```bash
cd ../frontend
npm install
```

4. Cài đặt dependencies cho AI service:

```bash
cd ../ai-service
pip install -r requirements.txt
```

5. Cấu hình environment variables:

```bash
cp .env.example .env
# Chỉnh sửa file .env với thông tin cấu hình
```

6. Khởi chạy services:

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start

# Terminal 3 - AI Service
cd ai-service && python app.py
```

## API Documentation

### Authentication

- POST /api/auth/register - Đăng ký tài khoản
- POST /api/auth/login - Đăng nhập
- POST /api/auth/logout - Đăng xuất

### Food Recognition

- POST /api/food/recognize - Nhận diện thực phẩm từ ảnh
- GET /api/food/ingredients - Lấy danh sách nguyên liệu

### Recipes

- GET /api/recipes - Lấy danh sách công thức
- GET /api/recipes/:id - Lấy chi tiết công thức
- POST /api/recipes/suggest - Gợi ý công thức từ nguyên liệu

### Chat

- POST /api/chat/message - Gửi tin nhắn đến AI bot

## Tính năng chính

1. **Nhận diện thực phẩm**: Chụp ảnh và AI sẽ nhận diện các loại thực phẩm
2. **Gợi ý công thức**: Dựa trên nguyên liệu có sẵn, AI gợi ý công thức phù hợp
3. **Hướng dẫn nấu ăn**: Từng bước chi tiết với hình ảnh minh họa
4. **Chat bot**: Tương tác với AI để hỏi đáp về nấu ăn
5. **Quản lý thực đơn**: Lập kế hoạch bữa ăn hàng tuần
6. **Cộng đồng**: Chia sẻ công thức và đánh giá

## Công nghệ sử dụng

- **Frontend**: React.js, Material-UI, Axios
- **Backend**: Node.js, Express.js, JWT, Bcrypt
- **Database**: MongoDB, Mongoose, Redis
- **AI/ML**: TensorFlow.js, OpenAI API, Computer Vision
- **DevOps**: Docker, GitHub Actions, AWS

## Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Liên hệ

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/SmartCookingAI_2](https://github.com/yourusername/SmartCookingAI_2)
=======
# smart_cooking_AI
>>>>>>> 2cb362a114f67e50dce8bb604963523625ccae61

# 🏗️ Smart Cooking AI - Project Structure

## 📁 Directory Structure

```
SmartCookingAI_2/
├── 📚 docs/                          # 📖 Documentation
│   ├── setup/                        # Setup & installation guides
│   ├── api/                          # API documentation
│   ├── COMPLETE_SETUP_GUIDE.md      # Complete setup instructions
│   ├── AI_INTEGRATION_GUIDE.md      # AI services integration
│   ├── MOBILE_APP_DOCUMENTATION.md  # Flutter app documentation
│   └── SAMPLE_ISSUES.md             # Sample GitHub issues
│
├── 🛠️ scripts/                       # 🔧 Build & utility scripts
│   ├── *.bat                        # Windows batch scripts
│   ├── *.sh                         # Linux/Mac shell scripts
│   └── *.py                         # Python utility scripts
│
├── 🔧 backend/                       # 🚀 Spring Boot API (Port 8080)
│   ├── src/main/java/               # Java source code
│   │   └── com/smartcooking/ai/     # Main application package
│   │       ├── controller/          # REST controllers
│   │       ├── service/             # Business logic services
│   │       ├── repository/          # Data access layer
│   │       ├── entity/              # JPA entities
│   │       ├── config/              # Configuration classes
│   │       └── dto/                 # Data transfer objects
│   ├── src/main/resources/          # Configuration files
│   │   ├── application.properties   # Main configuration
│   │   └── i18n/                   # Internationalization files
│   ├── target/                      # Compiled classes
│   ├── pom.xml                      # Maven dependencies
│   └── Dockerfile                   # Docker container config
│
├── 🤖 ai-service/                    # 🧠 FastAPI AI Service (Port 8001)
│   ├── app.py                       # Main FastAPI application
│   ├── services/                    # AI service modules
│   ├── requirements.txt             # Python dependencies
│   ├── Dockerfile                   # Docker container config
│   └── .env.example                 # Environment variables template
│
├── 🌐 frontend-nextjs/               # 💻 Next.js Web App (Port 3000)
│   ├── src/
│   │   ├── pages/                   # Next.js pages (routing)
│   │   ├── components/              # React components
│   │   │   ├── layout/              # Layout components
│   │   │   ├── ui/                  # UI components
│   │   │   └── recipe/              # Recipe-specific components
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── services/                # API service calls
│   │   ├── styles/                  # CSS/SCSS styles
│   │   └── types/                   # TypeScript type definitions
│   ├── public/
│   │   └── locales/                 # i18n translation files
│   │       ├── vi/                  # Vietnamese translations
│   │       ├── en/                  # English translations
│   │       ├── ja/                  # Japanese translations
│   │       ├── ko/                  # Korean translations
│   │       └── zh/                  # Chinese translations
│   ├── package.json                 # Node.js dependencies
│   ├── next.config.js              # Next.js configuration
│   ├── tailwind.config.js          # Tailwind CSS config
│   └── tsconfig.json               # TypeScript configuration
│
├── 📱 mobile-app/                    # 📲 Flutter Mobile App
│   ├── lib/
│   │   ├── main.dart               # App entry point
│   │   ├── core/                   # Core functionality
│   │   │   ├── config/             # App configuration
│   │   │   ├── constants/          # App constants
│   │   │   ├── error/              # Error handling
│   │   │   ├── router/             # App routing
│   │   │   └── theme/              # App theming
│   │   ├── features/               # Feature modules
│   │   │   ├── auth/               # Authentication
│   │   │   ├── home/               # Home screen
│   │   │   ├── splash/             # Splash screen
│   │   │   └── location/           # Location services
│   │   ├── providers/              # State management (Provider)
│   │   ├── services/               # API & external services
│   │   └── utils/                  # Utility functions
│   ├── assets/
│   │   ├── translations/           # i18n JSON files
│   │   ├── icons/                  # App icons
│   │   └── fonts/                  # Custom fonts
│   ├── android/                    # Android-specific code
│   ├── ios/                        # iOS-specific code
│   ├── web/                        # Flutter web support
│   ├── pubspec.yaml               # Flutter dependencies
│   └── .env.example               # Environment variables
│
├── 🐳 Infrastructure & Config
│   ├── docker-compose.yml          # Multi-container setup
│   ├── .gitignore                  # Git ignore rules
│   ├── .env.example                # Environment template
│   └── SmartCookingAI_2.code-workspace # VS Code workspace
│
├── 📋 GitHub Configuration
│   └── .github/
│       ├── workflows/              # GitHub Actions CI/CD
│       │   ├── ci.yml              # Continuous Integration
│       │   └── ci-cd.yml           # CI/CD pipeline
│       ├── ISSUE_TEMPLATE/         # Issue templates
│       │   ├── bug_report.md       # Bug report template
│       │   ├── feature_request.md  # Feature request template
│       │   └── documentation.md    # Documentation template
│       ├── PULL_REQUEST_TEMPLATE.md # PR template
│       └── copilot-instructions.md # AI coding instructions
│
└── 📄 Root Files
    ├── README.md                   # Main project documentation
    ├── CONTRIBUTING.md             # Contribution guidelines
    ├── CHANGELOG.md                # Version change log
    ├── SECURITY.md                 # Security policies
    ├── LICENSE                     # Project license
    └── package.json                # Root package.json for scripts
```

## 🎯 Component Responsibilities

### 🔧 Backend (Spring Boot)

- **Purpose**: Core business logic & data management
- **Port**: 8080
- **Database**: MySQL + Redis
- **Features**:
  - User authentication & authorization
  - Recipe CRUD operations
  - Internationalization (i18n)
  - Google Maps integration
  - Learning path management

### 🤖 AI Service (FastAPI)

- **Purpose**: AI/ML processing & integration
- **Port**: 8001
- **Features**:
  - OpenAI GPT integration
  - Google Gemini integration
  - Voice processing (STT/TTS)
  - Image recognition
  - Natural language processing

### 🌐 Frontend Web (Next.js)

- **Purpose**: Web user interface
- **Port**: 3000
- **Features**:
  - Responsive design
  - Multi-language support
  - Real-time chat
  - Recipe management
  - Voice assistant UI

### 📱 Mobile App (Flutter)

- **Purpose**: Cross-platform mobile experience
- **Platforms**: Android, iOS, Web
- **Features**:
  - Native mobile UI/UX
  - Offline functionality
  - Camera integration
  - Voice recording
  - Push notifications

## 🔄 Data Flow

```
User Request → Frontend/Mobile → Backend API → AI Service
                     ↓              ↓           ↓
                Database ← Cache ← External APIs
                     ↓              ↑           ↑
                User Response ← Backend ← AI Response
```

## 🚀 Deployment Architecture

```
Production Environment:
├── Load Balancer (Nginx)
├── Backend Cluster (Spring Boot)
├── AI Services (FastAPI)
├── Database Cluster (MySQL)
├── Cache Cluster (Redis)
├── Static Assets (CDN)
└── Mobile App Stores
```

## 📊 Development Workflow

1. **Local Development**: Individual services run on localhost
2. **Docker Development**: Full stack in containers
3. **Staging**: Deployed to staging environment
4. **Production**: Deployed to production with load balancing

## 🔧 Configuration Management

- **Environment Variables**: `.env` files for each service
- **Docker Compose**: Service orchestration
- **GitHub Actions**: CI/CD automation
- **Secrets Management**: GitHub Secrets for sensitive data

## 📈 Scalability Considerations

- **Microservices Architecture**: Independent scaling
- **Database Sharding**: Horizontal scaling
- **CDN Integration**: Global content delivery
- **Container Orchestration**: Kubernetes ready
- **API Rate Limiting**: Prevent abuse
- **Caching Strategy**: Multi-layer caching

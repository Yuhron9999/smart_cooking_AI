# 🌟 SMART COOKING AI - HỆ THỐNG HỌC & TẠO CÔNG THỨC NẤU ĂN TÍCH HỢP AI + VOICE ASSISTANT

## 📋 Tổng quan Dự án

Đây là một **hệ thống fullstack hoàn chỉnh** cho việc học và tạo công thức nấu ăn thông minh với tích hợp AI, bao gồm:

### 🏗️ Kiến trúc Hệ thống

  * **Backend API**: **Spring Boot** (cổng 8080) - Core business logic, authentication, data management
  * **AI Service**: **FastAPI** (cổng 8001) - Gemini integration, Voice processing (STT/TTS)
  * **Web Frontend**: **Next.js** (cổng 3000) - Responsive web app với đa ngôn ngữ
  * **Mobile App**: **Flutter** - Cross-platform mobile với voice assistant
  * **Database**: **MySQL** + **Redis** (cache) + **Firebase Storage** (media)
  * **Analytics**: **Looker Studio** integration cho data insights
  * **Authentication**: **Google OAuth2** across all platforms đã thêm hướng dẫn sử dụng tiếng Việt vào tài liệu này.

-----

# Nền tảng Nấu ăn Thông minh AI - Hướng dẫn cho Copilot

## Tổng quan Kiến trúc

Đây là một **nền tảng nấu ăn theo kiến trúc microservices** với sự tích hợp AI mạnh mẽ:

  * **Backend**: **Spring Boot** (cổng 8080) - Xử lý xác thực, quản lý công thức, và quản lý người dùng.
  * **AI Service**: **FastAPI** (cổng 8001) - Chuyên xử lý tích hợp OpenAI/Gemini và các tác vụ xử lý giọng nói.
  * **Frontend**: **Next.js** (cổng 3000/3001) - Giao diện web cho người dùng với các tính năng giọng nói và trò chuyện.
  * **Mobile**: **Flutter** - Ứng dụng di động đa nền tảng.
  * **Cơ sở dữ liệu**: **MySQL** + **Redis** (cho caching/session) + **MinIO** (lưu trữ đối tượng) + **Elasticsearch** (tìm kiếm).

## 💡 Chức năng Hệ thống

### 🎯 Core Features
1. **📄 Tạo công thức từ nguyên liệu** - AI sinh công thức tùy chỉnh
2. **📸 Nhận dạng món ăn qua ảnh** - Gemini Vision API
3. **🗣️ Chatbot AI** - Gemini integration cho tư vấn nấu ăn
4. **🎤 Voice Assistant** - STT + TTS cho tương tác bằng giọng nói
5. **📝 Lộ trình học nấu ăn** - AI tạo curriculum cá nhân hóa
6. **🔄 Lịch sử tương tác AI** - Tracking và analytics
7. **🔐 Quản lý người dùng** - Multi-role system (USER/ADMIN/CHEF)
8. **🖼️ Quản lý media** - Upload, lưu trữ và nhận dạng ảnh
9. **🗂️ Quản lý công thức mẫu** - CRUD operations cho admin/chef
10. **🌐 Đa ngôn ngữ** - i18n support (EN/VI/...)
11. **📍 Gợi ý theo vùng miền** - Món ăn đặc trưng theo vị trí địa lý
12. **🛒 Tìm cửa hàng nguyên liệu** - Định vị siêu thị, chợ gần nhất
13. **🗺️ Profile ẩm thực vùng miền** - Cá nhân hóa theo địa phương
14. **📌 Chia sẻ món ăn có vị trí** - Gắn tag địa điểm cho công thức

### 👥 Phân quyền Người dùng
- **USER**: Tạo công thức, chat AI, học lộ trình, lưu favorites
- **CHEF**: Tạo nội dung học, quản lý học viên, phân tích tiến độ nấu ăn
- **ADMIN**: Full system access, user management, analytics

-----

## 🔌 API Endpoints

### Authentication & User Management
```
POST   /api/auth/google-login     # Google OAuth2 login
GET    /api/auth/me               # Get current user info
PUT    /api/user/{id}/profile     # Update user profile
PUT    /api/user/{id}/language    # Change language preference
DELETE /api/auth/logout           # Logout user
```

### Recipe & AI Features
```
POST   /api/ai/generate-recipe    # Generate recipe from ingredients
POST   /api/ai/vision             # Analyze food image
POST   /api/ai/chat               # Chat with AI assistant
POST   /api/ai/voice              # Voice processing (STT/TTS)
GET    /api/recipes               # Get recipes with filters
POST   /api/recipes               # Create new recipe
PUT    /api/recipes/{id}          # Update recipe
DELETE /api/recipes/{id}          # Delete recipe
```

### Learning & Analytics
```
POST   /api/learning/path         # Create learning path
GET    /api/learning/progress     # Get user progress
GET    /api/analytics/history     # Get interaction history
GET    /api/analytics/stats       # Get usage statistics
POST   /api/feedback              # Submit user feedback
```

### Location & Regional Features
```
PUT    /api/user/location         # Update user location
GET    /api/suggestions/regional  # Get regional food suggestions
GET    /api/stores/nearby         # Find nearby ingredient stores
POST   /api/recipes/location      # Create recipe with location tag
GET    /api/recipes/region/{region} # Get recipes by region
GET    /api/regions/profile       # Get user's regional profile
PUT    /api/regions/preference    # Update regional preference
```

## 💾 Database Schema

### Core Tables
```sql
-- Users with Google OAuth2 support
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    role ENUM('USER', 'ADMIN', 'CHEF') DEFAULT 'USER',
    provider ENUM('GOOGLE', 'LOCAL') DEFAULT 'LOCAL',
    provider_id VARCHAR(255),
    language_preference VARCHAR(10) DEFAULT 'en',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    region_preference VARCHAR(50),
    city VARCHAR(100),
    country VARCHAR(50) DEFAULT 'Vietnam',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Recipes with multilingual support
CREATE TABLE recipes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_vi VARCHAR(255),
    description_en TEXT,
    description_vi TEXT,
    image_url VARCHAR(500),
    cooking_time INT NOT NULL,
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') DEFAULT 'MEDIUM',
    servings INT DEFAULT 4,
    calories INT,
    created_by BIGINT,
    category_id BIGINT,
    origin_region VARCHAR(100),
    location_tag VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- AI Interactions for analytics
CREATE TABLE ai_interactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    interaction_type ENUM('CHAT', 'RECIPE_GENERATION', 'IMAGE_RECOGNITION', 'VOICE') NOT NULL,
    input_data JSON,
    output_data JSON,
    language VARCHAR(10) DEFAULT 'en',
    processing_time_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Learning Paths for educational content
CREATE TABLE learning_paths (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_vi VARCHAR(255),
    description_en TEXT,
    description_vi TEXT,
    difficulty_level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') DEFAULT 'BEGINNER',
    estimated_hours INT DEFAULT 10,
    created_by BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

-----

## 🛠️ Các Mẫu Phát triển Chính

  * **Backend** sẽ đóng vai trò **proxy** các yêu cầu liên quan đến AI tới service FastAPI tại địa chỉ `${AI_SERVICE_URL}`.
  * Tất cả các endpoint AI trong Spring Boot sẽ được tiền tố bằng `/api/ai/` và được chuyển tiếp tới FastAPI.
  * Các cuộc gọi giữa các service trong Docker sẽ sử dụng **tên mạng Docker** (ví dụ: `backend:8080`, `ai-service:8001`) thay vì `localhost`.

### Luồng Xác thực

  * Sử dụng **Google OAuth2** kết hợp với **JWT tokens**.
  * **Frontend** dùng **NextAuth.js** để xử lý đăng nhập.
  * **Backend** sẽ xác thực các JWT token bằng bộ lọc JWT tùy chỉnh.
  * Tất cả các yêu cầu đến AI Service đều yêu cầu header `Authorization: Bearer <token>`.

### 🌐 Đa ngôn ngữ (i18n) - Hỗ trợ Quốc tế hóa Toàn diện

**Smart Cooking AI** hỗ trợ đầy đủ **internationalization (i18n)** với kiến trúc đa ngôn ngữ mạnh mẽ:

#### 🎯 **Ngôn ngữ Hỗ trợ**
- **🇻🇳 Tiếng Việt (vi)**: Ngôn ngữ chính, UI mặc định
- **🇺🇸 English (en)**: Hỗ trợ quốc tế, SEO metadata
- **🇯🇵 日本語 (ja)**: Sẵn sàng mở rộng cho thị trường Nhật
- **🇰🇷 한국어 (ko)**: Sẵn sàng mở rộng cho thị trường Hàn Quốc
- **🇨🇳 中文 (zh)**: Sẵn sàng mở rộng cho thị trường Trung Quốc

#### 🏗️ **Kiến trúc i18n Cross-platform**

##### **Frontend Web (Next.js)**
```javascript
// next-i18next configuration
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function RecipePage() {
  const { t, i18n } = useTranslation('common');
  
  const changeLanguage = async (lang) => {
    await i18n.changeLanguage(lang);
    // Update user preference in backend
    await updateUserLanguage(lang);
    // Reload page with new locale
    router.push(router.asPath, router.asPath, { locale: lang });
  };

  return (
    <div>
      <h1>{t('recipe.title')}</h1>
      <p>{t('recipe.description')}</p>
      
      {/* Language Switcher */}
      <div className="language-switcher">
        <button onClick={() => changeLanguage('vi')}>🇻🇳 Tiếng Việt</button>
        <button onClick={() => changeLanguage('en')}>🇺🇸 English</button>
        <button onClick={() => changeLanguage('ja')}>🇯🇵 日本語</button>
      </div>
    </div>
  );
}

// Server-side translations
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'recipe', 'ai'])),
    },
  };
}
```

##### **Mobile (Flutter)**
```dart
// easy_localization setup với Smart Cooking AI
import 'package:easy_localization/easy_localization.dart';

class SmartCookingAIApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart Cooking AI',
      localizationsDelegates: context.localizationDelegates,
      supportedLocales: context.supportedLocales,
      locale: context.locale,
      theme: ThemeData(
        primarySwatch: Colors.green,
        fontFamily: 'NotoSans', // Support for Asian characters
      ),
      home: HomePage(),
    );
  }
}

// Usage in widgets với context
class RecipeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('recipe.title'.tr()),
        actions: [
          // Language picker
          PopupMenuButton<String>(
            onSelected: (String languageCode) {
              context.setLocale(Locale(languageCode));
            },
            itemBuilder: (BuildContext context) => [
              PopupMenuItem(value: 'vi', child: Text('🇻🇳 Tiếng Việt')),
              PopupMenuItem(value: 'en', child: Text('🇺🇸 English')),
              PopupMenuItem(value: 'ja', child: Text('🇯🇵 日本語')),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          Text('welcome'.tr()),
          Text('ai.recipe_generation'.tr()),
          ElevatedButton(
            onPressed: () => context.setLocale(Locale('vi')),
            child: Text('language.vietnamese'.tr()),
          ),
        ],
      ),
    );
  }
}
```

#### 🗂️ **Cấu trúc Translation Files**

##### **Frontend Web Structure**
```
frontend-web/public/locales/
├── vi/
│   ├── common.json          # UI chung, navigation, buttons
│   ├── recipe.json          # Công thức nấu ăn
│   ├── ai.json             # AI features, chatbot
│   ├── voice.json          # Voice assistant
│   └── auth.json           # Authentication
├── en/
│   ├── common.json
│   ├── recipe.json
│   ├── ai.json
│   ├── voice.json
│   └── auth.json
└── ja/
    ├── common.json
    ├── recipe.json
    ├── ai.json
    ├── voice.json
    └── auth.json
```

##### **Mobile Structure**
```
mobile-app/assets/translations/
├── vi.json                 # Vietnamese translations
├── en.json                 # English translations
├── ja.json                 # Japanese translations
└── ko.json                 # Korean translations (ready)
```

#### 📝 **Sample Translation Files**

##### **vi.json (Tiếng Việt)**
```json
{
  "app": {
    "name": "Smart Cooking AI",
    "tagline": "Hệ thống nấu ăn thông minh"
  },
  "navigation": {
    "home": "Trang chủ",
    "recipes": "Công thức",
    "ai_assistant": "Trợ lý AI",
    "voice": "Giọng nói",
    "profile": "Hồ sơ"
  },
  "recipe": {
    "title": "Công thức nấu ăn",
    "create": "Tạo công thức mới",
    "ingredients": "Nguyên liệu",
    "instructions": "Hướng dẫn",
    "cooking_time": "Thời gian nấu",
    "difficulty": "Độ khó",
    "servings": "Khẩu phần"
  },
  "ai": {
    "recipe_generation": "Tạo công thức từ AI",
    "image_recognition": "Nhận dạng món ăn",
    "chatbot": "Trò chuyện với AI",
    "voice_assistant": "Trợ lý giọng nói"
  },
  "voice": {
    "start_recording": "Bắt đầu ghi âm",
    "stop_recording": "Dừng ghi âm",
    "listening": "Đang nghe...",
    "processing": "Đang xử lý...",
    "speak_command": "Nói lệnh của bạn"
  },
  "auth": {
    "login": "Đăng nhập",
    "logout": "Đăng xuất",
    "register": "Đăng ký",
    "google_login": "Đăng nhập với Google"
  }
}
```

##### **en.json (English)**
```json
{
  "app": {
    "name": "Smart Cooking AI",
    "tagline": "Intelligent Cooking System"
  },
  "navigation": {
    "home": "Home",
    "recipes": "Recipes",
    "ai_assistant": "AI Assistant",
    "voice": "Voice",
    "profile": "Profile"
  },
  "recipe": {
    "title": "Cooking Recipes",
    "create": "Create New Recipe",
    "ingredients": "Ingredients",
    "instructions": "Instructions",
    "cooking_time": "Cooking Time",
    "difficulty": "Difficulty",
    "servings": "Servings"
  },
  "ai": {
    "recipe_generation": "AI Recipe Generation",
    "image_recognition": "Food Recognition",
    "chatbot": "Chat with AI",
    "voice_assistant": "Voice Assistant"
  },
  "voice": {
    "start_recording": "Start Recording",
    "stop_recording": "Stop Recording",
    "listening": "Listening...",
    "processing": "Processing...",
    "speak_command": "Speak your command"
  },
  "auth": {
    "login": "Login",
    "logout": "Logout",
    "register": "Register",
    "google_login": "Login with Google"
  }
}
```

#### 🎨 **RTL Support & Typography**

##### **CSS cho Multi-language**
```css
/* Smart Cooking AI - Multi-language CSS */
[dir="rtl"] {
  text-align: right;
  direction: rtl;
}

[dir="ltr"] {
  text-align: left;
  direction: ltr;
}

/* Font families for different languages */
.font-vietnamese {
  font-family: 'Inter', 'Noto Sans Vietnamese', sans-serif;
}

.font-english {
  font-family: 'Inter', 'Roboto', sans-serif;
}

.font-japanese {
  font-family: 'Noto Sans JP', 'Hiragino Sans', sans-serif;
}

.font-korean {
  font-family: 'Noto Sans KR', 'Malgun Gothic', sans-serif;
}

.font-chinese {
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
}
```

#### 🔄 **Dynamic Language Switching**

##### **Language Context Provider**
```typescript
// contexts/LanguageContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  supportedLanguages: Array<{code: string, name: string, flag: string}>;
  changeLanguage: (lang: string) => Promise<void>;
  isRTL: boolean;
}

const SUPPORTED_LANGUAGES = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('vi');
  
  const changeLanguage = async (lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferred-language', lang);
    
    // Update user preference in backend
    await fetch('/api/user/language', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: lang })
    });
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      supportedLanguages: SUPPORTED_LANGUAGES,
      changeLanguage,
      isRTL: ['ar', 'fa', 'he'].includes(currentLanguage)
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
```

#### 🗄️ **Database Schema cho i18n**

```sql
-- Enhanced user table with language preference
ALTER TABLE users ADD COLUMN language_preference VARCHAR(10) DEFAULT 'vi';
ALTER TABLE users ADD COLUMN timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh';
ALTER TABLE users ADD COLUMN date_format VARCHAR(20) DEFAULT 'dd/MM/yyyy';

-- Multilingual content tables
CREATE TABLE recipe_translations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    UNIQUE KEY unique_recipe_language (recipe_id, language_code)
);

CREATE TABLE category_translations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    UNIQUE KEY unique_category_language (category_id, language_code)
);

-- AI interactions with language tracking
ALTER TABLE ai_interactions ADD COLUMN user_language VARCHAR(10) DEFAULT 'vi';
ALTER TABLE ai_interactions ADD COLUMN response_language VARCHAR(10) DEFAULT 'vi';
```

#### 🤖 **AI Service i18n Support**

```python
# AI Service với multilingual support
class MultilingualAIService:
    def __init__(self):
        self.supported_languages = ['vi', 'en', 'ja', 'ko', 'zh']
        self.default_language = 'vi'
    
    async def generate_recipe(self, ingredients: List[str], user_language: str = 'vi'):
        """Generate recipe in user's preferred language"""
        
        # Language-specific prompts
        prompts = {
            'vi': f"Tạo công thức nấu ăn từ các nguyên liệu: {', '.join(ingredients)}",
            'en': f"Create a cooking recipe using ingredients: {', '.join(ingredients)}",
            'ja': f"材料を使った料理レシピを作成してください: {', '.join(ingredients)}",
            'ko': f"재료를 사용한 요리 레시피를 만들어 주세요: {', '.join(ingredients)}",
            'zh': f"使用以下食材创建烹饪食谱: {', '.join(ingredients)}"
        }
        
        prompt = prompts.get(user_language, prompts['vi'])
        
        response = await openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": f"You are a helpful cooking assistant. Respond in {user_language}."},
                {"role": "user", "content": prompt}
            ]
        )
        
        return {
            "recipe": response.choices[0].message.content,
            "language": user_language,
            "ingredients": ingredients
        }
    
    async def voice_to_text(self, audio_file, language: str = 'vi'):
        """Convert speech to text with language support"""
        
        # Language-specific voice models
        language_models = {
            'vi': 'vietnamese-voice-model',
            'en': 'english-voice-model',
            'ja': 'japanese-voice-model',
            'ko': 'korean-voice-model',
            'zh': 'chinese-voice-model'
        }
        
        model = language_models.get(language, language_models['vi'])
        
        transcript = await speech_to_text_service.transcribe(
            audio_file, 
            model=model,
            language=language
        )
        
        return {
            "transcript": transcript,
            "language": language,
            "confidence": 0.95
        }
```

#### 📱 **Mobile i18n Best Practices**

```dart
// Smart Cooking AI Mobile - Advanced i18n
class LocalizationService {
  static const List<Locale> supportedLocales = [
    Locale('vi', 'VN'),
    Locale('en', 'US'),
    Locale('ja', 'JP'),
    Locale('ko', 'KR'),
    Locale('zh', 'CN'),
  ];
  
  static String getLanguageName(String languageCode) {
    switch (languageCode) {
      case 'vi': return '🇻🇳 Tiếng Việt';
      case 'en': return '🇺🇸 English';
      case 'ja': return '🇯🇵 日本語';
      case 'ko': return '🇰🇷 한국어';
      case 'zh': return '🇨🇳 中文';
      default: return '🇻🇳 Tiếng Việt';
    }
  }
  
  static Future<void> changeLanguage(BuildContext context, String languageCode) async {
    await context.setLocale(Locale(languageCode));
    
    // Save to local storage
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('language', languageCode);
    
    // Update backend
    await ApiService.updateUserLanguage(languageCode);
  }
}

// Usage in widgets
class LanguageSwitcher extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return DropdownButton<String>(
      value: context.locale.languageCode,
      items: LocalizationService.supportedLocales.map((locale) {
        return DropdownMenuItem(
          value: locale.languageCode,
          child: Text(LocalizationService.getLanguageName(locale.languageCode)),
        );
      }).toList(),
      onChanged: (String? languageCode) {
        if (languageCode != null) {
          LocalizationService.changeLanguage(context, languageCode);
        }
      },
    );
  }
}
```

#### 🌍 **SEO & Metadata i18n**

```typescript
// Next.js SEO với i18n
export const generateMetadata = ({ params }: { params: { locale: string } }) => {
  const metadata = {
    vi: {
      title: 'Smart Cooking AI - Hệ thống Nấu ăn Thông minh',
      description: 'Nền tảng nấu ăn tích hợp AI, trợ lý giọng nói và nhận dạng món ăn thông minh',
      keywords: 'nấu ăn, AI, công thức, giọng nói, thông minh'
    },
    en: {
      title: 'Smart Cooking AI - Intelligent Cooking System',
      description: 'AI-powered cooking platform with voice assistant and smart food recognition',
      keywords: 'cooking, AI, recipes, voice, smart, assistant'
    },
    ja: {
      title: 'Smart Cooking AI - インテリジェント料理システム',
      description: 'AI搭載の料理プラットフォーム、音声アシスタントとスマートフード認識',
      keywords: '料理, AI, レシピ, 音声, スマート, アシスタント'
    }
  };
  
  const locale = params.locale || 'vi';
  const meta = metadata[locale] || metadata.vi;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale: locale,
      alternateLocale: Object.keys(metadata).filter(l => l !== locale),
    }
  };
};
```

#### 🎯 **Implementation Guidelines**

1. **🔧 Setup Priority**: Cài đặt i18n cho Frontend trước, sau đó Mobile
2. **📝 Content Strategy**: Tiếng Việt làm content chính, English cho SEO quốc tế  
3. **🤖 AI Integration**: AI responses phải match với ngôn ngữ của user
4. **🎤 Voice Support**: STT/TTS hỗ trợ multi-language
5. **🗄️ Database**: Multilingual schema cho tất cả user-generated content
6. **📱 Mobile**: Easy language switcher trong settings
7. **🔄 Sync**: Language preference sync giữa web và mobile

#### ✅ **Testing Strategy**

- **Unit Tests**: Test translation files integrity
- **E2E Tests**: Test language switching flows  
- **Voice Tests**: Test STT/TTS trong các ngôn ngữ khác nhau
- **API Tests**: Test multilingual API responses
- **UI Tests**: Test layout với different text lengths

### � **Tính năng Dựa trên Vị trí (Geolocation Features)**

**Smart Cooking AI** tích hợp định vị để cá nhân hóa trải nghiệm người dùng và cung cấp gợi ý phù hợp với văn hóa ẩm thực địa phương.

#### 🍲 **Gợi ý món ăn theo vùng miền**

**Mô tả**: Dựa trên vị trí hiện tại của người dùng (ví dụ: miền Bắc, Trung, Nam Việt Nam), AI sẽ gợi ý các món ăn đặc trưng của vùng đó.

**Ví dụ thực tế**:
- *"Bạn đang ở Huế? Hôm nay thử bún bò Huế nhé!"*
- *"Ở Hà Nội rồi à? Phở Hà Nội chính hiệu đây!"*
- *"Sài Gòn nóng quá, làm chén chè ba màu cho mát nhé!"*

```python
# AI Service với regional suggestions
async def get_regional_suggestions(user_location: dict, user_language: str = 'vi'):
    """Get food suggestions based on user's current location"""
    
    # Vietnam regional mapping
    regional_specialties = {
        'mien_bac': {
            'vi': ['Phở Hà Nội', 'Bún chả', 'Chả cá Lã Vọng', 'Bánh cuốn'],
            'en': ['Hanoi Pho', 'Bun Cha', 'Cha Ca La Vong', 'Banh Cuon']
        },
        'mien_trung': {
            'vi': ['Bún bò Huế', 'Mì Quảng', 'Cao lầu', 'Bánh khoái'],
            'en': ['Hue Beef Noodle Soup', 'Mi Quang', 'Cao Lau', 'Banh Khoai']
        },
        'mien_nam': {
            'vi': ['Bún thịt nướng', 'Bánh xèo', 'Hủ tiếu', 'Chè ba màu'],
            'en': ['Grilled Pork Vermicelli', 'Banh Xeo', 'Hu Tieu', 'Three-Color Dessert']
        }
    }
    
    # Detect region based on coordinates
    region = detect_vietnam_region(user_location['latitude'], user_location['longitude'])
    
    suggestions = regional_specialties.get(region, {}).get(user_language, [])
    
    return {
        "region": region,
        "suggestions": suggestions,
        "message": f"regional_suggestions.{region}".format(region=region)
    }

def detect_vietnam_region(lat: float, lng: float) -> str:
    """Detect Vietnam region based on coordinates"""
    if lat > 20.0:  # Roughly north of Thanh Hoa
        return 'mien_bac'
    elif lat > 16.0:  # Between Thanh Hoa and Da Nang
        return 'mien_trung'
    else:  # South of Da Nang
        return 'mien_nam'
```

#### 🛒 **Tìm cửa hàng nguyên liệu gần nhất**

**Mô tả**: Gợi ý các siêu thị, chợ hoặc cửa hàng chuyên dụng bán nguyên liệu cho một công thức cụ thể, dựa trên vị trí của người dùng.

**Tích hợp**: 
- **Google Maps API**: Tìm kiếm và hiển thị đường đi
- **Places API**: Thông tin chi tiết về cửa hàng
- **Directions API**: Route optimization

```typescript
// Frontend service cho store locator
export class StoreLocatorService {
  private googleMapsApi: string;
  
  async findNearbyStores(userLocation: LatLng, ingredients: string[]): Promise<Store[]> {
    const storeTypes = this.categorizeIngredients(ingredients);
    const nearbyStores: Store[] = [];
    
    // Search for different types of stores
    for (const storeType of storeTypes) {
      const stores = await this.searchStoresByType(userLocation, storeType);
      nearbyStores.push(...stores);
    }
    
    // Sort by distance and rating
    return nearbyStores.sort((a, b) => a.distance - b.distance);
  }
  
  private categorizeIngredients(ingredients: string[]): StoreType[] {
    const categories = new Set<StoreType>();
    
    for (const ingredient of ingredients) {
      if (this.isMeat(ingredient)) categories.add('butcher');
      if (this.isSeafood(ingredient)) categories.add('fish_market');
      if (this.isVegetable(ingredient)) categories.add('vegetable_market');
      if (this.isSpice(ingredient)) categories.add('spice_shop');
      categories.add('supermarket'); // Fallback
    }
    
    return Array.from(categories);
  }
  
  async getDirections(from: LatLng, to: LatLng): Promise<Route> {
    // Google Directions API integration
    const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&key=${this.googleMapsApi}`);
    return response.json();
  }
}
```

#### 🗺️ **Xây dựng Profile ẩm thực vùng miền**

**Mô tả**: Tự động lưu `region_preference` của người dùng dựa trên vị trí thường xuyên truy cập.

**Ứng dụng**: AI sẽ sử dụng thông tin này để tạo ra các lộ trình học nấu ăn phù hợp với khẩu vị và nguyên liệu địa phương.

```sql
-- Regional profile tracking table
CREATE TABLE user_location_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    region VARCHAR(50),
    city VARCHAR(100),
    visit_count INT DEFAULT 1,
    last_visited TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user_location (user_id, latitude, longitude)
);

-- Regional cuisine preferences
CREATE TABLE user_regional_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    region VARCHAR(50) NOT NULL,
    preference_score DECIMAL(3, 2) DEFAULT 0.5, -- 0.0 to 1.0
    favorite_dishes JSON,
    dietary_restrictions JSON,
    spice_tolerance ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user_region (user_id, region)
);
```

```python
# Backend service cho regional profiling
class RegionalProfileService:
    def __init__(self, db_session):
        self.db = db_session
    
    async def update_user_location(self, user_id: int, location: dict):
        """Update user location and build regional profile"""
        
        # Detect region
        region = detect_vietnam_region(location['latitude'], location['longitude'])
        
        # Update location history
        await self.update_location_history(user_id, location, region)
        
        # Update regional preferences
        await self.update_regional_preferences(user_id, region)
        
        return {
            "region": region,
            "updated_profile": True
        }
    
    async def get_personalized_learning_path(self, user_id: int):
        """Create learning path based on regional preferences"""
        
        preferences = await self.get_user_regional_preferences(user_id)
        primary_region = preferences.get('primary_region', 'mien_bac')
        
        # Create learning curriculum based on region
        curriculum = {
            'mien_bac': ['Phở cơ bản', 'Bún chả', 'Bánh cuốn', 'Chả cá'],
            'mien_trung': ['Bún bò Huế', 'Mì Quảng', 'Bánh khoái', 'Nem lụi'],
            'mien_nam': ['Bánh xèo', 'Hủ tiếu', 'Bánh mì', 'Chè đậu xanh']
        }
        
        return {
            "region": primary_region,
            "learning_path": curriculum.get(primary_region, []),
            "estimated_weeks": len(curriculum.get(primary_region, [])) * 2
        }
```

#### 📍 **Chia sẻ món ăn gắn với vị trí**

**Mô tả**: Cho phép người dùng "check-in" hoặc gắn thẻ vị trí địa lý khi chia sẻ một công thức hoặc một món ăn đã nấu.

**Ví dụ**: 
- *"Món cá kho làng Vũ Đại tại Hà Nam"*
- *"Phở Thìn Hà Nội chính hiệu"*
- *"Bánh xèo miền Tây tại Cần Thơ"*

```typescript
// Frontend component cho location tagging
export const RecipeLocationTagger: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [locationTag, setLocationTag] = useState<string>('');
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          reverseGeocode(location);
        },
        (error) => console.error('Location error:', error)
      );
    }
  };
  
  const reverseGeocode = async (location: LatLng) => {
    try {
      const response = await fetch(`/api/geocode/reverse?lat=${location.lat}&lng=${location.lng}`);
      const data = await response.json();
      setLocationTag(data.formatted_address);
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };
  
  return (
    <div className="location-tagger">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isLocationEnabled}
          onChange={(e) => setIsLocationEnabled(e.target.checked)}
          className="rounded"
        />
        <label>📍 Gắn vị trí cho món ăn</label>
      </div>
      
      {isLocationEnabled && (
        <div className="mt-2">
          <button
            onClick={getCurrentLocation}
            className="btn btn-outline btn-sm"
          >
            📍 Lấy vị trí hiện tại
          </button>
          
          {locationTag && (
            <div className="mt-2 p-2 bg-blue-50 rounded">
              <span className="text-sm text-blue-700">
                📍 {locationTag}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

#### 🗺️ **Google Maps Integration**

```typescript
// Maps service integration
export class GoogleMapsService {
  private map: google.maps.Map;
  private placesService: google.maps.places.PlacesService;
  
  async initializeMap(element: HTMLElement, center: LatLng) {
    this.map = new google.maps.Map(element, {
      center,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    
    this.placesService = new google.maps.places.PlacesService(this.map);
  }
  
  async searchNearbyStores(location: LatLng, storeType: string): Promise<Place[]> {
    return new Promise((resolve, reject) => {
      const request = {
        location: new google.maps.LatLng(location.lat, location.lng),
        radius: 2000, // 2km radius
        type: storeType,
        keyword: 'supermarket grocery food market'
      };
      
      this.placesService.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(results || []);
        } else {
          reject(new Error(`Places search failed: ${status}`));
        }
      });
    });
  }
  
  addStoreMarkers(stores: Place[]) {
    stores.forEach(store => {
      const marker = new google.maps.Marker({
        position: store.geometry?.location,
        map: this.map,
        title: store.name,
        icon: {
          url: '/icons/store-marker.png',
          scaledSize: new google.maps.Size(30, 30)
        }
      });
      
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div>
            <h4>${store.name}</h4>
            <p>Rating: ${store.rating} ⭐</p>
            <p>${store.vicinity}</p>
            <button onclick="getDirections('${store.place_id}')">
              Chỉ đường
            </button>
          </div>
        `
      });
      
      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });
    });
  }
}
```

### �🎤 Voice Assistant Architecture

#### STT (Speech-to-Text) Flow
```python
# FastAPI voice service
@app.post("/api/voice/stt")
async def speech_to_text(audio: UploadFile):
    # Convert audio to text using OpenAI Whisper or Google STT
    transcript = await stt_service.transcribe(audio)
    # Extract intent and entities
    intent = await nlp_service.extract_intent(transcript)
    return {"transcript": transcript, "intent": intent}
```

#### TTS (Text-to-Speech) Flow
```python
@app.post("/api/voice/tts")
async def text_to_speech(request: TTSRequest):
    # Generate speech from text
    audio_data = await tts_service.synthesize(
        text=request.text,
        language=request.language,
        voice=request.voice_type
    )
    return StreamingResponse(audio_data, media_type="audio/mpeg")
```

#### Voice Command Processing
```python
class VoiceCommandProcessor:
    def __init__(self):
        self.intent_patterns = {
            'create_recipe': r'(tạo|làm|nấu).*?(món|công thức)',
            'find_recipe': r'(tìm|kiếm).*?(món|công thức)',
            'change_language': r'(đổi|chuyển).*?(ngôn ngữ|tiếng)',
            'nutrition_analysis': r'(phân tích|kiểm tra).*?(dinh dưỡng|calo)'
        }
    
    async def process_command(self, transcript: str, user_language: str):
        intent = self.extract_intent(transcript)
        return await self.execute_intent(intent, transcript, user_language)
```

### 📊 Analytics & Looker Studio Integration

#### Data Collection
```java
@Service
public class AnalyticsService {
    public void trackAIInteraction(Long userId, String interactionType, 
                                 Object inputData, Object outputData) {
        AIInteraction interaction = AIInteraction.builder()
            .userId(userId)
            .interactionType(InteractionType.valueOf(interactionType))
            .inputData(objectMapper.writeValueAsString(inputData))
            .outputData(objectMapper.writeValueAsString(outputData))
            .language(getCurrentUserLanguage())
            .processingTimeMs(System.currentTimeMillis() - startTime)
            .build();
        
        aiInteractionRepository.save(interaction);
        
        // Send to analytics pipeline
        analyticsPublisher.publish(interaction);
    }
}
```

#### Looker Studio Connector
```sql
-- Analytics views for Looker Studio
CREATE VIEW analytics_daily_usage AS
SELECT 
    DATE(created_at) as date,
    interaction_type,
    language,
    COUNT(*) as interaction_count,
    AVG(processing_time_ms) as avg_processing_time,
    COUNT(DISTINCT user_id) as unique_users
FROM ai_interactions 
GROUP BY DATE(created_at), interaction_type, language;

CREATE VIEW analytics_recipe_popularity AS
SELECT 
    r.id,
    r.title_en,
    r.title_vi,
    COUNT(DISTINCT ai.user_id) as unique_users_generated,
    AVG(r.calories) as avg_calories,
    r.difficulty,
    COUNT(*) as generation_count
FROM recipes r
JOIN ai_interactions ai ON JSON_EXTRACT(ai.output_data, '$.recipe_id') = r.id
WHERE ai.interaction_type = 'RECIPE_GENERATION'
GROUP BY r.id;
```

### Quy ước Cấu trúc Thư mục

```
backend/src/main/java/com/cookingapp/
├── controller/        # Các REST endpoint, sử dụng @CrossOrigin cho CORS
├── service/           # Logic nghiệp vụ, gọi AI service qua WebClient
├── config/            # Cấu hình bảo mật, CORS, DB
├── entity/            # Các entity JPA với Lombok @Data
└── dto/               # Các đối tượng Request/Response

ai-service/src/
├── main.py            # Ứng dụng FastAPI với middleware CORS
├── services/          # openai_service.py, gemini_service.py, voice_processing.py
├── routes/            # Các handler định tuyến API
└── utils/             # helpers.py, constants.py

frontend-web/src/
├── app/               # Next.js 14 app router
├── components/        # Sắp xếp theo tính năng (ai/, recipes/, voice/)
├── hooks/             # useAuth.ts, useAI.ts, useVoice.ts
└── types/             # Định nghĩa TypeScript
```

### Lệnh Docker & Cơ sở dữ liệu

```bash
# Khởi động chỉ các service cốt lõi
docker-compose up -d mysql redis minio

# Khởi động toàn bộ stack
docker-compose up -d

# Chế độ phát triển cho từng service riêng lẻ
cd backend && ./mvnw spring-boot:run
cd ai-service && uvicorn src.main:app --reload --port 8001
cd frontend-web && npm run dev
```

### Cấu hình Môi trường

  * Sao chép `.env.example` sang `.env` và cấu hình các khóa API.
  * Các biến quan trọng: `OPENAI_API_KEY`, `GEMINI_API_KEY`, `GOOGLE_CLIENT_ID/SECRET`.
  * Backend sử dụng `application.properties` với mẫu `${VAR_NAME:default}`.
  * AI service tải biến môi trường từ `.env` thông qua `python-dotenv`.

### Các Mẫu API

**Spring Boot Controllers:**

```java
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AIController {
    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody ChatRequest request,
                                  @RequestHeader("Authorization") String token) {
        // Ủy quyền cho AI service
    }
}
```

**FastAPI Services:**

```python
@app.post("/api/ai/chat")
async def chat_with_ai(request: ChatRequest):
    return await openai_service.chat_response(request.message, request.context)
```

### Chiến lược Kiểm thử

  * Backend: `./mvnw test` (kiểm thử tích hợp với TestRestTemplate).
  * Frontend: `npm run test` (Jest + Testing Library).
  * AI Service: `pytest` với các fixtures kiểm thử bất đồng bộ.

### Tích hợp Giọng nói & AI

  * Xử lý giọng nói sử dụng các API của trình duyệt (SpeechRecognition/SpeechSynthesis) kết hợp với STT/TTS phía server.
  * Tạo công thức yêu cầu một mảng nguyên liệu và một đối tượng tùy chọn.
  * Phân tích hình ảnh sử dụng Gemini Vision API thông qua upload multipart.
  * Tất cả phản hồi từ AI tuân theo một mẫu xử lý lỗi nhất quán.

### Các Vấn đề Phổ biến & Giải pháp

  * **CORS**: Cấu hình trong cả Spring Boot WebConfig và middleware CORS của FastAPI.
  * **Tải lên tệp**: Sử dụng `MultipartFile` trong Spring Boot, `UploadFile` trong FastAPI.
  * **Mạng Docker**: Các service giao tiếp qua tên container, không phải `localhost`.
  * **Tải biến môi trường**: Backend tự động tải từ môi trường, AI service cần `dotenv` rõ ràng.

-----

## Phát triển Ứng dụng Di động (Flutter)

  * Sử dụng mẫu **Provider** để quản lý trạng thái.
  * Các service trong `lib/services/` phản ánh cấu trúc API của backend.
  * Các widget được tổ chức theo tính năng trong `lib/widgets/`.
  * Ghi âm giọng nói qua các gói `speech_to_text` và `flutter_tts`.

-----

-----

## 💼 Phân vai Team & Development Strategy

### 🏗️ Team Structure (4 developers)

| Vai trò                    | Nhiệm vụ chính                                     | Tech Stack                           |
| -------------------------- | --------------------------------------------------- | ------------------------------------ |
| Backend Dev (AI + Voice)   | GPT/Gemini integration, Voice AI, FastAPI services | Python, FastAPI, OpenAI, Gemini API |
| Backend Dev (Logic + Auth) | CRUD, Google OAuth2, roles, i18n backend          | Spring Boot, MySQL, JWT, Docker     |
| Web Dev (Next.js)          | UI/UX web, chatbot, OAuth2 client, i18n frontend  | Next.js, React, NextAuth, Tailwind  |
| Mobile Dev (Flutter)       | Voice/chat/AI, mobile UI, OAuth2, i18n mobile     | Flutter, Dart, Material Design      |

### 🚀 Development Workflow

#### Phase 1: Foundation (Weeks 1-2)
- [ ] Database schema & Docker setup
- [ ] Spring Boot API structure với authentication
- [ ] Next.js basic layout với routing
- [ ] Flutter app structure với navigation

#### Phase 2: Core Features (Weeks 3-4)
- [ ] Recipe CRUD operations
- [ ] Google OAuth2 implementation
- [ ] Basic AI chat integration
- [ ] i18n setup for both web & mobile

#### Phase 3: AI Integration (Weeks 5-6)
- [ ] FastAPI AI service development
- [ ] Recipe generation với ingredients
- [ ] Image recognition với Gemini Vision
- [ ] Voice assistant STT/TTS

#### Phase 4: Advanced Features (Weeks 7-8)
- [ ] Learning path system
- [ ] Analytics tracking
- [ ] Looker Studio integration
- [ ] Performance optimization

#### Phase 5: Testing & Deployment (Weeks 9-10)
- [ ] End-to-end testing
- [ ] Production deployment
- [ ] Performance monitoring
- [ ] Documentation completion

### 🎯 Best Practices & Standards

#### Code Quality
- **Linting**: ESLint (Next.js), Flutter analyze (Flutter), Checkstyle (Spring Boot)
- **Testing**: Jest + Testing Library (Next.js), Widget testing (Flutter), JUnit (Spring Boot)
- **Type Safety**: TypeScript (Next.js), Dart (Flutter), Java với validation annotations

#### Security
- **Authentication**: JWT tokens với expiration, refresh token rotation
- **Authorization**: Role-based access control (RBAC)
- **Data Validation**: Input sanitization, SQL injection prevention
- **CORS**: Proper cross-origin resource sharing configuration

#### Performance
- **Caching**: Redis cho session, client-side caching cho React queries
- **Database**: Indexing, connection pooling, query optimization
- **CDN**: Firebase Storage hoặc CloudFront cho static assets
- **Monitoring**: Application logs, performance metrics

-----

**LƯU Ý QUAN TRỌNG:** **Hãy sử dụng tiếng Việt trong mỗi lần giải thích hoặc hướng dẫn từ AI Agent.**
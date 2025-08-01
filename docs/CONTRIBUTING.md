# 🤝 Contributing to Smart Cooking AI

Cảm ơn bạn quan tâm đến việc đóng góp cho **Smart Cooking AI**! 🎉

## 🌟 Cách thức Đóng góp

### 🐛 Báo cáo Lỗi (Bug Reports)

Trước khi báo cáo lỗi, vui lòng kiểm tra:

- [ ] Lỗi chưa được báo cáo trong [Issues](https://github.com/Yuhron9999/smart_cooking_AI/issues)
- [ ] Bạn đang sử dụng phiên bản mới nhất
- [ ] Đã thử các bước troubleshooting cơ bản

**Khi tạo bug report:**

1. Sử dụng template có sẵn
2. Mô tả chi tiết các bước tái tạo lỗi
3. Đính kèm screenshots hoặc logs
4. Ghi rõ môi trường (OS, browser, version)

### ✨ Đề xuất Tính năng (Feature Requests)

- Sử dụng [Feature Request Template](https://github.com/Yuhron9999/smart_cooking_AI/issues/new?template=feature_request.md)
- Giải thích rõ lý do cần tính năng này
- Đưa ra ví dụ use case cụ thể
- Thảo luận với community trước khi implement

### 🔧 Code Contributions

1. **Fork** repository này
2. **Clone** fork về máy local
3. Tạo **feature branch**: `git checkout -b feature/amazing-feature`
4. **Commit** thay đổi: `git commit -m 'Add amazing feature'`
5. **Push** lên branch: `git push origin feature/amazing-feature`
6. Mở **Pull Request**

## 🏗️ Development Setup

### 📋 Yêu cầu Hệ thống

- **Java 17+** (cho Spring Boot backend)
- **Node.js 18+** (cho Next.js frontend)
- **Python 3.9+** (cho AI service)
- **Flutter 3.16+** (cho mobile app)
- **Docker & Docker Compose**
- **MySQL 8.0+**
- **Redis 7.x**

### 🚀 Khởi động Local Development

```bash
# Clone repository
git clone https://github.com/Yuhron9999/smart_cooking_AI.git
cd smart_cooking_AI

# Khởi động services với Docker
docker-compose up -d mysql redis

# Backend (Spring Boot)
cd backend
./mvnw spring-boot:run

# AI Service (FastAPI)
cd ai-service
pip install -r requirements.txt
uvicorn app:app --reload --port 8001

# Frontend (Next.js)
cd frontend-web
npm install
npm run dev

# Mobile (Flutter)
cd mobile-app
flutter pub get
flutter run -d web-server --web-port 3002
```

## 📏 Coding Standards

### 🎯 General Guidelines

- **Ngôn ngữ commit**: Tiếng Việt cho commit message
- **Code comments**: Tiếng Anh cho technical comments
- **Documentation**: Tiếng Việt cho user-facing docs
- **Variable naming**: CamelCase (Java), snake_case (Python)

### ☕ Java (Spring Boot)

```java
// ✅ Good
@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    @GetMapping
    public ResponseEntity<List<RecipeDTO>> getAllRecipes() {
        return ResponseEntity.ok(recipeService.findAll());
    }
}
```

### 🐍 Python (FastAPI)

```python
# ✅ Good
from fastapi import APIRouter, Depends, HTTPException
from typing import List

router = APIRouter(prefix="/api/ai", tags=["AI"])

@router.post("/generate-recipe")
async def generate_recipe(
    request: RecipeGenerationRequest,
    current_user: User = Depends(get_current_user)
) -> RecipeResponse:
    """Generate recipe using AI based on ingredients."""
    pass
```

### ⚛️ TypeScript (Next.js)

```typescript
// ✅ Good
interface RecipeProps {
  recipe: Recipe;
  onUpdate: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeProps> = ({
  recipe,
  onUpdate
}) => {
  const { t } = useTranslation('recipe');

  return (
    <div className="recipe-card">
      <h3>{recipe.title}</h3>
    </div>
  );
};
```

### 🎯 Dart (Flutter)

```dart
// ✅ Good
class RecipeService {
  static const String _baseUrl = 'http://localhost:8080/api';

  Future<List<Recipe>> getRecipes() async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/recipes'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        return Recipe.fromJsonList(jsonDecode(response.body));
      }
      throw ApiException('Failed to load recipes');
    } catch (e) {
      throw ApiException('Network error: $e');
    }
  }
}
```

## 🧪 Testing Guidelines

### 📋 Test Coverage Requirements

- **Backend**: Minimum 80% code coverage
- **Frontend**: Minimum 70% coverage for utilities/hooks
- **AI Service**: All API endpoints must have tests
- **Mobile**: Widget tests for complex components

### 🔧 Running Tests

```bash
# Backend Tests
cd backend && ./mvnw test

# Frontend Tests
cd frontend-web && npm run test

# AI Service Tests
cd ai-service && pytest

# Mobile Tests
cd mobile-app && flutter test
```

## 📝 Commit Message Convention

Chúng tôi sử dụng format sau cho commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:

- `✨ feat`: Tính năng mới
- `🐛 fix`: Sửa lỗi
- `📚 docs`: Cập nhật documentation
- `💄 style`: Code formatting, không ảnh hưởng logic
- `♻️ refactor`: Code refactoring
- `🧪 test`: Thêm hoặc sửa tests
- `🔧 chore`: Build process, dependencies

### Ví dụ:

```
✨ feat(auth): thêm Google OAuth integration

- Tích hợp Google OAuth 2.0
- Thêm JWT token management
- Cập nhật UI cho login flow
- Thêm error handling và validation

Closes #123
```

## 🔍 Code Review Process

### 📋 Checklist cho Pull Request

- [ ] Code tuân theo coding standards
- [ ] Có tests cho tính năng mới
- [ ] Documentation được cập nhật
- [ ] CI/CD pipeline pass
- [ ] Không có security vulnerabilities
- [ ] Performance impact được đánh giá

### 👥 Review Requirements

- **Minor changes**: 1 approval từ maintainer
- **Major features**: 2 approvals từ core team
- **Security-related**: Bắt buộc review từ security team

## 🏷️ Issue Labels

| Label              | Mô tả                     |
| ------------------ | ------------------------- |
| `bug`              | Lỗi cần sửa               |
| `enhancement`      | Tính năng mới             |
| `documentation`    | Cải thiện docs            |
| `good-first-issue` | Phù hợp cho người mới     |
| `help-wanted`      | Cần hỗ trợ từ community   |
| `priority-high`    | Ưu tiên cao               |
| `ai-related`       | Liên quan đến AI features |
| `mobile`           | Mobile app specific       |
| `backend`          | Backend API changes       |
| `frontend`         | Frontend UI changes       |

## 🤝 Community Guidelines

### ✅ Quy tắc Ứng xử

- **Tôn trọng**: Lịch sự với mọi người
- **Xây dựng**: Đưa ra feedback constructive
- **Inclusive**: Chào đón mọi background
- **Collaborative**: Sẵn sàng học hỏi và chia sẻ

### 🚫 Không chấp nhận

- Harassment hoặc discrimination
- Spam hoặc self-promotion
- Off-topic discussions
- Sharing sensitive information

## 📞 Liên hệ

- **💬 Discussions**: [GitHub Discussions](https://github.com/Yuhron9999/smart_cooking_AI/discussions)
- **🐛 Issues**: [GitHub Issues](https://github.com/Yuhron9999/smart_cooking_AI/issues)
- **📧 Email**: maintainers@smartcooking.ai
- **💻 Discord**: [Smart Cooking AI Community](https://discord.gg/smartcooking)

## 🎉 Recognition

Chúng tôi đánh giá cao mọi đóng góp! Contributors sẽ được:

- ✅ Credit trong [CONTRIBUTORS.md](./CONTRIBUTORS.md)
- 🏆 Badges đặc biệt cho major contributions
- 📸 Feature trong community showcases
- 🎁 Swag package cho top contributors

---

**Cảm ơn bạn đã đóng góp cho Smart Cooking AI! 🚀**

Happy Coding! 👨‍💻👩‍💻

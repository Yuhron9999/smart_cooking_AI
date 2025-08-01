# 🌐 Smart Cooking AI - Internationalization (i18n) System

## 📋 Tổng quan

Hệ thống i18n của Smart Cooking AI hỗ trợ đa ngôn ngữ toàn diện với 5 ngôn ngữ chính:

- **🇻🇳 Tiếng Việt (vi)** - Ngôn ngữ mặc định
- **🇺🇸 English (en)** - Hỗ trợ quốc tế
- **🇯🇵 日本語 (ja)** - Tiếng Nhật
- **🇰🇷 한국어 (ko)** - Tiếng Hàn
- **🇨🇳 中文 (zh)** - Tiếng Trung

## 🏗️ Cấu trúc Hệ thống

### 📁 Message Properties Files

```
backend/src/main/resources/i18n/
├── messages.properties          # Default (Vietnamese fallback)
├── messages_vi.properties       # Vietnamese
├── messages_en.properties       # English
├── messages_ja.properties       # Japanese
├── messages_ko.properties       # Korean
└── messages_zh.properties       # Chinese
```

### 🔧 Java Classes

```
backend/src/main/java/com/smartcooking/ai/
├── config/
│   └── InternationalizationConfig.java    # Spring i18n configuration
├── service/
│   └── MessageService.java                # Message retrieval service
├── util/
│   ├── LocaleUtils.java                   # Locale utilities
│   └── ApiResponseHelper.java             # i18n API responses
└── controller/
    └── InternationalizationController.java # i18n endpoints
```

## 🎯 Cách sử dụng

### 1. Trong Controller

```java
@RestController
public class RecipeController {

    @Autowired
    private ApiResponseHelper apiResponseHelper;

    @PostMapping("/recipes")
    public ApiResponse<Recipe> createRecipe(@RequestBody Recipe recipe) {
        Recipe savedRecipe = recipeService.save(recipe);

        // Trả về response với message đã được i18n
        return apiResponseHelper.recipeSuccess(savedRecipe, "created");
    }

    @GetMapping("/recipes/{id}")
    public ApiResponse<Recipe> getRecipe(@PathVariable Long id) {
        Recipe recipe = recipeService.findById(id);

        if (recipe == null) {
            // Error response với message i18n
            return apiResponseHelper.recipeNotFound(id);
        }

        return apiResponseHelper.dataRetrieved(recipe);
    }
}
```

### 2. Sử dụng MessageService trực tiếp

```java
@Service
public class SomeService {

    @Autowired
    private MessageService messageService;

    public void someMethod() {
        // Lấy message cơ bản
        String message = messageService.getMessage("common.success");

        // Message với parameters
        String errorMsg = messageService.getMessage(
            "error.recipe.not_found",
            new Object[]{123}
        );

        // Message cho locale cụ thể
        Locale englishLocale = Locale.of("en", "US");
        String englishMsg = messageService.getMessage(
            "success.recipe.created",
            englishLocale
        );
    }
}
```

### 3. Chuyển đổi ngôn ngữ

```java
// API endpoint để thay đổi ngôn ngữ
POST /api/i18n/language?lang=en

// Response:
{
    "success": true,
    "message": "Language changed to 🇺🇸 English",
    "messageKey": "locale.language_changed",
    "language": "en",
    "timestamp": 1642123456789
}
```

## 📖 Message Categories

### 🔄 Common Messages (`common.*`)

```properties
common.success=Thành công
common.error=Có lỗi xảy ra
common.created=Đã tạo thành công
common.updated=Đã cập nhật thành công
common.deleted=Đã xóa thành công
```

### ✅ Success Messages (`success.*`)

```properties
success.recipe.created=Công thức nấu ăn đã được tạo thành công
success.user.profile_updated=Hồ sơ người dùng đã được cập nhật thành công
success.ai.recipe_generated=Công thức AI đã được tạo thành công
```

### ❌ Error Messages (`error.*`)

```properties
error.recipe.not_found=Không tìm thấy công thức nấu ăn với ID: {0}
error.user.email_exists=Email đã được sử dụng: {0}
error.auth.invalid_token=Token xác thực không hợp lệ
```

### 🔍 Validation Messages (`validation.*`)

```properties
validation.required=Trường {0} là bắt buộc
validation.email.invalid=Định dạng email không hợp lệ
validation.string.min_length=Trường {0} phải có ít nhất {1} ký tự
```

### 🏷️ Entity Labels (`entity.*`)

```properties
entity.recipe=Công thức nấu ăn
entity.user=Người dùng
entity.ingredient=Nguyên liệu
```

## 🛠️ API Endpoints

### Language Management

```http
# Thay đổi ngôn ngữ
POST /api/i18n/language?lang=en

# Lấy thông tin locale hiện tại
GET /api/i18n/current

# Lấy danh sách ngôn ngữ được hỗ trợ
GET /api/i18n/supported

# Demo messages i18n
GET /api/i18n/demo
```

### Message Retrieval

```http
# Lấy message theo key
GET /api/i18n/message?messageKey=success.recipe.created

# Lấy message với parameters
GET /api/i18n/message?messageKey=error.recipe.not_found&args=123

# Validate language code
GET /api/i18n/validate/en

# Detect language từ Accept-Language header
GET /api/i18n/detect
```

## 💡 Best Practices

### 1. Controller Design

```java
@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private ApiResponseHelper apiResponseHelper;

    // ✅ Good: Sử dụng ApiResponseHelper
    @PostMapping
    public ApiResponse<Recipe> create(@RequestBody Recipe recipe) {
        try {
            Recipe saved = recipeService.save(recipe);
            return apiResponseHelper.recipeSuccess(saved, "created");
        } catch (ValidationException e) {
            return apiResponseHelper.validationError("required", "title");
        }
    }

    // ❌ Bad: Hard-coded messages
    @PostMapping
    public ApiResponse<Recipe> createBad(@RequestBody Recipe recipe) {
        Recipe saved = recipeService.save(recipe);
        return ApiResponse.success(saved, "Recipe created successfully");
    }
}
```

### 2. Error Handling

```java
@ExceptionHandler(EntityNotFoundException.class)
public ApiResponse<Void> handleNotFound(EntityNotFoundException e) {
    if (e.getEntityType().equals("Recipe")) {
        return apiResponseHelper.recipeNotFound(e.getId());
    } else if (e.getEntityType().equals("User")) {
        return apiResponseHelper.userNotFound(e.getId());
    }
    return apiResponseHelper.notFound();
}
```

### 3. Validation Messages

```java
@Entity
public class Recipe {

    @NotBlank(message = "{validation.required}")
    private String title;

    @Size(min = 10, max = 1000, message = "{validation.string.length}")
    private String description;

    @Min(value = 1, message = "{validation.number.min}")
    private Integer cookingTime;
}
```

## 🧪 Testing

### Unit Test Example

```java
@ExtendWith(MockitoExtension.class)
class MessageServiceTest {

    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private MessageService messageService;

    @Test
    void testGetMessage() {
        // Given
        when(messageSource.getMessage(eq("common.success"),
                                    any(),
                                    any(Locale.class)))
            .thenReturn("Success");

        // When
        String message = messageService.getMessage("common.success");

        // Then
        assertThat(message).isEqualTo("Success");
    }
}
```

## 🔄 Frontend Integration

### Next.js Web Application

```typescript
// API call để thay đổi ngôn ngữ
const changeLanguage = async (lang: string) => {
  const response = await fetch(`/api/i18n/language?lang=${lang}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (result.success) {
    // Reload page hoặc update state
    window.location.reload();
  }
};
```

### Flutter Mobile Application

```dart
class ApiService {
    static Future<void> changeLanguage(String languageCode) async {
        final response = await http.post(
            Uri.parse('$baseUrl/api/i18n/language?lang=$languageCode'),
            headers: {'Authorization': 'Bearer $token'},
        );

        if (response.statusCode == 200) {
            // Update local storage và restart app
            await SharedPreferences.getInstance()
                .then((prefs) => prefs.setString('language', languageCode));
        }
    }
}
```

## 🚀 Deployment Notes

1. **Encoding**: Đảm bảo tất cả `.properties` files sử dụng UTF-8 encoding
2. **Cache**: Messages được cache 1 giờ để tối ưu performance
3. **Fallback**: Nếu message không tìm thấy, hệ thống sẽ fallback về Vietnamese
4. **Logging**: Errors khi không tìm thấy message sẽ được log

## 📈 Future Enhancements

1. **RTL Support**: Sẵn sàng cho các ngôn ngữ RTL (Arabic, Persian)
2. **Pluralization**: Hỗ trợ đa số/ít số cho các ngôn ngữ phức tạp
3. **Regional Variants**: Hỗ trợ biến thể vùng miền (en_US, en_GB)
4. **Dynamic Loading**: Tải messages động theo nhu cầu

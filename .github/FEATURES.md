# Smart Cooking AI - Tính năng mới phát triển

## 📋 Tổng quan về các tính năng mới

Dự án Smart Cooking AI đã được bổ sung thêm nhiều tính năng và thành phần mới để hỗ trợ việc học và tạo công thức nấu ăn thông minh với tích hợp AI. Tài liệu này mô tả chi tiết về những tính năng này.

## 🏗️ Cấu trúc Dữ liệu

### 1. Entity

#### 1.1. User Authentication & Management

- **User**: Thực thể chính quản lý thông tin người dùng, hỗ trợ Google OAuth2
- **UserPreferences**: Quản lý các tùy chọn người dùng như ngôn ngữ, theme

#### 1.2. Recipe Management

- **Recipe**: Thực thể quản lý công thức nấu ăn
- **Category**: Phân loại công thức nấu ăn
- **Ingredient**: Quản lý thông tin nguyên liệu
- **RecipeIngredient**: Mapping giữa công thức và nguyên liệu, bao gồm số lượng, đơn vị
- **UserRecipeList**: Quản lý danh sách công thức yêu thích, đã hoàn thành, muốn thử của người dùng

#### 1.3. Learning Management

- **UserLearningPath**: Lộ trình học nấu ăn được cá nhân hóa cho người dùng
- **LearningItem**: Các mục học trong lộ trình

#### 1.4. AI Integration

- **ChatHistory**: Lịch sử trò chuyện với trợ lý AI
- **UserAIInteraction**: Theo dõi tương tác của người dùng với các tính năng AI
- **AnalyticsDailyStats**: Thống kê hàng ngày về hoạt động của hệ thống
- **AnalyticsUserActivity**: Theo dõi hoạt động của người dùng
- **FileStorage**: Quản lý tệp đa phương tiện (hình ảnh, âm thanh)

## 🔐 Hệ thống Xác thực

### 1. Google OAuth2 Integration

- Hỗ trợ đăng nhập bằng tài khoản Google
- Quản lý thông tin người dùng từ Google (tên, email, avatar)
- Tự động tạo tài khoản mới hoặc liên kết với tài khoản hiện có

### 2. JWT Authentication

- Xác thực bằng JSON Web Token
- Phân quyền dựa trên vai trò (USER, ADMIN, TEACHER)
- Bảo mật API endpoints dựa trên quyền hạn

## 🍔 Quản lý Công thức & Nguyên liệu

### 1. Category Management

- CRUD cho danh mục công thức
- Phân quyền chỉ cho phép ADMIN thêm/sửa/xóa danh mục
- Hỗ trợ soft delete (đánh dấu không hoạt động thay vì xóa hẳn)

### 2. Ingredient Management

- CRUD cho nguyên liệu
- Lưu trữ thông tin dinh dưỡng, dị ứng
- Tìm kiếm nguyên liệu theo tên, danh mục

### 3. User Recipe Lists

- Thêm công thức vào danh sách yêu thích, muốn thử, đã hoàn thành
- Đánh giá và viết nhận xét cho công thức đã thử
- Quản lý quyền truy cập (người dùng chỉ có thể sửa đổi danh sách của họ)

## 📊 Analytics & Monitoring

### 1. User Activity Tracking

- Theo dõi hoạt động người dùng (xem công thức, tạo công thức, v.v.)
- Phân tích lịch sử tương tác AI

### 2. System Statistics

- Thống kê người dùng hoạt động hàng ngày
- Số lượng công thức mới
- Số lượt tương tác AI

## 🔄 API Endpoints

### 1. Authentication API

- `/api/auth/register`: Đăng ký người dùng mới
- `/api/auth/login`: Đăng nhập bằng email/password
- `/api/auth/google-login`: Đăng nhập bằng Google OAuth2
- `/api/auth/logout`: Đăng xuất

### 2. Recipe & Ingredient API

- `/api/ingredients`: CRUD cho nguyên liệu
- `/api/categories`: CRUD cho danh mục
- `/api/user-recipes/{userId}/{listType}`: Quản lý danh sách công thức của người dùng
- `/api/user-recipes/{userId}/rate/{recipeId}`: Đánh giá và nhận xét công thức

## 🛡️ Bảo mật

### 1. CORS Configuration

- Cấu hình CORS để cho phép frontend (Next.js) và ứng dụng di động (Flutter) truy cập API
- Kiểm soát các HTTP methods được phép

### 2. Authorization

- Role-based access control
- API endpoints được bảo vệ bằng annotation `@PreAuthorize`

## 🚀 Hướng dẫn triển khai

### 1. Cấu hình Database

- Yêu cầu MySQL 8.0+
- Schema đã được tạo trong `database/init/01-schema.sql`
- Dữ liệu mẫu trong `database/init/02-data.sql`

### 2. Cài đặt dependencies

```bash
cd backend
./mvnw clean install
```

### 3. Chạy ứng dụng

```bash
./mvnw spring-boot:run
```

## 📝 Lưu ý cho Developers

- Luôn sử dụng `@PreAuthorize` để bảo vệ API endpoints
- Theo quy ước, các entity phải có annotation `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`
- API responses được chuẩn hóa bằng lớp `ApiResponse<T>`
- Luôn xử lý lỗi và trả về thông báo phù hợp thông qua `CustomExceptions`
